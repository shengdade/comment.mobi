const Joi = require('@hapi/joi');
const { REGEX, hashPassword, sendResponse, sendMessage } = require('./util');
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('./dynamodb');

exports.registerUser = async (event, context, callback) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    sendMessage(400, 'Bad Request', callback);
  }
  const validation = this.validators.create.validate(body);
  if (validation.error) {
    sendResponse(400, JSON.stringify(validation.error.details), callback);
  } else {
    try {
      const hash = hashPassword(body.password);
      await createUser(body.email, hash, 'user');
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        sendMessage(403, 'User already exist', callback);
      } else {
        sendMessage(500, 'Error when storing user', callback);
      }
    }
    sendMessage(200, 'register success', callback);
  }
};

exports.listUsers = async (event, context, callback) => {
  let users;
  try {
    users = await getAllUsers();
    users = users.map(({ password, ...user }) => user);
  } catch (error) {
    sendMessage(500, 'Error when listing all users', callback);
  }
  sendMessage(200, JSON.stringify(users), callback);
};

exports.editUser = async (event, context, callback) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    sendMessage(400, 'Bad Request', callback);
  }
  const validation = this.validators.update.validate(body);
  if (validation.error) {
    sendResponse(400, JSON.stringify(validation.error.details), callback);
  } else {
    try {
      if (body.password) {
        const hash = hashPassword(body.password);
        await updateUser(body.email, 'password', hash);
      }
      if (body.role) {
        await updateUser(body.email, 'role', body.role);
      }
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        sendMessage(404, 'User does not exist', callback);
      } else {
        sendMessage(500, 'Error when updating user', callback);
      }
    }
    sendMessage(200, 'update success', callback);
  }
};

exports.removeUser = async (event, context, callback) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    sendMessage(400, 'Bad Request', callback);
  }
  const validation = this.validators.delete.validate(body);
  if (validation.error) {
    sendResponse(400, JSON.stringify(validation.error.details), callback);
  } else {
    try {
      await deleteUser(body.email);
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        sendMessage(404, 'User not found', callback);
      } else {
        sendMessage(500, 'Error when deleting user', callback);
      }
    }
    sendMessage(200, 'delete success', callback);
  }
};

exports.validators = {
  create: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(REGEX.password).required(),
  }),
  auth: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(REGEX.password).required(),
  }),
  update: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(REGEX.password),
    role: Joi.string().valid('user', 'owner', 'admin'),
  }).min(2),
  delete: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
};
