describe('Restaurant:', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  describe('Create:', () => {
    it('owner 1 signs in and creates 1 restaurant', () => {
      cy.get(selectors.usernameInput).type('cypress-owner1@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.createRestaurantButton).click();
      cy.get(selectors.restaurantNameInput).type('Cypress Delicious No.1');
      cy.get(selectors.restaurantFileInput).attachFile('cypress-1.jpg');
      cy.get(selectors.restaurantConfirmButton).click();
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.1');
      cy.get(selectors.signOutButton).click();
    });

    it('owner 2 signs in and creates 2 restaurants', () => {
      cy.get(selectors.usernameInput).type('cypress-owner2@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.createRestaurantButton).click();
      cy.get(selectors.restaurantNameInput).type('Cypress Delicious No.2');
      cy.get(selectors.restaurantFileInput).attachFile('cypress-2.jpg');
      cy.get(selectors.restaurantConfirmButton).click();
      cy.get(selectors.createRestaurantButton).click();
      cy.get(selectors.restaurantNameInput).type('Cypress Delicious No.3');
      cy.get(selectors.restaurantFileInput).attachFile('cypress-3.jpg');
      cy.get(selectors.restaurantConfirmButton).click();
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.2');
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.3');
      cy.get(selectors.signOutButton).click();
    });
  });

  describe('Read:', () => {
    it('owner 1 signs in and only see his 1 restaurant', () => {
      cy.get(selectors.usernameInput).type('cypress-owner1@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.1');
      cy.get(selectors.restaurantListGrid).should(
        'not.contain',
        'Cypress Delicious No.2'
      );
      cy.get(selectors.restaurantListGrid).should(
        'not.contain',
        'Cypress Delicious No.3'
      );
      cy.get(selectors.signOutButton).click();
    });

    it('owner 2 signs in and only see his 2 restaurants', () => {
      cy.get(selectors.usernameInput).type('cypress-owner2@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.2');
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.3');
      cy.get(selectors.restaurantListGrid).should(
        'not.contain',
        'Cypress Delicious No.1'
      );
      cy.get(selectors.signOutButton).click();
    });

    it('user signs in and can see all 3 restaurants', () => {
      cy.get(selectors.usernameInput).type('cypress-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.1');
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.2');
      cy.get(selectors.restaurantListGrid).contains('Cypress Delicious No.3');
      cy.get(selectors.signOutButton).click();
    });
  });

  describe('Update:', () => {
    it("admin signs in and updates owner 1's restaurant", () => {
      cy.get(selectors.usernameInput).type('admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .click();
      cy.get(selectors.restaurantEditButton).click();
      cy.get(selectors.restaurantNameInput)
        .clear()
        .type('Updated Delicious No.1');
      cy.get(selectors.restaurantFileInput).attachFile('cypress-1.jpg');
      cy.get(selectors.restaurantConfirmButton).click();
    });
  });

  describe('Delete:', () => {
    it('admin signs in and delete all restaurants', () => {
      cy.get(selectors.usernameInput).type('admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      [1, 2, 3].forEach(n => {
        const restaurantName = `Cypress Delicious No.${n}`;
        cy.get(selectors.restaurantItemName)
          .contains(restaurantName)
          .click();
        cy.get(selectors.restaurantDeleteButton).click();
        cy.get(selectors.alertDialogConfirmButton).click();
      });
    });
  });
});

export const selectors = {
  usernameInput: '[data-test="email-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-cy="sign-out-button"]',
  createRestaurantButton: '[data-cy="create-restaurant-button"]',
  restaurantNameInput: '[data-cy="restaurant-name-input"] input',
  restaurantFileInput: '[data-cy="file-input"]',
  restaurantConfirmButton: '[data-cy="restaurant-dialog-confirm"]',
  restaurantListGrid: '[data-cy="restaurant-list-grid"]',
  restaurantItemName: '[data-cy="restaurant-list-item-name"]',
  restaurantEditButton: '[data-cy="restaurant-edit-button"]',
  restaurantDeleteButton: '[data-cy="restaurant-delete-button"]',
  alertDialogConfirmButton: '[data-cy="alert-dialog-confirm"]'
};
