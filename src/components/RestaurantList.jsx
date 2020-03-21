import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listRestaurants } from '../graphql';
import LinearProgress from '@material-ui/core/LinearProgress';

const fetchList = async setLoaded => {
  const posts = await API.graphql(
    graphqlOperation(listRestaurants, { limit: 100 })
  );
  console.log(posts);
  setLoaded(true);
};

const RestaurantList = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchList(setLoaded);
  }, []);
  return (
    <>
      {!loaded && <LinearProgress />}
      <div>content</div>
    </>
  );
};

export default RestaurantList;
