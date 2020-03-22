import React, { useEffect, useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import LinearProgress from '@material-ui/core/LinearProgress';
import Admin from './Admin';
import RestaurantList from './RestaurantList';
import RestaurantCreate from './RestaurantCreate';

function App() {
  const [loaded, setLoaded] = useState(false);
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
        setLoaded(true);
      })
      .catch(err => console.log(err));
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: green,
      secondary: amber
    }
  });

  let render;
  switch (cognitoGroup) {
    case 'admin':
      render = <Admin />;
      break;
    case 'owners':
      render = <RestaurantList />;
      break;
    case 'users':
      render = <RestaurantList />;
      break;
    default:
      render = <div />;
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {!loaded && <LinearProgress />}
        <RestaurantCreate />
        {render}
      </ThemeProvider>
    </React.Fragment>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true,
  usernameAttributes: 'email',
  signUpConfig: { hiddenDefaults: ['phone_number'] }
});