describe('Authenticator:', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  describe('Sign In:', () => {
    it('denies a user to signin when the user does not exist', () => {
      cy.get(selectors.usernameInput).type('wrong-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('wrong_password');
      cy.get(selectors.signInSignInButton)
        .contains('Sign In')
        .click();
      cy.get(selectors.authenticatorError).contains('User does not exist');
    });

    it('allows a user to signin with correct password', () => {
      cy.get(selectors.usernameInput).type('cypress-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton)
        .contains('Sign In')
        .click();
      cy.get(selectors.signOutButton).should('be.visible');
    });
  });
});

export const selectors = {
  usernameInput: '[data-test="email-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-cy="sign-out-button"]',
  authenticatorError: '[data-test=authenticator-error]'
};
