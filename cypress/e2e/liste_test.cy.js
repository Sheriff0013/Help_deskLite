describe('Mon test de la liste des tickets', () => {
  it('devrait visiter la page liste', () => {
    cy.visit('/liste')
    // Vérifier que la page se charge correctement
    cy.url().should('include', '/liste')
  })
  it('devrait afficher le titre de la page et la présentation', () => {
    cy.visit('/liste')
    cy.get('h1').should('contain', 'Liste des tickets')

  })
  it('devrait pouvoir interagir avec la liste des tickets', () => {
    cy.visit('/liste')

    // Attendre que la liste soit chargée avec des éléments
    cy.get('ul[id="liste-tickets"]', { timeout: 10000 }).should('exist')
    cy.get('ul[id="liste-tickets"] li', { timeout: 10000 }).should('have.length.greaterThan', 0)

    // Vérifier le contenu des tickets 
    cy.get('li').should('contain', 'Test')
    cy.get('li').should('contain', 'Description:')
    cy.get('li').should('contain', 'Auteur:')
    cy.get('li').should('contain', 'Priorité:')
    cy.get('li').should('contain', 'Statut:')
    cy.get('li').should('contain', 'Créé le:')
    cy.get('li').should('contain', 'Mis à jour le:')
  })

  it('devrait afficher les boutons de tri et de filtre', () => {
    cy.visit('/liste')
    cy.get('button[id="trier-par-date-asc"]').should('contain', 'triés par date du plus ancien')
    cy.get('button[id="trier-par-date-desc"]').should('contain', 'triés par date du plus recent')
    cy.get('button[id="filtrer-par-titre"]').should('contain', 'filtrés par titre')
    cy.get('button[id="filtrer-par-requester"]').should('contain', 'filtrés par auteur')
    cy.get('button[id="filtrer-par-priority"]').should('contain', 'filtrés par priorité')
    cy.get('button[id="filtrer-par-status"]').should('contain', 'filtrés par statut')
  })

  it('devrait afficher les boutons de modification et de suppression', () => {
    cy.visit('/liste')
    cy.get('button[class="btn-modifier"]').should('exist').and('be.visible')
    cy.get('button[class="btn-supprimer"]').should('exist').and('be.visible')

  })

  it('devrait pouvoir chercher les tickets avec un titre contenant "test"', () => {
    cy.visit('/liste')

    // Attendre que la page soit chargée
    cy.get('ul[id="liste-tickets"]', { timeout: 10000 }).should('exist')

    // Cliquer sur le bouton pour afficher le formulaire de filtre
    cy.get('button[id="filtrer-par-titre"]').click()

    // Vérifier que le formulaire est maintenant visible
    cy.get('form#form-filtre-titre', { timeout: 5000 }).should('be.visible')

    // Remplir et soumettre le formulaire
    cy.get('input[name="titre"]').type('titre')
    cy.get('button[id="btn-filtrer-titre"]').click()

    // Vérifier le résultat
    cy.get('li').should('contain', 'Test')
  })

  it('devrait pouvoir modifier un ticket avec un titre contenant "test"', () => {
    cy.visit('/liste')

    // Attendre que la page soit chargée
    cy.get('ul[id="liste-tickets"]', { timeout: 10000 }).should('exist')

    // Cliquer sur le bouton modifier pour afficher le formulaire
    cy.get('button[class="btn-modifier"]').first().click()

    // Vérifier que le formulaire de modification est maintenant visible
    cy.get('form#form-modification', { timeout: 5000 }).should('be.visible')

    // Utiliser les IDs spécifiques du formulaire de modification avec nettoyage robuste
    cy.get('input#ticket-title').invoke('val', '').type('Test de titre modifié')
    cy.get('textarea#ticket-description').invoke('val', '').type('Test de description modifié')
    cy.get('input#ticket-requester').invoke('val', '').type('Test de auteur modifié')
    cy.get('select#ticket-priority').select('haute')
    cy.get('select#ticket-status').select('En cours')

    cy.get('button[id="btn-sauvegarder"]').click()
    cy.get('li').should('contain', 'modifié')
  })

  it('devrait pouvoir supprimer tous les tickets contenant "test"', () => {
    cy.visit('/liste')

    // ✅ Attendre que les tickets soient chargés
    cy.get('ul[id="liste-tickets"]').should('exist').and('not.be.empty')
    cy.get('ul[id="liste-tickets"] li').should('have.length.greaterThan', 0)

    // ✅ Attendre un peu plus pour s'assurer que tout est chargé
    cy.wait(2000)

    // Configurer la gestion des confirmations AVANT toute action
    cy.on('window:confirm', () => true)

    // Approche avec suppression séquentielle et vérification
    function deleteAllTestTickets() {
      // ✅ Utiliser un sélecteur plus spécifique
      cy.get('ul[id="liste-tickets"] li').then(($tickets) => {
        // 🔍 DIAGNOSTIC : Afficher tous les tickets trouvés
        cy.log(`🔍 DIAGNOSTIC: ${$tickets.length} tickets trouvés au total`)

        // Afficher le contenu de chaque ticket pour diagnostic
        $tickets.each((index, ticket) => {
          const ticketText = Cypress.$(ticket).text()
          cy.log(`Ticket ${index + 1}: ${ticketText.substring(0, 80)}...`)
        })

        const testTickets = $tickets.filter((index, ticket) => {
          const ticketText = Cypress.$(ticket).text().toLowerCase()
          const containsTest = ticketText.includes('test')
          cy.log(`Ticket ${index + 1} contient "test": ${containsTest} (${ticketText.substring(0, 50)}...)`)
          return containsTest
        })

        cy.log(`🔍 DIAGNOSTIC: ${testTickets.length} tickets contenant "test" détectés`)

        if (testTickets.length > 0) {
          cy.log(`Suppression de ${testTickets.length} tickets contenant "test"`)

          // Supprimer le premier ticket
          const firstTicket = testTickets.first()
          const ticketText = Cypress.$(firstTicket).text()

          cy.log(`Suppression du ticket: ${ticketText.substring(0, 50)}...`)

          // Vérifier et cliquer
          cy.wrap(firstTicket).find('button.btn-supprimer').should('exist').click()

          // Attendre et vérifier la suppression
          cy.wait(2000)

          // Vérifier que le ticket a disparu
          cy.get('li').should('not.contain', ticketText.substring(0, 30))

          cy.log(`✅ Ticket supprimé, vérification des tickets restants...`)

          // Répéter récursivement
          deleteAllTestTickets()
        } else {
          cy.log(`❌ PROBLÈME: Aucun ticket contenant "test" détecté, mais ils sont visibles dans l'interface!`)
        }
      })
    }

    deleteAllTestTickets()

    // Vérification finale avec logs de débogage
    cy.get('ul[id="liste-tickets"] li').then(($tickets) => {
      const remainingTestTickets = $tickets.filter((index, ticket) => {
        return Cypress.$(ticket).text().toLowerCase().includes('test')
      })

      if (remainingTestTickets.length > 0) {
        cy.log(`ERREUR: Il reste ${remainingTestTickets.length} tickets contenant "test"`)
        remainingTestTickets.each((index, ticket) => {
          cy.log(`Ticket restant: ${Cypress.$(ticket).text().substring(0, 100)}`)
        })
      } else {
        cy.log(`SUCCES: Aucun ticket contenant "test" restant`)
      }
    })

    // Vérification finale stricte
    cy.get('ul[id="liste-tickets"] li').should('not.contain', 'test')
  })
})