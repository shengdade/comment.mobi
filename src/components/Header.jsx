import React, { useState, useContext } from 'react';
import RoleContext from './RoleContext';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { useLocation } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import RestaurantCreate from './RestaurantCreate';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

export default function Header() {
  const role = useContext(RoleContext);
  const location = useLocation();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <AppBar color="secondary" position="sticky">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          <Link
            component={RouterLink}
            style={{ textDecoration: 'none' }}
            color="textPrimary"
            to={`/`}
          >
            Restaurants
          </Link>
        </Typography>
        {role === 'owners' && location.pathname === '/' && (
          <RestaurantCreate open={open} handleClose={() => setOpen(false)} />
        )}
        {role === 'admin' && (
          <Tooltip title={'admin'}>
            <IconButton component={RouterLink} to="/admin">
              <Icon color="action">supervised_user_circle</Icon>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={role}>
          <IconButton>
            <Icon color="action">person_outline</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="sign out">
          <IconButton data-cy="sign-out-button" onClick={() => Auth.signOut()}>
            <Icon color="action">exit_to_app</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
