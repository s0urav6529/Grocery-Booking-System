/**
 * Generate slug from text
 * Converts text to lowercase, removes special characters, replaces spaces with hyphens
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove hyphens from start and end
};

/**
 * Generate unique slug by appending a counter if needed
 * @param {string} baseSlug - Base slug
 * @param {number} counter - Counter to append (optional)
 * @returns {string} Unique slug
 */
const appendToSlug = (baseSlug, counter = 1) => {
  return counter > 1 ? `${baseSlug}-${counter}` : baseSlug;
};

module.exports = { generateSlug, appendToSlug };
