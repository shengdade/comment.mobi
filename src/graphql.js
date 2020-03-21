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
