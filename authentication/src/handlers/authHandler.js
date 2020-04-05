const { isValidPassword, sendResponse, sendMessage } = require('../util');
const { getUser } = require('../dynamodb');
const { generateJwtToken } = require('../token');
const { serialize } = require('cookie');
const { validators } = require('../users');

exports.handleAuth = async (event, context, callback) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    sendMessage(400, 'Bad Request', callback);
  }
  const validation = validators.auth.validate(body);
  if (validation.error) {
    sendResponse(400, JSON.stringify(validation.error.details), callback);
  } else {
    let user;
    try {
      user = await getUser(body.email);
    } catch (error) {
      sendMessage(500, 'Error retrieving user data', callback);
    }
    if (!user) {
      sendMessage(404, 'User does not exist', callback);
    }
    const isValid = isValidPassword(body.password, user.password);
    if (!isValid) {
      sendMessage(401, 'Incorrect password', callback);
    }
    const token = generateJwtToken({ email: user.email, role: user.role });
    callback(null, {
      statusCode: 200,
      headers: { 'Set-Cookie': serialize('authToken', token, { path: '/' }) },
      body: JSON.stringify({ status: 200, message: 'Login success' }),
    });
  }
};
