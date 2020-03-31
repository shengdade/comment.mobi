describe('Admin:', function() {
  beforeEach(function() {
    cy.visit('/admin');
  });

  afterEach(function() {
    cy.get(selectors.signOutButton).click();
  });

  describe('Access:', () => {
    it('denies regular user to sign in Administrator page', () => {
      cy.get(selectors.usernameInput).type('cypress-user@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get('.MuiTypography-h5').contains(
        "You don't have access to Administrator page."
      );
    });

    it('denies owner to sign in Administrator page', () => {
      cy.get(selectors.usernameInput).type('cypress-owner1@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.get('.MuiTypography-h5').contains(
        "You don't have access to Administrator page."
      );
    });
  });

  describe('Read:', () => {
    it('allows admin sign in and reads all cypress users', () => {
      cy.get(selectors.usernameInput).type('cypress-admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.contains('cypress-user@comment.mobi');
      cy.contains('cypress-owner1@comment.mobi');
      cy.contains('cypress-owner2@comment.mobi');
      cy.contains('cypress-admin@comment.mobi');
    });
  });

  describe('Update:', () => {
    it('allows admin add user to a group (attach a role)', () => {
      cy.get(selectors.usernameInput).type('cypress-admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.contains('cypress-user@comment.mobi')
        .parent()
        .parent()
        .find(selectors.adminAddRoleButton)
        .click();
      cy.get(selectors.adminDialogOwner).click();
    });

    it('allows admin remove user from a group (detach a role)', () => {
      cy.get(selectors.usernameInput).type('cypress-admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.contains('cypress-user@comment.mobi')
        .parent()
        .parent()
        .find(selectors.removeOwnerRoleIcon)
        .click();
    });
  });

  describe('Delete:', () => {
    it('allows admin choose to delete a user', () => {
      cy.get(selectors.usernameInput).type('cypress-admin@comment.mobi');
      cy.get(selectors.signInPasswordInput).type('1234567890');
      cy.get(selectors.signInSignInButton).click();
      cy.contains('cypress-user@comment.mobi')
        .parent()
        .parent()
        .parent()
        .find(selectors.adminDeleteRoleButton)
        .click();
      cy.get(selectors.alertDialogCancelButton).click(); // don't actually delete the user
    });
  });
});

export const selectors = {
  usernameInput: '[data-test="email-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-cy="sign-out-button"]',
  adminAddRoleButton: '[data-cy="admin-add-role-button"]',
  adminDeleteRoleButton: '[data-cy="admin-delete-role-button"]',
  adminDialogUser: '[data-cy="admin-dialog-user"]',
  adminDialogOwner: '[data-cy="admin-dialog-owner"]',
  adminDialogAdmin: '[data-cy="admin-dialog-admin"]',
  removeUserRoleIcon:
    '[data-cy="admin-remove-user-role-chip"] .MuiChip-deleteIcon',
  removeOwnerRoleIcon:
    '[data-cy="admin-remove-owner-role-chip"] .MuiChip-deleteIcon',
  removeAdminRoleIcon:
    '[data-cy="admin-remove-admin-role-chip"] .MuiChip-deleteIcon',
  alertDialogCancelButton: '[data-cy="alert-dialog-cancel"]'
};
