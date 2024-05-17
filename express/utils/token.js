const jwt = require("jsonwebtoken");
require("dotenv").config();

const crypto = require("crypto");

const signToken = (payload) =>
  jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRY }
  );

const verifyToken = (token) => jwt.verify(token, process.env.JWT_KEY);

const checkRole = ({ userRole, sysRole }) =>
  userRole.some((item) => sysRole.includes(item));

const generateOTP = () => crypto.randomInt(100000, 999999);

module.exports = { signToken, verifyToken, checkRole, generateOTP };
