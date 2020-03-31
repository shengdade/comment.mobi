describe('Review:', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  afterEach(function() {
    cy.get(selectors.signOutButton).click();
  });

  before(function() {
    cy.visit('/');
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

  after(function() {
    cy.visit('/');
    cy.get(selectors.usernameInput).type('admin@comment.mobi');
    cy.get(selectors.signInPasswordInput).type('1234567890');
    cy.get(selectors.signInSignInButton).click();
    cy.get(selectors.restaurantItemName)
      .contains('Cypress Delicious No.1')
      .click();
    cy.get(selectors.restaurantDeleteButton).click();
    cy.get(selectors.alertDialogConfirmButton).click();
  });

  describe('Create:', () => {
    it('user signs in and leaves 1 reivew', () => {
      cy.get(selectors.usernameInput).type('cypress-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .parentsUntil('.MuiGrid-item')
        .find(selectors.restaurantReviewButton)
        .click();
      cy.get('[for="review-3"]').click();
      cy.get(selectors.reviewCommentInput).type(
        'I ordered their Khao Soi and it was fantastic! The soup was rich and had a bit of heat, the perfect combination! The beef was also so tender.'
      );
      cy.get(selectors.reviewSubmitButton).click();
    });

    it('owner 1 signs in and replies the review', () => {
      cy.get(selectors.usernameInput).type('cypress-owner1@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .parentsUntil('.MuiGrid-item')
        .contains('1 review unreplied')
        .parent()
        .find('button')
        .click();
      cy.get(selectors.reviewListReplyButton).click();
      cy.get(selectors.replyCreateReplyInput).type(
        'I would definitely recommend going, but be sure to either make a reservation or be prepared to wait in line for a table.'
      );
      cy.get(selectors.replyCreateReplyConfirm).click();
    });
  });

  describe('Read:', () => {
    it("user signs in and can see his review and owner's reply", () => {
      cy.get(selectors.usernameInput).type('cypress-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .click();
      cy.get(selectors.reviewCardComment).contains(/^I ordered their .+\.$/);
      cy.get(selectors.reviewCardReply).contains(/^I would definitely .+\.$/);
    });
  });

  describe('Update:', () => {
    it("admin signs in and updates user's review", () => {
      cy.get(selectors.usernameInput).type('admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .click();
      cy.get(selectors.reviewCardEditButton).click();
      cy.get('[for="review-4"]').click();
      cy.get(selectors.reviewCommentInput)
        .clear()
        .type('It is getting better.');
      cy.get(selectors.reviewSubmitButton).click();
    });
  });

  describe('Delete:', () => {
    it('admin signs in and deletes this review', () => {
      cy.get(selectors.usernameInput).type('admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get(selectors.restaurantItemName)
        .contains('Cypress Delicious No.1')
        .click();
      cy.get(selectors.reviewCardDeleteButton).click();
      cy.get(selectors.alertDialogConfirmButton).click();
    });
  });
});

export const selectors = {
  usernameInput: '[data-test="email-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-cy="sign-out-button"]',
  createRestaurantButton: '[data-cy="create-restaurant-button"]',
  restaurantReviewButton: '[data-cy="restaurant-review-button"]',
  reviewCommentInput: '[data-cy="review-comment-input"] textarea',
  reviewSubmitButton: '[data-cy="review-submit-button"]',
  reviewListReplyButton: '[data-cy="review-list-reply-button"]',
  replyCreateReplyInput: '[data-cy="reply-create-reply-input"]',
  replyCreateReplyConfirm: '[data-cy="reply-create-reply-confirm"]',
  reviewCardComment: '[data-cy="review-card-comment"]',
  reviewCardReply: '[data-cy="review-card-reply"]',
  reviewCardEditButton: '[data-cy="review-card-edit-button"]',
  reviewCardDeleteButton: '[data-cy="review-card-delete-button"]',
  restaurantNameInput: '[data-cy="restaurant-name-input"] input',
  restaurantFileInput: '[data-cy="file-input"]',
  restaurantConfirmButton: '[data-cy="restaurant-dialog-confirm"]',
  restaurantListGrid: '[data-cy="restaurant-list-grid"]',
  restaurantItemName: '[data-cy="restaurant-list-item-name"]',
  restaurantDeleteButton: '[data-cy="restaurant-delete-button"]',
  alertDialogConfirmButton: '[data-cy="alert-dialog-confirm"]'
};
