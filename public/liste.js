// Variables globales pour les éléments DOM
let button_croissant, button_decroissant, button_titre, button_requester, button_priority, button_status, button_delete, button_update, liste_tickets;

// Initialiser les éléments DOM après le chargement de la page
function initializeElements() {
  button_croissant = document.getElementById('trier-par-date-asc');
  button_decroissant = document.getElementById('trier-par-date-desc');
  button_titre = document.getElementById('filtrer-par-titre');
  button_requester = document.getElementById('filtrer-par-requester');
  button_priority = document.getElementById('filtrer-par-priority');
  button_status = document.getElementById('filtrer-par-status');
  button_delete = document.getElementById('delete-ticket');
  button_update = document.getElementById('update-ticket');
  liste_tickets = document.getElementById('liste-tickets');

  // Vérifier que tous les éléments existent
  if (!button_croissant) console.error('Bouton croissant non trouvé');
  if (!button_decroissant) console.error('Bouton décroissant non trouvé');
  if (!liste_tickets) console.error('Liste tickets non trouvée');
}

// Fonction pour afficher les tickets
function displayTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    liste_tickets.innerHTML = '<li>Aucun ticket trouvé</li>';
    return;
  }

  liste_tickets.innerHTML = tickets.map(ticket => `
    <li>
      <strong>#${ticket.id} - ${ticket.title}</strong><br>
      <em>Description:</em> ${ticket.description}<br>
      <em>Demandeur:</em> ${ticket.requester}<br>
      <em>Priorité:</em> ${ticket.priority}<br>
      <em>Statut:</em> ${ticket.status}<br>
      <em>Créé le:</em> ${ticket.createdAt}<br>
      <em>Mis à jour le:</em> ${ticket.updatedAt}
    </li>
  `).join('');
}

// Charger tous les tickets au chargement de la page
document.addEventListener('DOMContentLoaded', async function () {
  // Initialiser les éléments DOM
  initializeElements();

  // Ajouter les événements aux boutons
  addEventListeners();

  try {
    const response = await fetch('/api/getAllTicketsDESC');
    const data = await response.json();

    if (data.success) {
      displayTickets(data.result);
    } else {
      liste_tickets.innerHTML = '<li>Erreur lors du chargement des tickets</li>';
    }
  } catch (error) {
    console.error('Erreur lors du chargement initial:', error);
    liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
  }
});

// Fonction pour ajouter tous les événements
function addEventListeners() {
  if (button_croissant) {
    button_croissant.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('Bouton croissant cliqué');
      try {
        const response = await fetch('/api/getAllTicketsASC');
        const data = await response.json();
        console.log('Données reçues:', data);
        document.getElementById('titre-liste').innerHTML = 'Liste des tickets triés par date du plus ancien';

        if (data.success) {
          displayTickets(data.result);
        } else {
          liste_tickets.innerHTML = '<li>Erreur lors du chargement</li>';
        }
      } catch (error) {
        console.error('Erreur lors du tri croissant:', error);
        liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
      }
    });
  }

  if (button_decroissant) {
    button_decroissant.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('Bouton décroissant cliqué');
      try {
        const response = await fetch('/api/getAllTicketsDESC');
        const data = await response.json();

        if (data.success) {
          displayTickets(data.result);
        } else {
          liste_tickets.innerHTML = '<li>Erreur lors du chargement</li>';
        }
      } catch (error) {
        console.error('Erreur lors du tri décroissant:', error);
        liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
      }
    });
  }
}

// Les autres événements seront ajoutés dans addEventListeners() si nécessaire