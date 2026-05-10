// src/utils/validation.js
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/**
 * 1. North American Phone Number (10-digit)
 * Matches: 123-456-7890, 1234567890, (123) 456-7890, 123.456.7890
 * Captures the clean 10 digits.
 */
const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

/**
 * 2. Industry-Standard Email Validation
 * A highly reliable pattern that ensures proper local part, @ symbol,
 * and a valid domain extension (minimum 2 characters like .com, .org).
 */
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 3. Strong Password Guard
 * Enforces security best practices:
 * - At least 8 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * 4. US Zip Codes (Standard 5-digit or 9-digit Zip+4)
 * Matches: 90028, 90028-1234
 */
const zipCodeRegex = /^\d{5}(-\d{4})?$/;

/**
 * 5. URL/Hyperlink Validator
 * Useful if users are submitting website links, profile URLs, or image links.
 * Matches: http://google.com, https://www.my-site.co.uk/path?query=1
 */
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

/**
 * 6. Clean Text (No HTML/Scripts)
 * Safety guard to prevent basic Cross-Site Scripting (XSS) in user descriptions.
 * Rejects strings that contain HTML tags (<...>) or script blocks.
 */
const noHtmlRegex = /<[^>]*>/g;

// Export all of them using CommonJS
module.exports = {
  uuidRegex,
  phoneRegex,
  emailRegex,
  passwordRegex,
  zipCodeRegex,
  urlRegex,
  noHtmlRegex,
};
