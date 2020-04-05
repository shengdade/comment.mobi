const jwt = require('jsonwebtoken');

const JWT_SECRET = '1041b84b-6031-4e52-89db-e2a058e69ce2';

exports.generateJwtToken = (payload) => jwt.sign(payload, JWT_SECRET);
exports.verifyJwtToken = (token, callback) =>
  jwt.verify(token, JWT_SECRET, callback);
