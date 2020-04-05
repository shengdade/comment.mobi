const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE;

exports.createUser = async function (email, password, role) {
  const params = {
    TableName: tableName,
    Item: {
      email,
      password,
      role,
    },
    ConditionExpression: 'attribute_not_exists (email)',
  };
  await dynamodb.put(params).promise();
};

exports.getUser = async function (email) {
  const params = {
    TableName: tableName,
    Key: {
      email,
    },
  };
  const data = await dynamodb.get(params).promise();
  return data.Item;
};

exports.getAllUsers = async function () {
  const params = {
    TableName: tableName,
  };
  const data = await dynamodb.scan(params).promise();
  return data.Items;
};

exports.updateUser = async function (email, attribute, value) {
  const params = {
    TableName: tableName,
    Key: { email },
    ConditionExpression: 'email = :e',
    UpdateExpression: 'set #a = :v',
    ExpressionAttributeNames: { '#a': attribute },
    ExpressionAttributeValues: { ':e': email, ':v': value },
  };
  await dynamodb.update(params).promise();
};

exports.deleteUser = async function (email) {
  const params = {
    TableName: tableName,
    Key: { email },
    Expected: {
      email: {
        Exists: true,
        Value: email,
      },
    },
  };
  await dynamodb.delete(params).promise();
};
