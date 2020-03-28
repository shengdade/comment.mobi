import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';

const ReviewDialog = ({
  open,
  handleClose,
  creating,
  action,
  restaurantName,
  rate,
  setRate,
  visitDate,
  setVisitDate,
  comment,
  setComment,
  dialogAction
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      {creating && <LinearProgress />}
      <DialogTitle>{restaurantName}</DialogTitle>
      <DialogContent>
        <Rating
          name="review"
          value={rate}
          size="large"
          onChange={(event, newValue) => {
            setRate(newValue);
          }}
        />
        <TextField
          required
          autoFocus
          fullWidth
          multiline
          label="Comment"
          rows="6"
          variant="outlined"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ margin: '30px 0 20px 0' }}
        />
        <KeyboardDatePicker
          disableToolbar
          disableFuture
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          label="Date of the visit"
          value={visitDate}
          onChange={setVisitDate}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          disabled={!rate || !visitDate.getTime() || !comment}
          onClick={action}
          color="primary"
        >
          {dialogAction}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
