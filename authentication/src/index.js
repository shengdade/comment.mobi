const { sendMessage } = require('./util');
const { handleUser } = require('./handlers/userHandler');
const { handleAuth } = require('./handlers/authHandler');

exports.handler = async function (event, context, callback) {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));
  if (event.path === '/user') {
    await handleUser(event, context, callback);
  } else if (event.path === '/auth' && event.httpMethod === 'POST') {
    await handleAuth(event, context, callback);
  } else {
    sendMessage(400, 'Bad Request. Unsupported operation', callback);
  }
};
