import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateReview } from '../graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import Notification from './Notification';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import { getRateInt } from './Utils';
import { format } from 'date-fns';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

const ReplyCreate = ({
  open,
  handleClose,
  reviewId,
  reviewComment,
  reviewRate,
  reviewVisitDate
}) => {
  const [updating, setUpdating] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [reply, setReply] = useState('');

  async function replyReview() {
    setUpdating(true);
    const input = {
      id: reviewId,
      reply: reply.trim()
    };
    try {
      await API.graphql(graphqlOperation(updateReview, { input }));
      setUpdating(false);
      setSnackBarOpen(true);
      handleDialogClose();
    } catch (err) {
      console.log('error: ', err);
    }
  }

  function handleDialogClose() {
    handleClose();
    setReply('');
  }

  function formatDate(date) {
    if (date) {
      return format(new Date(date), 'MMM d, yyyy');
    }
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleDialogClose}>
        {updating && <LinearProgress />}
        <DialogTitle>Reply to</DialogTitle>
        <DialogContent>
          <ListItem>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Rating value={getRateInt(reviewRate)} readOnly size="small" />
              }
              secondary={
                <React.Fragment>
                  <Typography paragraph component="span" color="textPrimary">
                    {reviewComment}
                  </Typography>
                  <br />
                  {formatDate(reviewVisitDate)}
                </React.Fragment>
              }
            />
          </ListItem>
          <TextField
            required
            fullWidth
            multiline
            label="Reply"
            rows="6"
            variant="outlined"
            value={reply}
            onChange={e => setReply(e.target.value)}
            style={{ margin: '30px 0 20px 0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button disabled={!reply} onClick={replyReview} color="primary">
            Reply
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Reply Saved"
      />
    </>
  );
};

export default ReplyCreate;
