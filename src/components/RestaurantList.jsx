import React, { useState, useEffect, useContext } from 'react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import RoleContext from './RoleContext';
import { listRestaurants, onCreateRestaurant } from '../graphql';
import ReviewCreate from './ReviewCreate';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  media: {
    height: 140
  },
  card: {
    margin: '10px'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '15px'
  }
});

async function withImageUrl(data) {
  return Promise.all(data.map(item => attachImageUrl(item)));
}

async function attachImageUrl(item) {
  if (item && item.image && item.image.key) {
    return { ...item, imageUrl: await Storage.get(item.image.key) };
  } else {
    return item;
  }
}

function withAverageRate(data) {
  return data.map(item => {
    const reviews = item.reviews.items;
    let average = reviews.reduce((acc, cur) => acc + getRateInt(cur.rate), 0);
    if (reviews.length) average /= reviews.length;
    return { ...item, averageRate: average };
  });
}

function getRateInt(S) {
  switch (S) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    default:
      return 0;
  }
}

async function fetchList(setLoaded, setRestaurants) {
  const restaurants = await API.graphql(
    graphqlOperation(listRestaurants, { limit: 100 })
  );
  const data = withAverageRate(restaurants.data.listRestaurants.items).sort(
    (a, b) => b.averageRate - a.averageRate
  );
  setRestaurants(await withImageUrl(data));
  setLoaded(true);
}

const RestaurantList = () => {
  const role = useContext(RoleContext);
  const [loaded, setLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [ratingAbove, setRatingAbove] = useState(0);
  const [review, setReview] = useState({ open: false });
  const classes = useStyles();

  useEffect(() => {
    fetchList(setLoaded, setRestaurants);
  }, []);

  useEffect(() => {
    if (role !== 'users') {
      const subscriber = API.graphql(
        graphqlOperation(onCreateRestaurant)
      ).subscribe({
        next: async provider => {
          const newRestaurant = await attachImageUrl(
            provider.value.data.onCreateRestaurant
          );
          setRestaurants(previous => [...previous, newRestaurant]);
        }
      });
      return () => subscriber.unsubscribe();
    }
  }, [role]);

  const handleReviewClose = () => {
    setReview(previous => ({ ...previous, open: false }));
  };

  return (
    <>
      {!loaded && <LinearProgress />}
      <Container maxWidth="lg">
        <div className={classes.rating}>
          <Rating
            name="rating-filter"
            value={ratingAbove}
            onChange={(event, newValue) => {
              setRatingAbove(newValue);
            }}
          />
          <Box ml={1}>& Up</Box>
        </div>
        <Grid container alignItems="center">
          {restaurants
            .filter(r => r.averageRate >= ratingAbove)
            .map(restaurant => (
              <Grid
                item
                key={restaurant.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
              >
                <Card className={classes.card}>
                  <CardActionArea>
                    {restaurant.imageUrl && (
                      <CardMedia
                        className={classes.media}
                        image={restaurant.imageUrl}
                      />
                    )}
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {restaurant.name}
                      </Typography>
                      <Rating
                        value={restaurant.averageRate}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        setReview({
                          open: true,
                          restaurantId: restaurant.id,
                          restaurantName: restaurant.name,
                          restaurantOwner: restaurant.owner
                        })
                      }
                    >
                      Review
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
      <ReviewCreate
        open={review.open}
        handleClose={handleReviewClose}
        restaurantId={review.restaurantId}
        restaurantName={review.restaurantName}
        restaurantOwner={review.restaurantOwner}
      />
    </>
  );
};

export default RestaurantList;
