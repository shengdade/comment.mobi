const bcrypt = require('bcryptjs');

exports.REGEX = {
  // minimum eight characters (up to 32), at least one letter and one number
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
};

exports.hashPassword = (password) => bcrypt.hashSync(password);

exports.isValidPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

exports.sendResponse = (statusCode, body, callback) => {
  callback(null, {
    statusCode,
    body,
  });
};

exports.sendMessage = (statusCode, message, callback) => {
  const body = JSON.stringify({ status: statusCode, message });
  callback(null, {
    statusCode,
    body,
  });
};
