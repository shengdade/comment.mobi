import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createReview } from '../../graphql';
import Notification from '../utils/Notification';
import ReviewDialog from './ReviewDialog';
import { translateRate } from '../utils/Rate';

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
      comment: comment.trim(),
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
      <ReviewDialog
        open={open}
        handleClose={handleDialogClose}
        creating={creating}
        action={leaveReview}
        restaurantName={restaurantName}
        rate={rate}
        setRate={setRate}
        visitDate={visitDate}
        setVisitDate={setVisitDate}
        comment={comment}
        setComment={setComment}
        dialogAction="Comment"
      />
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Review Saved"
      />
    </>
  );
};

export default ReviewCreate;
