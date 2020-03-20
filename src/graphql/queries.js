/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRestaurant = /* GraphQL */ `
  query GetRestaurant($id: ID!) {
    getRestaurant(id: $id) {
      id
      name
      owner
      averageRate
      reviews {
        items {
          id
          rate
          visitDate
          comment
          reply
          reviewRestaurantId
          reviewRestaurantOwner
        }
        nextToken
      }
    }
  }
`;
export const listRestaurants = /* GraphQL */ `
  query ListRestaurants(
    $filter: ModelRestaurantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRestaurants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        averageRate
        reviews {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      id
      rate
      visitDate
      comment
      reply
      reviewRestaurantId
      reviewRestaurantOwner
      restaurant {
        id
        name
        owner
        averageRate
        reviews {
          nextToken
        }
      }
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        rate
        visitDate
        comment
        reply
        reviewRestaurantId
        reviewRestaurantOwner
        restaurant {
          id
          name
          owner
          averageRate
        }
      }
      nextToken
    }
  }
`;
