const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function encrypt(text) {
  try {
    const hash = await bcrypt.hash(text, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
}

async function compare(plainText, hash) {
  try {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  } catch (error) {
    console.error("Comparison error:", error);
    throw new Error("Comparison failed");
  }
}

module.exports = {
  encrypt,
  compare,
};
