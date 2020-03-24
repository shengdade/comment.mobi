import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createReview } from '../graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import Notification from './Notification';
import { translateRate } from './Utils';

const ReviewCreate = ({
  open,
  handleClose,
  restaurantId,
  restaurantName,
  restaurantOwner
}) => {
  const [creating, setCreating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [rate, setRate] = useState(5);
  const [visitDate, setVisitDate] = useState(new Date());
  const [comment, setComment] = useState('');

  async function leaveReview() {
    setCreating(true);
    const input = {
      rate: translateRate(rate),
      visitDate: visitDate.toISOString().slice(0, 10),
      comment,
      reviewRestaurantId: restaurantId,
      reviewRestaurantOwner: restaurantOwner
    };
    try {
      await API.graphql(graphqlOperation(createReview, { input }));
      setCreating(false);
      setSnackBarOpen(true);
      handleDialogClose();
    } catch (err) {
      console.log('error: ', err);
    }
  }

  function handleDialogClose() {
    handleClose();
    setRate(5);
    setVisitDate(new Date());
    setComment('');
  }

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose}>
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
          <Button color="primary" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            disabled={!rate || !visitDate.getTime() || !comment}
            onClick={leaveReview}
            color="primary"
          >
            Comment
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Review Saved"
      />
    </>
  );
};

export default ReviewCreate;
