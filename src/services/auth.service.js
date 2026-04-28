const { Actor } = require('../models/init');
const { hashedPassword, verifyPassword, createToken } = require('../utils/auth.utils');
const { response } = require('../utils/init');

class AuthService {
  /**
   * Check if contact already exists
   */
  static async contactExists(contact) {
    return await Actor.findOne({ where: { contact } });
  }

  /**
   * Check if admin already exists
   */
  static async adminExists() {
    return await Actor.findOne({ where: { role: 'admin' } });
  }

  /**
   * Find actor by contact
   */
  static async findByContact(contact) {
    return await Actor.findOne({ where: { contact } });
  }

  /**
   * Create new actor (signup)
   */
  static async createActor(contact, password, role) {
    try {
      const hashedPass = await hashedPassword(password);

      const newActor = await Actor.create({
        contact,
        password: hashedPass,
        role
      });

      return newActor;
    } catch (error) {
      throw response.sendThrowError(500, `Error creating actor: ${error.message}`);
    }
  }

  /**
   * Verify actor password
   */
  static async verifyActorPassword(inputPassword, hashedPass) {
    try {
      return await verifyPassword(inputPassword, hashedPass);
    } catch (error) {
      throw response.sendThrowError(500, `Error verifying password: ${error.message}`);
    }
  }

  /**
   * Generate JWT token
   */
  static generateToken(actor) {
    return createToken(
      {
        id: actor.id,
        contact: actor.contact,
        role: actor.role
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRATION
    );
  }

  /**
   * Signup service
   */
  static async signup(contact, password, role) {
    // Check if contact already exists
    const existingActor = await this.contactExists(contact);
    if (existingActor) {
      throw response.sendThrowError(409, `Contact already registered`);
    }

    // Check if admin already exists
    if (role === 'admin') {
      const adminExists = await this.adminExists();
      if (adminExists) {
        throw response.sendThrowError(403, 'Admin account already exists. Only one admin is allowed');
      }
    }

    // Create new actor
    const newActor = await this.createActor(contact, password, role);

    // Generate token
    const token = this.generateToken(newActor);

    return {
      contact: newActor.contact,
      role: newActor.role,
      token
    };
  }

  /**
   * Login service
   */
  static async login(contact, password) {
    // Find actor by contact
    const actor = await this.findByContact(contact);
    if (!actor) {
      throw response.sendThrowError(401, 'Invalid contact or password');
    }

    // Verify password
    const isPasswordValid = await this.verifyActorPassword(password, actor.password);
    if (!isPasswordValid) {
      throw response.sendThrowError(401, 'Invalid contact or password');
    }

    // Generate token
    const token = this.generateToken(actor);

    return {
      contact: actor.contact,
      role: actor.role,
      token
    };
  }
}

module.exports = AuthService;
