import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

function App() {
  const [isUser, updateUserInfo] = useState(false);
  useEffect(() => {
    /* Get the AWS credentials for the current user from Identity Pools.  */
    Auth.currentSession()
      .then(cognitoUser => {
        const {
          idToken: { payload }
        } = cognitoUser;
        /* Loop through the groups that the user is a member of */
        /* Set isUser to true if the user is part of the USERS group */
        payload['cognito:groups'] &&
          payload['cognito:groups'].forEach(group => {
            if (group === 'users') updateUserInfo(true);
          });
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isUser && <h1>Welcome, User!</h1>}
      </header>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
