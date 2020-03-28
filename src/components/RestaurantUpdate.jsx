import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { updateRestaurant } from '../graphql';
import Button from '@material-ui/core/Button';
import Notification from './Notification';
import RestaurantDialog from './RestaurantDialog';
import config from '../aws-exports';

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config;

const RestaurantUpdate = ({ id, name: previousName, setRestaurant }) => {
  const [creating, setCreating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(previousName);
  const [file, setFile] = useState(null);

  async function changeRestaurant() {
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
        id,
        name: name.trim(),
        image
      };

      try {
        await Storage.put(key, file, { contentType: mimeType });
        const response = await API.graphql(
          graphqlOperation(updateRestaurant, { input })
        );
        const { name, imageUrl } = await attachImageUrl(
          response.data.updateRestaurant
        );
        setRestaurant(previous => ({
          ...previous,
          name,
          imageUrl
        }));
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
    setName(previousName);
    setFile(null);
  }

  async function attachImageUrl(item) {
    if (item && item.image && item.image.key) {
      return { ...item, imageUrl: await Storage.get(item.image.key) };
    } else {
      return item;
    }
  }

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <RestaurantDialog
        open={open}
        handleClose={handleClose}
        creating={creating}
        action={changeRestaurant}
        name={name}
        setName={setName}
        file={file}
        setFile={setFile}
        dialogTitle="Update Restaurant"
        dialogDescription="To update a new restaurant, please update the name and upload an image."
        dialogAction="Update"
      />
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Restaurant Updated"
      />
    </>
  );
};

export default RestaurantUpdate;
