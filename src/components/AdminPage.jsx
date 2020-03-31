import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import AdminDialog from './AdminDialog';
import Notification from './Notification';
import { getUser, removeFromGroup, disableUser } from './AdminQuery';
import AlertDialog from './AlertDialog';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5)
  },
  chipGroup: {
    flex: 'auto'
  }
}));

const AdminPage = () => {
  const [all, setAll] = useState([]);
  const [users, setUsers] = useState({});
  const [owners, setOwners] = useState({});
  const [admins, setAdmins] = useState({});
  const [loaded, setLoaded] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const classes = useStyles();

  useEffect(() => {
    async function getAll() {
      const Users = await getUser('/listUsers');
      setAll(Users);
      setLoaded(previous => previous + 1);
    }
    getAll();
  }, []);

  useEffect(() => {
    async function getUsers() {
      const Users = await getUser('/listUsersInGroup', 'users');
      const hash = Object.assign(
        {},
        ...Users.map(s => ({ [s.Username]: true }))
      );
      setUsers(hash);
      setLoaded(previous => previous + 1);
    }
    getUsers();
  }, []);

  useEffect(() => {
    async function getOwners() {
      const Users = await getUser('/listUsersInGroup', 'owners');
      const hash = Object.assign(
        {},
        ...Users.map(s => ({ [s.Username]: true }))
      );
      setOwners(hash);
      setLoaded(previous => previous + 1);
    }
    getOwners();
  }, []);

  useEffect(() => {
    async function getAdmins() {
      const Users = await getUser('/listUsersInGroup', 'admin');
      const hash = Object.assign(
        {},
        ...Users.map(s => ({ [s.Username]: true }))
      );
      setAdmins(hash);
      setLoaded(previous => previous + 1);
    }
    getAdmins();
  }, []);

  const handleAdd = username => {
    setUsername(username);
    setDialogOpen(true);
  };

  const handleDelete = async (username, group) => {
    updateGroup(group, 'remove', username);
    await removeFromGroup(username, group);
    setSnackBarOpen(true);
  };

  const updateGroup = (group, operation, username) => {
    const isAdding = operation === 'add';
    switch (group) {
      case 'users':
        setUsers(previous => ({ ...previous, [username]: isAdding }));
        break;
      case 'owners':
        setOwners(previous => ({ ...previous, [username]: isAdding }));
        break;
      case 'admin':
        setAdmins(previous => ({ ...previous, [username]: isAdding }));
        break;
      default:
    }
  };

  const handleUserDelete = username => {
    setUsername(username);
    setAlertOpen(true);
  };

  const deleteUser = async () => {
    setAlertOpen(false);
    await disableUser(username);
    setAll(previous => {
      const user = previous.find(u => u.Username === username);
      return [
        ...previous.filter(u => u.Username !== username),
        { ...user, Enabled: false }
      ];
    });
    setSnackBarOpen(true);
  };

  return (
    <>
      {loaded < 4 && <LinearProgress />}
      <Container maxWidth="md">
        <List>
          {all
            .filter(u => u.Enabled)
            .map(({ Username, Attributes, UserStatus }) => {
              const email = Attributes.find(a => a.Name === 'email').Value;
              return (
                <React.Fragment key={Username}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{email.slice(0, 1)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={email} secondary={UserStatus} />
                    <div className={classes.chipGroup}>
                      {users[Username] && (
                        <Chip
                          className={classes.chip}
                          label="User"
                          onDelete={() => handleDelete(Username, 'users')}
                          data-cy="admin-remove-user-role-chip"
                        />
                      )}
                      {owners[Username] && (
                        <Chip
                          className={classes.chip}
                          label="Owner"
                          onDelete={() => handleDelete(Username, 'owners')}
                          data-cy="admin-remove-owner-role-chip"
                        />
                      )}
                      {admins[Username] && (
                        <Chip
                          className={classes.chip}
                          label="Admin"
                          onDelete={() => handleDelete(Username, 'admin')}
                          data-cy="admin-remove-admin-role-chip"
                        />
                      )}
                      {(!users[Username] ||
                        !owners[Username] ||
                        !admins[Username]) && (
                        <IconButton
                          size="small"
                          onClick={() => handleAdd(Username)}
                          data-cy="admin-add-role-button"
                        >
                          <Icon>add</Icon>
                        </IconButton>
                      )}
                    </div>
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleUserDelete(Username)}
                        data-cy="admin-delete-role-button"
                      >
                        <Icon>delete</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
        </List>
      </Container>
      <AdminDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        username={username}
        setSnackBarOpen={setSnackBarOpen}
        isUser={users[username]}
        isOwner={owners[username]}
        isAdmin={admins[username]}
        updateGroup={updateGroup}
      />
      <AlertDialog
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
        title="Delete User"
        description="Are you true that you want to delete the user?"
        action={deleteUser}
      />
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        vertical="bottom"
        horizontal="center"
      />
    </>
  );
};

export default AdminPage;
