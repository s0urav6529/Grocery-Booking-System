/**
 * Normalize phone number by removing formatting characters
 * @param {string} phone - Raw phone number
 * @returns {string} Normalized phone number
 */
const normalizePhone = (phone) => {
  if (!phone) return '';
  // Remove all non-digit and non-plus characters
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Validate phone number with country code
 * Format: +[country code][number]
 * Examples: +12125551234, +441234567890
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
const isValidPhoneWithCountryCode = (phone) => {
  if (!phone) return false;
  // Must start with +, followed by 1-3 digit country code, then 6+ digits
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate contact - either valid email or phone with country code
 * @param {string} contact - Email or phone to validate
 * @returns {object} { valid: boolean, type: 'email'|'phone', normalized: string }
 */
const validateAndNormalizeContact = (contact) => {
  if (!contact) {
    return { valid: false, type: null, normalized: null };
  }

  const trimmedContact = contact.trim();

  // Check if email
  if (isValidEmail(trimmedContact)) {
    return {
      valid: true,
      type: 'email',
      normalized: trimmedContact.toLowerCase()
    };
  }

  // Check if phone with country code
  const normalizedPhone = normalizePhone(trimmedContact);
  if (isValidPhoneWithCountryCode(normalizedPhone)) {
    return {
      valid: true,
      type: 'phone',
      normalized: normalizedPhone
    };
  }

  return { valid: false, type: null, normalized: null };
};

module.exports = {
  normalizePhone,
  isValidPhoneWithCountryCode,
  isValidEmail,
  validateAndNormalizeContact
};
