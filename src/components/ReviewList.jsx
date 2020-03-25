import React from 'react';
import { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ReplyCreate from './ReplyCreate';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import { getRateInt } from './Utils';
import Button from '@material-ui/core/Button';

function ReviewList({ restaurantId, changeReview, reviews }) {
  const [reply, setReply] = useState({ open: false });

  const handleReplyClose = () => {
    setReply(previous => ({ ...previous, open: false }));
  };

  return (
    <List disablePadding>
      {reviews.map(({ id, comment, rate, visitDate }, idx) => (
        <React.Fragment key={id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Rating value={getRateInt(rate)} readOnly size="small" />
              }
              secondary={
                <React.Fragment>
                  {comment}
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      setReply({
                        open: true,
                        reviewId: id,
                        reviewComment: comment,
                        reviewRate: rate,
                        reviewVisitDate: visitDate
                      })
                    }
                  >
                    Reply
                  </Button>
                </React.Fragment>
              }
            />
          </ListItem>
          {idx !== reviews.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
      <ReplyCreate
        open={reply.open}
        handleClose={handleReplyClose}
        reviewId={reply.reviewId}
        reviewComment={reply.reviewComment}
        reviewRate={reply.reviewRate}
        reviewVisitDate={reply.reviewVisitDate}
        restaurantId={restaurantId}
        changeReview={changeReview}
      />
    </List>
  );
}

export default ReviewList;
