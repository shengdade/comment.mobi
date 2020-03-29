describe('Owner:', function() {
  before(function() {
    cy.visit('/');
    cy.get(selectors.usernameInput).type('cypress-owner@comment.mobi');
    cy.get(selectors.signInPasswordInput).type('1234567890');
    cy.get(selectors.signInSignInButton)
      .contains('Sign In')
      .click();
  });

  it('can create a new restaurant', () => {
    cy.get(selectors.createRestaurantButton).click();
    cy.get(selectors.restaurantNameInput).type('Cypress Delicious');
    cy.get(selectors.restaurantFileInput).attachFile('restaurant.jpg');
    cy.get(selectors.restaurantConfirmButton).click();
    cy.scrollTo('bottom');
  });
});

export const selectors = {
  usernameInput: '[data-test="email-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  createRestaurantButton: '[data-cy="create-restaurant-button"]',
  restaurantNameInput: '[data-cy="restaurant-name-input"]',
  restaurantFileInput: '[data-cy="file-input"]',
  restaurantConfirmButton: '[data-cy="restaurant-dialog-confirm"]'
};
