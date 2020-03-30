import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateReview } from '../graphql';
import Button from '@material-ui/core/Button';
import Notification from './Notification';
import ReviewDialog from './ReviewDialog';
import { getRateInt, translateRate } from './Utils';

const ReviewUpdate = ({
  id,
  rate: previousRate,
  visitDate: previousVisitDate,
  comment: previousComment,
  restaurantName,
  updateReview: editReivew
}) => {
  const [creating, setCreating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(getRateInt(previousRate));
  const [visitDate, setVisitDate] = useState(new Date(previousVisitDate));
  const [comment, setComment] = useState(previousComment);

  async function changeReview() {
    setCreating(true);
    const input = {
      id,
      rate: translateRate(rate),
      visitDate: visitDate.toISOString().slice(0, 10),
      comment: comment.trim()
    };
    try {
      const response = await API.graphql(
        graphqlOperation(updateReview, { input })
      );
      const review = response.data.updateReview;
      editReivew(review);
      previousRate = review.rate;
      previousVisitDate = review.visitDate;
      previousComment = review.comment;
      setCreating(false);
      setSnackBarOpen(true);
      handleDialogClose();
    } catch (err) {
      console.log('error: ', err);
    }
  }

  function handleDialogClose() {
    setOpen(false);
    setRate(getRateInt(previousRate));
    setVisitDate(new Date(previousVisitDate));
    setComment(previousComment);
  }

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        data-cy="review-card-edit-button"
      >
        Edit
      </Button>
      <ReviewDialog
        open={open}
        handleClose={handleDialogClose}
        creating={creating}
        action={changeReview}
        restaurantName={restaurantName}
        rate={rate}
        setRate={setRate}
        visitDate={visitDate}
        setVisitDate={setVisitDate}
        comment={comment}
        setComment={setComment}
        dialogAction="Update"
      />
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Review Updated"
      />
    </>
  );
};

export default ReviewUpdate;
