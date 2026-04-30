const crypto = require("crypto");

const generateSecureString = (length = 32, format = "hex") => {
  return crypto.randomBytes(length).toString(format);
};

module.exports = generateSecureString;
