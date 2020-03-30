import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import RoleContext from './RoleContext';
import clsx from 'clsx';
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
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import ReviewList from './ReviewList';
import { getRateInt } from './Utils';

const useStyles = makeStyles(theme => ({
  media: {
    height: 140
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  expandText: {
    margin: 'auto'
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
}));

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

function getExpandText(reviews) {
  if (reviews && reviews.items.length > 0) {
    const unreplied = reviews.items.filter(r => r.reply === null);
    const count = unreplied.length;
    if (count === 1) {
      return `${count} review unreplied`;
    } else {
      return `${count} reviews unreplied`;
    }
  } else {
    return 'no unreplied reviews';
  }
}

const RestaurantList = () => {
  const role = useContext(RoleContext);
  const [loaded, setLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [ratingAbove, setRatingAbove] = useState(0);
  const [review, setReview] = useState({ open: false });
  const [expanded, setExpanded] = useState({});
  const classes = useStyles();

  useEffect(() => {
    fetchList(setLoaded, setRestaurants);
  }, []);

  useEffect(() => {
    if (role === 'owners') {
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
    if (role === 'users') {
      const subscriber = API.graphql(
        graphqlOperation(onCreateReview)
      ).subscribe({
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
    }
  }, [restaurants, role]);

  const handleReviewClose = () => {
    setReview(previous => ({ ...previous, open: false }));
  };

  const handleExpandClick = id => {
    setExpanded(previous => ({
      ...previous,
      [id]: previous[id] ? false : true
    }));
  };

  const changeReview = (restaurantId, reviewId, newReview) => {
    setRestaurants(previous => {
      const updatedRestaurant = previous.find(r => r.id === restaurantId);
      updatedRestaurant.reviews.items = [
        ...updatedRestaurant.reviews.items.filter(r => r.id !== reviewId),
        newReview
      ];
      return [
        ...previous.filter(p => p.id !== restaurantId),
        updatedRestaurant
      ].sort((a, b) => b.averageRate - a.averageRate);
    });
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
        <Grid container data-cy="restaurant-list-grid">
          {restaurants
            .filter(r => r.averageRate >= ratingAbove)
            .map(({ id, name, owner, averageRate, imageUrl, reviews }) => (
              <Grid item key={id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <Link
                      component={RouterLink}
                      style={{ textDecoration: 'none' }}
                      to={`/restaurants/${id}`}
                    >
                      {imageUrl && (
                        <CardMedia className={classes.media} image={imageUrl} />
                      )}
                      <CardContent>
                        <Typography
                          gutterBottom
                          color="textPrimary"
                          variant="h6"
                          data-cy="restaurant-list-item-name"
                        >
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
                            <Typography color="textPrimary" variant="body2">
                              ({Math.round(averageRate * 10) / 10})
                            </Typography>
                          </Box>
                        </div>
                      </CardContent>
                    </Link>
                  </CardActionArea>
                  {role === 'users' && (
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
                  )}
                  {role === 'owners' && (
                    <CardActions disableSpacing>
                      <Typography
                        className={classes.expandText}
                        variant="body2"
                      >
                        {getExpandText(reviews)}
                      </Typography>
                      <IconButton
                        className={clsx(classes.expand, {
                          [classes.expandOpen]: expanded[id]
                        })}
                        onClick={() => {
                          handleExpandClick(id);
                        }}
                        aria-label="show more"
                      >
                        <Icon>expand_more</Icon>
                      </IconButton>
                    </CardActions>
                  )}
                  <Collapse in={expanded[id]} timeout="auto" unmountOnExit>
                    <CardContent>
                      <ReviewList
                        restaurantId={id}
                        changeReview={changeReview}
                        reviews={
                          reviews
                            ? reviews.items.filter(r => r.reply === null)
                            : []
                        }
                      />
                    </CardContent>
                  </Collapse>
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
