import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import { getRateInt } from './Utils';
import Button from '@material-ui/core/Button';

function ReviewList({ reviews }) {
  const handleReply = id => {};

  return (
    <List disablePadding>
      {reviews.map(({ id, comment, rate }, idx) => (
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
                    onClick={() => handleReply(id)}
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
    </List>
  );
}

export default ReviewList;
