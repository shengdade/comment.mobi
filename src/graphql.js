export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $input: CreateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    createRestaurant(input: $input, condition: $condition) {
      id
      name
      owner
      averageRate
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
        averageRate
        image {
          bucket
          region
          key
        }
        reviews {
          items {
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
      averageRate
      image {
        bucket
        region
        key
      }
    }
  }
`;
