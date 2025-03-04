const User = require("../models/User"); 

const generateUsername = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CR${randomString}`;
};

const generateUniqueUsername = async (length = 6) => {
  let username;
  let isUnique = false;
  while (!isUnique) {
    username = generateUsername(length);
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return username;
};









module.exports = { generateUsername, generateUniqueUsername };
