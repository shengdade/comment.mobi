import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

function App() {
  const [cognitoGroup, updateCognitoGroup] = useState('');
  useEffect(() => {
    Auth.currentSession()
      .then(cognitoUser => {
        const {
          idToken: { payload }
        } = cognitoUser;
        const groups = payload['cognito:groups'];
        if (groups) {
          if (groups.includes('admin')) updateCognitoGroup('admin');
          else if (groups.includes('owners')) updateCognitoGroup('owners');
          else if (groups.includes('users')) updateCognitoGroup('users');
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{`Welcome, ${cognitoGroup}!`}</h1>
      </header>
    </div>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true,
  usernameAttributes: 'email',
  signUpConfig: { hiddenDefaults: ['phone_number'] }
});
