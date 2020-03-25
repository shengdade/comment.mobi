import React, { useEffect, useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import RoleContext from './RoleContext';
import DateFnsUtils from '@date-io/date-fns';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import LinearProgress from '@material-ui/core/LinearProgress';
import Admin from './Admin';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import Header from './Header';

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
      secondary: orange
    }
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>
          <RoleContext.Provider value={cognitoGroup}>
            {!loaded && <LinearProgress />}
            <Header />
            <Switch>
              <Route exact path="/" component={RestaurantList} />
              <Route exact path="/admin" component={Admin} />
              <Route path="/restaurants/:id" component={RestaurantDetail} />
            </Switch>
          </RoleContext.Provider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </React.Fragment>
  );
}

export default withAuthenticator(App, {
  includeGreetings: false,
  usernameAttributes: 'email',
  signUpConfig: { hiddenDefaults: ['phone_number'] }
});
