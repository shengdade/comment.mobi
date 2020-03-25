export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $input: CreateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    createRestaurant(input: $input, condition: $condition) {
      id
      name
      owner
      image {
        bucket
        region
        key
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
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

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
      reviewRestaurantOwner
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
      reviewRestaurantOwner
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
      reply
    }
  }
`;
