const getIframeBody = () => {
  return (
    cy
      .get('iframe[data-cy="the-frame"]')
      // Cypress yields jQuery element, which has the real
      // DOM element under property "0".
      // From the real DOM iframe element we can get
      // the "document" element, it is stored in "contentDocument" property
      // Cypress "its" command can access deep properties using dot notation
      // https://on.cypress.io/its
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
  );
};

it('iframe work', () => {
  cy.visit('cypress/fixtures/iframe_demo.html');

  const iframeBody = getIframeBody();
  iframeBody.find('#sb_form_q').type('百度');
});
