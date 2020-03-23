import React, { useState, useContext } from 'react';
import RoleContext from './RoleContext';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import RestaurantCreate from './RestaurantCreate';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

export default function ButtonAppBar() {
  const role = useContext(RoleContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <AppBar color="secondary" position="sticky">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Restaurants
        </Typography>
        {role === 'owners' && (
          <RestaurantCreate open={open} handleClose={() => setOpen(false)} />
        )}
        <Tooltip title={role}>
          <IconButton color="primary">
            <Icon color="action">person_outline</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="sign out">
          <IconButton color="primary" onClick={() => Auth.signOut()}>
            <Icon color="action">exit_to_app</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
