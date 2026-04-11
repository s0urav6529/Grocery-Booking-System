const { Actor } = require('../models/init');
const { hashedPassword, verifyPassword, createToken } = require('../utils/auth.utils');

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
      throw new Error(`Error creating actor: ${error.message}`);
    }
  }

  /**
   * Verify actor password
   */
  static async verifyActorPassword(inputPassword, hashedPassword) {
    try {
      return await verifyPassword(inputPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
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
    try {
      // Check if contact already exists
      const existingActor = await this.contactExists(contact);
      if (existingActor) {
        throw {
          status: 409,
          message: 'Contact already registered'
        };
      }

      // Check if admin already exists
      if (role === 'admin') {
        const adminExists = await this.adminExists();
        if (adminExists) {
          throw {
            status: 403,
            message: 'Admin account already exists. Only one admin is allowed'
          };
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
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login service
   */
  static async login(contact, password) {
    try {
      // Find actor by contact
      const actor = await this.findByContact(contact);
      if (!actor) {
        throw {
          status: 401,
          message: 'Invalid contact or password'
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyActorPassword(password, actor.password);
      if (!isPasswordValid) {
        throw {
          status: 401,
          message: 'Invalid contact or password'
        };
      }

      // Generate token
      const token = this.generateToken(actor);

      return {
        contact: actor.contact,
        role: actor.role,
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
