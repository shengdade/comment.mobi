import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { getRestaurant, deleteRestaurant } from '../../graphql';
import { getRateInt } from '../utils/Rate';
import RoleContext from '../RoleContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Rating from '@material-ui/lab/Rating';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import RestaurantUpdate from './RestaurantUpdate';
import AlertDialog from '../utils/AlertDialog';
import ReviewCard from '../review/ReviewCard';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '8px'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  media: {
    height: 180
  },
  adminActions: {
    justifyContent: 'flex-end'
  }
}));

const RestaurantDetail = props => {
  const restaurantId = props.match.params.id;
  const role = useContext(RoleContext);
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const [reviews, setReviews] = useState([]);
  const classes = useStyles();

  async function attachImageUrl(item) {
    if (item && item.image && item.image.key) {
      return { ...item, imageUrl: await Storage.get(item.image.key) };
    } else {
      return item;
    }
  }

  function withAverageRate(restaurant, reviews) {
    let average = reviews.reduce((acc, cur) => acc + getRateInt(cur.rate), 0);
    if (reviews.length) average /= reviews.length;
    return { ...restaurant, averageRate: average };
  }

  function classifyReviews(reviews) {
    const processed = reviews.slice();
    let highestReview = null;
    let lowestReview = null;
    processed.sort((a, b) => getRateInt(b.rate) - getRateInt(a.rate));
    if (processed.length > 2) {
      highestReview = processed.shift();
      lowestReview = processed.pop();
    }
    processed.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    return [highestReview, lowestReview, processed];
  }

  function updateReview(newReview) {
    setReviews(previous => {
      const updatedReviews = [
        ...previous.filter(p => p.id !== newReview.id),
        newReview
      ];
      setRestaurant(previous => withAverageRate(previous, updatedReviews));
      return updatedReviews;
    });
  }

  function deleteReview(reviewId) {
    setReviews(previous => {
      const updatedReviews = previous.filter(p => p.id !== reviewId);
      setRestaurant(previous => withAverageRate(previous, updatedReviews));
      return updatedReviews;
    });
  }

  useEffect(() => {
    async function fetchRestaurant() {
      const response = await API.graphql(
        graphqlOperation(getRestaurant, { id: restaurantId })
      );
      let restaurant = response.data.getRestaurant;
      if (restaurant) {
        restaurant = await attachImageUrl(restaurant);
        restaurant = withAverageRate(restaurant, restaurant.reviews.items);
        setRestaurant(restaurant);
        setReviews(restaurant.reviews.items);
      }
      setLoaded(true);
    }
    fetchRestaurant();
  }, [restaurantId]);

  async function closeRestaurant() {
    const input = {
      id: restaurantId
    };
    try {
      await API.graphql(graphqlOperation(deleteRestaurant, { input }));
      setAlertOpen(false);
      history.push('/');
    } catch (err) {
      console.log('error: ', err);
    }
  }

  const [highestReview, lowestReview, recentReviews] = classifyReviews(reviews);

  return (
    <>
      {!loaded && <LinearProgress />}
      {restaurant.id && (
        <Container maxWidth="lg">
          <Grid container justify="center">
            <Grid item xs={12} sm={12} md={10}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={restaurant.imageUrl}
                />
                <CardContent align="center">
                  <Typography gutterBottom variant="h4">
                    {restaurant.name}
                  </Typography>
                  <div className={classes.rating}>
                    <Rating
                      value={restaurant.averageRate}
                      precision={0.1}
                      readOnly
                    />
                    <Box ml={1}>
                      <Typography color="textPrimary">
                        ({Math.round(restaurant.averageRate * 10) / 10})
                      </Typography>
                    </Box>
                  </div>
                </CardContent>
                {role === 'admin' && (
                  <CardActions className={classes.adminActions}>
                    <RestaurantUpdate
                      id={restaurant.id}
                      name={restaurant.name}
                      setRestaurant={setRestaurant}
                    />
                    <Button
                      color="primary"
                      onClick={() => setAlertOpen(true)}
                      data-cy="restaurant-delete-button"
                    >
                      Delete
                    </Button>
                    <AlertDialog
                      open={alertOpen}
                      handleClose={() => setAlertOpen(false)}
                      title={`Closing ${restaurant.name}`}
                      description="Are you true that you want to close this restaurant?"
                      action={closeRestaurant}
                    />
                  </CardActions>
                )}
              </Card>
            </Grid>
          </Grid>
          <Grid container justify="center">
            {highestReview && (
              <Grid item xs={12} sm={6} md={5}>
                <ReviewCard
                  id={highestReview.id}
                  rate={highestReview.rate}
                  visitDate={highestReview.visitDate}
                  comment={highestReview.comment}
                  reply={highestReview.reply}
                  restaurantName={restaurant.name}
                  updateReview={updateReview}
                  deleteReview={deleteReview}
                  action={<Chip label="highest" />}
                />
              </Grid>
            )}
            {lowestReview && (
              <Grid item xs={12} sm={6} md={5}>
                <ReviewCard
                  id={lowestReview.id}
                  rate={lowestReview.rate}
                  visitDate={lowestReview.visitDate}
                  comment={lowestReview.comment}
                  reply={lowestReview.reply}
                  restaurantName={restaurant.name}
                  updateReview={updateReview}
                  deleteReview={deleteReview}
                  action={<Chip label="lowest" />}
                />
              </Grid>
            )}
          </Grid>
          <Grid container justify="center">
            {recentReviews.map(({ id, rate, visitDate, comment, reply }) => (
              <Grid item key={id} xs={12} sm={10} md={8}>
                <ReviewCard
                  id={id}
                  rate={rate}
                  visitDate={visitDate}
                  comment={comment}
                  reply={reply}
                  restaurantName={restaurant.name}
                  updateReview={updateReview}
                  deleteReview={deleteReview}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default RestaurantDetail;
