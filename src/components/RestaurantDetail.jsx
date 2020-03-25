import React from 'react';

function RestaurantDetail(props) {
  return <div>{`RestaurantDetail: ${props.match.params.id}`}</div>;
}

export default RestaurantDetail;
