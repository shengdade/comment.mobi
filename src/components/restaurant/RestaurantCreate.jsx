import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { API, Storage, Auth, graphqlOperation } from 'aws-amplify';
import { createRestaurant } from '../../graphql';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Notification from '../utils/Notification';
import RestaurantDialog from './RestaurantDialog';
import config from '../../aws-exports';

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config;

const RestaurantCreate = () => {
  const [creating, setCreating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [owner, setOwner] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

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

  function handleClose() {
    setOpen(false);
    setName('');
    setFile(null);
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
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          data-cy="create-restaurant-button"
        >
          <Icon color="action">add_circle_outline</Icon>
        </IconButton>
      </Tooltip>
      <RestaurantDialog
        open={open}
        handleClose={handleClose}
        creating={creating}
        action={launchRestaurant}
        name={name}
        setName={setName}
        file={file}
        setFile={setFile}
        dialogTitle="Create Restaurant"
        dialogDescription="To create a new restaurant, please enter a name and upload an image."
        dialogAction="Create"
      />
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Restaurant Created"
      />
    </>
  );
};

export default RestaurantCreate;
