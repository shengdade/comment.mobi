import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { addToGroup } from './AdminQuery';

const AdminDialog = ({
  open,
  handleClose,
  username,
  setSnackBarOpen,
  isUser,
  isOwner,
  isAdmin,
  updateGroup
}) => {
  const [creating, setCreating] = useState(false);

  const handleAdd = async group => {
    setCreating(true);
    try {
      await addToGroup(username, group);
      handleClose();
      setSnackBarOpen(true);
      setCreating(false);
      updateGroup(group, 'add', username);
    } catch (err) {
      console.log('error: ', err);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      {creating && <LinearProgress />}
      <DialogTitle>Attach a new role</DialogTitle>
      <List>
        <ListItem button onClick={() => handleAdd('users')} disabled={isUser}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="User"
            secondary="Can rate and leave a comment for a restaurant"
          />
        </ListItem>
        <Divider component="li" />
        <ListItem button onClick={() => handleAdd('owners')} disabled={isOwner}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="Owner"
            secondary="Can create restaurants and reply comments about owned restaurants"
          />
        </ListItem>
        <Divider component="li" />
        <ListItem button onClick={() => handleAdd('admin')} disabled={isAdmin}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="Admin"
            secondary="Can edit/delete all users, restaurants, comments, and reviews"
          />
        </ListItem>
      </List>
    </Dialog>
  );
};

export default AdminDialog;
