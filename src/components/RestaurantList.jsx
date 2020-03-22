import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listRestaurants } from '../graphql';
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
  return Promise.all(
    data.map(async item => {
      return { ...item, imageUrl: await Storage.get(item.image.key) };
    })
  );
}

async function fetchList(setLoaded, setRestaurants) {
  const restaurants = await API.graphql(
    graphqlOperation(listRestaurants, { limit: 100 })
  );
  const data = _.sortBy(restaurants.data.listRestaurants.items, 'rate');
  setRestaurants(await withImageUrl(data));
  setLoaded(true);
}

const RestaurantList = () => {
  const [loaded, setLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    fetchList(setLoaded, setRestaurants);
  }, []);
  const classes = useStyles();
  return (
    <>
      {!loaded && <LinearProgress />}
      <Grid container alignItems="center" className={classes.grid}>
        {restaurants.map(restaurant => (
          <Grid item key={restaurant.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={restaurant.imageUrl}
                />
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
