import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

const RestaurantDialog = ({
  open,
  handleClose,
  creating,
  action,
  name,
  setName,
  file,
  setFile,
  dialogTitle,
  dialogDescription,
  dialogAction
}) => {
  function handleFileChange(event) {
    const {
      target: { value, files }
    } = event;
    const fileForUpload = files[0];
    setFile(fileForUpload || value);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {creating && <LinearProgress />}
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogDescription}</DialogContentText>
        <TextField
          autoFocus
          required
          label="Restaurant Name"
          value={name}
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
        <Button disabled={!name || !file} onClick={action} color="primary">
          {dialogAction}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDialog;
