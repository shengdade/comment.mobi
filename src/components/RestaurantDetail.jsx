import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { getRestaurant, deleteRestaurant } from '../graphql';
import { getRateInt } from './Utils';
import RoleContext from './RoleContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { format } from 'date-fns';
import CardHeader from '@material-ui/core/CardHeader';
import Rating from '@material-ui/lab/Rating';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import RestaurantUpdate from './RestaurantUpdate';
import AlertDialog from './AlertDialog';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '8px'
  },
  comment: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  media: {
    height: 180
  },
  ownerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
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
  const [highestReview, setHighestReview] = useState(null);
  const [lowestReview, setLowestReview] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const classes = useStyles();

  async function attachImageUrl(item) {
    if (item && item.image && item.image.key) {
      return { ...item, imageUrl: await Storage.get(item.image.key) };
    } else {
      return item;
    }
  }

  function withAverageRate(item) {
    const reviews = item.reviews.items;
    let average = reviews.reduce((acc, cur) => acc + getRateInt(cur.rate), 0);
    if (reviews.length) average /= reviews.length;
    return { ...item, averageRate: average };
  }

  function formatDate(date) {
    if (date) {
      return format(new Date(date), 'MMM d, yyyy');
    }
  }

  function classifyReviews(reviews) {
    reviews.sort((a, b) => getRateInt(b.rate) - getRateInt(a.rate));
    if (reviews.length > 2) {
      setHighestReview(reviews.shift());
      setLowestReview(reviews.pop());
    }
    reviews.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    setRecentReviews(reviews);
  }

  useEffect(() => {
    async function fetchRestaurant() {
      const response = await API.graphql(
        graphqlOperation(getRestaurant, { id: restaurantId })
      );
      const restaurant = response.data.getRestaurant;
      if (restaurant) {
        setRestaurant(withAverageRate(await attachImageUrl(restaurant)));
        classifyReviews(restaurant.reviews.items);
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
                    <Button color="primary" onClick={() => setAlertOpen(true)}>
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
                <Card className={classes.card}>
                  <CardHeader
                    avatar={<Avatar />}
                    title={
                      <Rating
                        value={getRateInt(highestReview.rate)}
                        readOnly
                        size="small"
                      />
                    }
                    subheader={formatDate(highestReview.visitDate)}
                    action={<Chip label="highest" />}
                  />
                  <CardContent>
                    <Typography className={classes.comment} component="p">
                      {highestReview.comment}
                    </Typography>
                    {highestReview.reply && (
                      <CardHeader
                        avatar={<Avatar className={classes.ownerAvatar} />}
                        title={
                          <Typography color="textSecondary">
                            {highestReview.reply}
                          </Typography>
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
            {lowestReview && (
              <Grid item xs={12} sm={6} md={5}>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={<Avatar />}
                    title={
                      <Rating
                        value={getRateInt(lowestReview.rate)}
                        readOnly
                        size="small"
                      />
                    }
                    subheader={formatDate(lowestReview.visitDate)}
                    action={<Chip label="lowest" />}
                  />
                  <CardContent>
                    <Typography className={classes.comment} component="p">
                      {lowestReview.comment}
                    </Typography>
                    {lowestReview.reply && (
                      <CardHeader
                        avatar={<Avatar className={classes.ownerAvatar} />}
                        title={
                          <Typography color="textSecondary">
                            {lowestReview.reply}
                          </Typography>
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
          <Grid container justify="center">
            {recentReviews.map(({ id, rate, visitDate, comment, reply }) => (
              <Grid item key={id} xs={12} sm={10} md={8}>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={<Avatar />}
                    title={
                      <Rating value={getRateInt(rate)} readOnly size="small" />
                    }
                    subheader={formatDate(visitDate)}
                  />
                  <CardContent>
                    <Typography className={classes.comment} component="p">
                      {comment}
                    </Typography>
                    {reply && (
                      <CardHeader
                        avatar={<Avatar className={classes.ownerAvatar} />}
                        title={
                          <Typography color="textSecondary">{reply}</Typography>
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default RestaurantDetail;
