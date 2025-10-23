describe('Mon test du formulaire à l\'accueil', () => {
  it('devrait visiter la page formulaire', () => {
    cy.visit('/formulaire')
    // Vérifier que la page se charge correctement
    cy.url().should('include', '/formulaire')
  })

  it('devrait afficher le titre de la page et la présentation', () => {
    cy.visit('/formulaire')
    cy.get('h1').should('contain', 'Accueil')
    cy.get('h2').should('contain', 'Bienvenue')
    cy.get('h2').should('contain', 'demandes')

  })


  it('devrait pouvoir interagir avec le formulaire', () => {
    cy.visit('/formulaire')
    // le formulaire est visible et complet
    cy.get('form').should('be.visible')
    cy.get('input[name="titre"]').type('Test de titre')
    cy.get('textarea[name="description"]').type('Test de description')
    cy.get('input[name="requester"]').type('Test de requester')
    cy.get('select[name="priority"]').select('moyenne')
    cy.get('button[id="ajouter-ticket"]').should('contain', 'Ajouter un ticket')
    cy.get('button[id="ajouter-ticket"]').click()
  })
})