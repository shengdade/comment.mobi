/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $input: CreateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    createRestaurant(input: $input, condition: $condition) {
      id
      name
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
export const updateRestaurant = /* GraphQL */ `
  mutation UpdateRestaurant(
    $input: UpdateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    updateRestaurant(input: $input, condition: $condition) {
      id
      name
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
export const deleteRestaurant = /* GraphQL */ `
  mutation DeleteRestaurant(
    $input: DeleteRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    deleteRestaurant(input: $input, condition: $condition) {
      id
      name
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
      restaurant {
        id
        name
        averageRate
        reviews {
          nextToken
        }
      }
    }
  }
`;
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
      restaurant {
        id
        name
        averageRate
        reviews {
          nextToken
        }
      }
    }
  }
`;
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
      id
      rate
      visitDate
      comment
      reviewRestaurantId
      restaurant {
        id
        name
        averageRate
        reviews {
          nextToken
        }
      }
    }
  }
`;
