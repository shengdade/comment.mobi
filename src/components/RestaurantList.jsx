import React, { useState, useEffect, useContext } from 'react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import RoleContext from './RoleContext';
import {
  listRestaurants,
  onCreateRestaurant,
  onCreateReview
} from '../graphql';
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
    alignItems: 'center'
  },
  ratingFilter: {
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
          newRestaurant.averageRate = 0;
          setRestaurants(previous => [...previous, newRestaurant]);
        }
      });
      return () => subscriber.unsubscribe();
    }
  }, [role]);

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onCreateReview)).subscribe({
      next: provider => {
        const newReview = provider.value.data.onCreateReview;
        const updatedRestaurant = restaurants.find(
          r => r.id === newReview.reviewRestaurantId
        );
        updatedRestaurant.reviews.items.push(newReview);
        setRestaurants(previous =>
          [
            ...previous.filter(r => r.id !== updatedRestaurant.id),
            ...withAverageRate([updatedRestaurant])
          ].sort((a, b) => b.averageRate - a.averageRate)
        );
      }
    });
    return () => subscriber.unsubscribe();
  }, [restaurants]);

  const handleReviewClose = () => {
    setReview(previous => ({ ...previous, open: false }));
  };

  return (
    <>
      {!loaded && <LinearProgress />}
      <Container maxWidth="lg">
        <div className={classes.ratingFilter}>
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
            .map(({ id, name, owner, averageRate, imageUrl }) => (
              <Grid item key={id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card className={classes.card}>
                  <CardActionArea>
                    {imageUrl && (
                      <CardMedia className={classes.media} image={imageUrl} />
                    )}
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {name}
                      </Typography>
                      <div className={classes.rating}>
                        <Rating
                          value={averageRate}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Box ml={1}>
                          <Typography variant="body2">
                            ({Math.round(averageRate * 10) / 10})
                          </Typography>
                        </Box>
                      </div>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        setReview({
                          open: true,
                          restaurantId: id,
                          restaurantName: name,
                          restaurantOwner: owner
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
