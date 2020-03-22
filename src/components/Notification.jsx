import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const Notification = ({ open, setOpen, severity, message }) => {
  function handleClose(event, reason) {
    // ignoring user clicking away
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity || 'success'}
        elevation={6}
        variant="filled"
      >
        {message || 'Success'}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
