describe('When starting page is loaded', () => {
  beforeEach(() => {
    // enable response stubbing
    cy.server();
  });

  it('create a new car', () => {
    cy.route('GET',                 // Route all GET requests
      '/*/get-all-fleet',           // that have a URL that matches '/get-all-fleet'
      'fixture:empty-response.json' // and force the response to be: []
    );

    cy.route('POST',
      '/*/add-car-fleet',
      {}
    );

    cy.visit('/');

    cy.get('#no-fleet-message');

    cy.get('#add-car-button').click();

    // Fill-in the modal with the elements.
    cy.get('#name').type('name1');
    cy.get('#vin').type('vin1');
    cy.get('#make').type('make1');
    cy.get('#title').type('title1');
    cy.get('#year').type('2020');
    cy.get('#fuelType').type('fuel type');
    cy.get('#type').type('cwecwe');
    cy.get('#posLat').type('56.78');
    cy.get('#posLon').type('34.65');
    cy.get('#odometer').type('234');
    cy.get('#fuel').type('53');
    cy.get('#battery').type('3251');

    cy.get('#submit-button').click();

    cy.contains('A new car has been successfully added to your fleet.');
  });

  it('select and delete car', () => {
    cy.route('GET',                 // Route all GET requests
      '/*/get-all-fleet',           // that have a URL that matches '/get-all-fleet'
      'fixture:fleet-response.json' // and force the response to contain cars
    );

    cy.route('GET',                       // Route all GET requests
      '/*/get-car-fleet/*',               // that have a URL that matches '/get-car-fleet/*'
      'fixture:car-details-response.json' // and force the response to contain car details
    );

    cy.route('DELETE',                 // Route all DELETE requests
      '/*/delete-car-fleet/*',         // that have a URL that matches '/delete-car-fleet/*'
      {}                               // and force the response to be empty
    );

    cy.visit('/');

    cy.get('tbody > .car-row').should('have.length', 2);
    cy.get('tbody > .car-row').last().click();

    cy.get('#delete-car-button').click();
    cy.get('#confirm-delete-button').click();

    cy.contains('Selected car has been successfully removed from your fleet.');
  });
});
