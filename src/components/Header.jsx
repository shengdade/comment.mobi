import React, { useState, useContext } from 'react';
import RoleContext from './RoleContext';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import RestaurantCreate from './RestaurantCreate';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  }
}));

export default function ButtonAppBar() {
  const role = useContext(RoleContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          <Icon>menu</Icon>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Restaurants
        </Typography>
        {role === 'owners' && (
          <RestaurantCreate open={open} handleClose={() => setOpen(false)} />
        )}
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={() => Auth.signOut()}
        >
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
