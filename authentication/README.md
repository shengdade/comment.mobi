# Custom Authentication Backend

For the authentication layer, this component implemented an alternative, custom solution, without the use of AWS Cognito.

## Tech Stack

- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) for storing user data (NoSQL database)
- [AWS Lambda](https://aws.amazon.com/lambda/) for CRUD operations on the table (NodeJS)
- [AWS CDK](https://aws.amazon.com/cdk/) for defining cloud infrastructure (TypeScript + Infrastructure as Code)

## API

### /user

- **POST** - create a user in database
- **GET** - get all users in database (only admin role has access)
- **PUT** - update user attributes (only admin role has access)
- **DELETE** - delete a user in database (only admin role has access)

### /auth

- **POST** - sign in and get authentication token

## Auth Flow

1. User submits POST request to /user with valid email and password
1. Backend validates the request and tries to register user to database
1. Backend uses [bcrypt](https://www.npmjs.com/package/bcrypt) for salted password hashing and store it to database
1. User submits POST request to /auth for authentication token
1. Backend validates the request and verifies if the password matches
1. If it matches, backend generates a [Json Web Token](https://www.npmjs.com/package/jsonwebtoken), serializes it, and returns it as `Set-Cookie` in headers
1. Client uses this auth token in cookies to perform API calls (token expires after session ends)
1. Only admins can perform GET/PUT/DELETE operations on /user, so the backend also verifies the role when processing these requests.

## Sample Call

All operations have been verified using Postman. Here provides some sample calls using CURL command.

### Sign Up

Requirements:

- must be a valid email address
- password must be at least eight characters (up to 32), at least one letter and one number

#### 1. with invalid email:

```bash
curl -X POST -d "{\"email\":\"dade@gmail\",\"password\":\"12345abc\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
[
  {
    "message": "\"email\" must be a valid email",
    "path": ["email"],
    "type": "string.email",
    "context": {
      "value": "dade@gmail",
      "invalids": ["dade@gmail"],
      "label": "email",
      "key": "email"
    }
  }
]
```

#### 2. with invalid password:

```bash
curl -X POST -d "{\"email\":\"dade@live.cn\",\"password\":\"1234567890\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
[
  {
    "message": "\"password\" with value \"1234567890\" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,32}$/",
    "path": ["password"],
    "type": "string.pattern.base",
    "context": {
      "regex": {},
      "value": "1234567890",
      "label": "password",
      "key": "password"
    }
  }
]
```

#### 3. with valid email and password:

```bash
curl -X POST -d "{\"email\":\"dade@live.cn\",\"password\":\"123456abc\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "register success"
}
```

### Sign In

Email and password validation is the same as above.

#### 1. with non-existent user:

```bash
curl -X POST -d "{\"email\":\"nobody@live.cn\",\"password\":\"123456abc\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/auth
```

response:

```json
{
  "status": 404,
  "message": "User does not exist"
}
```

#### 2. with incorrect password:

```bash
curl -X POST -d "{\"email\":\"dade@live.cn\",\"password\":\"654321abc\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/auth
```

response:

```json
{
  "status": 401,
  "message": "Incorrect password"
}
```

#### 3. with correct email and password:

```bash
curl -X POST -d "{\"email\":\"dade@live.cn\",\"password\":\"123456abc\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/auth
```

response:

```json
{
  "status": 200,
  "message": "Login success"
}
```

Using Postman, following cookie was returned:

```json
{
  "Name": "authToken",
  "Value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhZGVAbGl2ZS5jbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTg2MDY2MjYyfQ.LXTXf8F3nvh84rLvu8Kp4gJf5UbG33aivTRI-ulkpIE",
  "Domain": "kol40re3m0.execute-api.us-east-1.amazonaws.com",
  "Path": "/",
  "Expires": "Session"
}
```

### List Users

(this API can only be accessible by Admin)

#### 1. without auth token:

```bash
curl -X GET https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 403,
  "message": "Forbidden. Missing authentication token"
}
```

#### 2. with user token:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhZGVAbGl2ZS5jbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTg2MDU5NDA2fQ.ObKZib67i_9dRAyJ4IaAYmmoNga_r3vFvG4Td5ihduQ" -X GET https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 403,
  "message": "Forbidden. Not allowed to perform administrative actions"
}
```

#### 3. with admin token:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X GET https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "[{\"email\":\"dade@live.cn\",\"role\":\"user\"},{\"email\":\"admin@live.cn\",\"role\":\"admin\"}]"
}
```

### Update User

(this API can only be accessible by Admin)

Token validation is the same as above; It returns 403 error if there is no auth token, or with regular user token.

#### 1. update non-existent user:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X PUT -d "{\"email\":\"nobody@live.cn\",\"password\":\"12345abc\",\"role\":\"user\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 404,
  "message": "User does not exist"
}
```

#### 2. update user password:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X PUT -d "{\"email\":\"dade@live.cn\",\"password\":\"changed123\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "update success"
}
```

#### 3. update user role:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X PUT -d "{\"email\":\"dade@live.cn\",\"role\":\"owner\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "update success"
}
```

#### 4. update both password and role:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X PUT -d "{\"email\":\"dade@live.cn\",\"password\":\"123456abc\",\"role\":\"user\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "update success"
}
```

### Delete User

(this API can only be accessible by Admin)

Token validation is the same as above; It returns 403 error if there is no auth token, or with regular user token.

#### 1. delete non-existent user:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X DELETE -d "{\"email\":\"nobody@live.cn\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 404,
  "message": "User not found"
}
```

#### 2. delete existent user:

```bash
curl -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxpdmUuY24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODYwNjczNDN9.N2DTMNgdD-5yhbWj1u92kq5Mx5VZ9jqboMvqojIG-DU" -X DELETE -d "{\"email\":\"dade@live.cn\"}" https://kol40re3m0.execute-api.us-east-1.amazonaws.com/prod/user
```

response:

```json
{
  "status": 200,
  "message": "delete success"
}
```
