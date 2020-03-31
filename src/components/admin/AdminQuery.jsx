import { Auth, API } from 'aws-amplify';

export async function getUser(path, groupname) {
  let apiName = 'AdminQueries';
  let myInit = {
    queryStringParameters: {
      groupname: groupname,
      limit: 60
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`
    }
  };
  const { Users } = await API.get(apiName, path, myInit);
  return Users;
}

export async function addToGroup(username, group) {
  let apiName = 'AdminQueries';
  let path = '/addUserToGroup';
  let myInit = {
    body: {
      username: username,
      groupname: group
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`
    }
  };
  return await API.post(apiName, path, myInit);
}

export async function removeFromGroup(username, group) {
  let apiName = 'AdminQueries';
  let path = '/removeUserFromGroup';
  let myInit = {
    body: {
      username: username,
      groupname: group
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`
    }
  };
  return await API.post(apiName, path, myInit);
}

export async function disableUser(username) {
  let apiName = 'AdminQueries';
  let path = '/disableUser';
  let myInit = {
    body: {
      username: username
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`
    }
  };
  return await API.post(apiName, path, myInit);
}
