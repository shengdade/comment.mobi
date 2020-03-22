/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRestaurant = /* GraphQL */ `
  subscription OnCreateRestaurant {
    onCreateRestaurant {
      id
      name
      owner
      image {
        bucket
        region
        key
      }
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
export const onUpdateRestaurant = /* GraphQL */ `
  subscription OnUpdateRestaurant {
    onUpdateRestaurant {
      id
      name
      owner
      image {
        bucket
        region
        key
      }
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
export const onDeleteRestaurant = /* GraphQL */ `
  subscription OnDeleteRestaurant {
    onDeleteRestaurant {
      id
      name
      owner
      image {
        bucket
        region
        key
      }
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
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview {
    onCreateReview {
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
        image {
          bucket
          region
          key
        }
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
      reply
      reviewRestaurantId
      reviewRestaurantOwner
      restaurant {
        id
        name
        owner
        image {
          bucket
          region
          key
        }
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
      reply
      reviewRestaurantId
      reviewRestaurantOwner
      restaurant {
        id
        name
        owner
        image {
          bucket
          region
          key
        }
        reviews {
          nextToken
        }
      }
    }
  }
`;
