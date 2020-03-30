import React, { useState, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { deleteReview } from '../graphql';
import { getRateInt } from './Utils';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import RoleContext from './RoleContext';
import { format } from 'date-fns';
import CardHeader from '@material-ui/core/CardHeader';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ReviewUpdate from './ReviewUpdate';
import AlertDialog from './AlertDialog';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '8px'
  },
  comment: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  ownerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  adminActions: {
    justifyContent: 'flex-end'
  }
}));

function formatDate(date) {
  if (date) {
    return format(new Date(date), 'MMM d, yyyy');
  }
}

const ReviewCard = ({
  id,
  rate,
  visitDate,
  comment,
  reply,
  action,
  restaurantName,
  updateReview,
  deleteReview: takeoutReview
}) => {
  const role = useContext(RoleContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const classes = useStyles();

  async function removeReview() {
    const input = {
      id
    };
    try {
      await API.graphql(graphqlOperation(deleteReview, { input }));
      setAlertOpen(false);
      takeoutReview(id);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar />}
        title={<Rating value={getRateInt(rate)} readOnly size="small" />}
        subheader={formatDate(visitDate)}
        action={action}
      />
      <CardContent>
        <Typography
          className={classes.comment}
          component="p"
          data-cy="review-card-comment"
        >
          {comment}
        </Typography>
        {reply && (
          <CardHeader
            avatar={<Avatar className={classes.ownerAvatar} />}
            title={
              <Typography color="textSecondary" data-cy="review-card-reply">
                {reply}
              </Typography>
            }
          />
        )}
      </CardContent>
      {role === 'admin' && (
        <CardActions className={classes.adminActions}>
          <ReviewUpdate
            id={id}
            rate={rate}
            visitDate={visitDate}
            comment={comment}
            restaurantName={restaurantName}
            updateReview={updateReview}
          />
          <Button
            color="primary"
            onClick={() => setAlertOpen(true)}
            data-cy="review-card-delete-button"
          >
            Delete
          </Button>
          <AlertDialog
            open={alertOpen}
            handleClose={() => setAlertOpen(false)}
            title="Deleting Review"
            description="Are you true that you want to delete this review?"
            action={removeReview}
          />
        </CardActions>
      )}
    </Card>
  );
};

export default ReviewCard;
