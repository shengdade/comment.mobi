/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRestaurant = /* GraphQL */ `
  subscription OnCreateRestaurant {
    onCreateRestaurant {
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
          reviewRestaurantId
        }
        nextToken
      }
    }
  }
`;
export const onUpdateRestaurant = /* GraphQL */ `
  subscription OnUpdateRestaurant {
    onUpdateRestaurant {
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
          reviewRestaurantId
        }
        nextToken
      }
    }
  }
`;
export const onDeleteRestaurant = /* GraphQL */ `
  subscription OnDeleteRestaurant {
    onDeleteRestaurant {
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
          reviewRestaurantId
        }
        nextToken
      }
    }
  }
`;
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview {
    onCreateReview {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview {
    onUpdateReview {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview {
    onDeleteReview {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
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
