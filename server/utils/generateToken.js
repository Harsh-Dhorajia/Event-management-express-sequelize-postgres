const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config/config');

module.exports.generateToken = user => {
  const {
    id,
  } = user;
  return jwt.sign({
    id,
  },
  jwtSecretKey, {
    expiresIn: '12h',
  });
};
