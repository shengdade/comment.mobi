import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { API, Storage, Auth, graphqlOperation } from 'aws-amplify';
import { createRestaurant } from '../graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Notification from './Notification';
import config from '../aws-exports';

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config;

const RestaurantCreate = () => {
  const [creating, setCreating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setFile(null);
  }

  function handleFileChange(event) {
    const {
      target: { value, files }
    } = event;
    const fileForUpload = files[0];
    setFile(fileForUpload || value);
  }

  async function launchRestaurant() {
    setCreating(true);
    if (file) {
      const { name: fileName, type: mimeType } = file;
      const key = `${uuid()}_${fileName}`;
      const image = {
        bucket,
        key,
        region
      };
      const input = {
        name: name.trim(),
        owner,
        image
      };

      try {
        await Storage.put(key, file, { contentType: mimeType });
        await API.graphql(graphqlOperation(createRestaurant, { input }));
        setCreating(false);
        setSnackBarOpen(true);
        handleClose();
      } catch (err) {
        console.log('error: ', err);
      }
    }
  }

  useEffect(() => {
    Auth.currentSession()
      .then(cognitoUser => {
        const {
          idToken: { payload }
        } = cognitoUser;
        const username = payload['cognito:username'];
        if (username) setOwner(username);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Tooltip title="create restaurant">
        <IconButton color="primary" onClick={handleClickOpen}>
          <Icon color="action">add_circle_outline</Icon>
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        {creating && <LinearProgress />}
        <DialogTitle>Create Restaurant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new restaurant, please enter a name and upload an image.
          </DialogContentText>
          <TextField
            autoFocus
            required
            label="Restaurant Name"
            fullWidth
            onChange={e => setName(e.target.value)}
          />
          {file ? (
            <Typography style={{ marginTop: '30px' }} color="primary">
              {`selected: ${file.name}`}
            </Typography>
          ) : (
            <Typography style={{ marginTop: '30px' }} color="secondary">
              no image selected
            </Typography>
          )}
          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '10px' }}
            startIcon={<Icon>image</Icon>}
          >
            Upload
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={!name || !file}
            onClick={launchRestaurant}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Restaurant Created"
      />
    </>
  );
};

export default RestaurantCreate;
