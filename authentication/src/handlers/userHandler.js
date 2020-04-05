const { registerUser, listUsers, editUser, removeUser } = require('../users');
const { sendMessage } = require('../util');
const { getUser } = require('../dynamodb');
const { verifyJwtToken } = require('../token');
const { parse } = require('cookie');

exports.handleUser = async (event, context, callback) => {
  if (event.httpMethod === 'POST') {
    await registerUser(event, context, callback);
  } else {
    // Except POST operation, the other operations need to be authenticated with admin credentials
    const cookies = parse(event.headers.Cookie || '');
    if (!cookies.authToken) {
      sendMessage(403, 'Forbidden. Missing authentication token', callback);
    }
    await verifyJwtToken(cookies.authToken, async (error, payload) => {
      if (error) {
        sendMessage(403, 'Forbidden. Invalid authentication token', callback);
      }
      const user = await getUser(payload.email);
      if (!user) {
        sendMessage(403, 'Forbidden. User does not exist', callback);
      } else if (user && user.role !== 'admin') {
        sendMessage(
          403,
          'Forbidden. Not allowed to perform administrative actions',
          callback
        );
      } else {
        switch (event.httpMethod) {
          case 'GET':
            await listUsers(event, context, callback);
            break;
          case 'PUT':
            await editUser(event, context, callback);
            break;
          case 'DELETE':
            await removeUser(event, context, callback);
            break;
          default:
        }
      }
    });
  }
};
