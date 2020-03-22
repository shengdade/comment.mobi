import React, { useState, useEffect } from 'react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listRestaurants, onCreateRestaurant } from '../graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
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

const useStyles = makeStyles({
  grid: {
    margin: '15px 0 15px 0'
  },
  media: {
    height: 140
  },
  card: {
    margin: '10px'
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
  console.log(data);
  setRestaurants(await withImageUrl(data));
  setLoaded(true);
}

const RestaurantList = () => {
  const [loaded, setLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetchList(setLoaded, setRestaurants);
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <>
      {!loaded && <LinearProgress />}
      <Grid container alignItems="center" className={classes.grid}>
        {restaurants.map(restaurant => (
          <Grid item key={restaurant.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card className={classes.card}>
              <CardActionArea>
                {restaurant.imageUrl && (
                  <CardMedia
                    className={classes.media}
                    image={restaurant.imageUrl}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5">
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
                <Button size="small" color="primary">
                  Review
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RestaurantList;
