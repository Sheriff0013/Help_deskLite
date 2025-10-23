// Variables globales pour les éléments DOM
let button_croissant, button_decroissant, button_titre, button_requester, button_priority, button_status, liste_tickets;
let formulaire_modification, btn_sauvegarder, btn_supprimer, btn_annuler, btn_charger_ticket;

// Variables pour les formulaires de filtres
let formulaire_filtre_titre, formulaire_filtre_requester, formulaire_filtre_priority, formulaire_filtre_status;
let btn_filtrer_titre, btn_filtrer_requester, btn_filtrer_priority, btn_filtrer_status;
let btn_annuler_filtre_titre, btn_annuler_filtre_requester, btn_annuler_filtre_priority, btn_annuler_filtre_status;

// Initialiser les éléments DOM après le chargement de la page
function initializeElements() {
  console.log('Initialisation des éléments DOM...');

  button_croissant = document.getElementById('trier-par-date-asc');
  button_decroissant = document.getElementById('trier-par-date-desc');
  button_titre = document.getElementById('filtrer-par-titre');
  button_requester = document.getElementById('filtrer-par-requester');
  button_priority = document.getElementById('filtrer-par-priority');
  button_status = document.getElementById('filtrer-par-status');
  liste_tickets = document.getElementById('liste-tickets');

  // Éléments du formulaire de modification
  formulaire_modification = document.getElementById('formulaire-modification');
  btn_sauvegarder = document.getElementById('btn-sauvegarder');
  btn_supprimer = document.getElementById('btn-supprimer');
  btn_annuler = document.getElementById('btn-annuler');
  btn_charger_ticket = document.getElementById('btn-charger-ticket');

  // Éléments des formulaires de filtres
  formulaire_filtre_titre = document.getElementById('formulaire-filtre-titre');
  formulaire_filtre_requester = document.getElementById('formulaire-filtre-requester');
  formulaire_filtre_priority = document.getElementById('formulaire-filtre-priority');
  formulaire_filtre_status = document.getElementById('formulaire-filtre-status');

  btn_filtrer_titre = document.getElementById('btn-filtrer-titre');
  btn_filtrer_requester = document.getElementById('btn-filtrer-requester');
  btn_filtrer_priority = document.getElementById('btn-filtrer-priority');
  btn_filtrer_status = document.getElementById('btn-filtrer-status');

  btn_annuler_filtre_titre = document.getElementById('btn-annuler-filtre-titre');
  btn_annuler_filtre_requester = document.getElementById('btn-annuler-filtre-requester');
  btn_annuler_filtre_priority = document.getElementById('btn-annuler-filtre-priority');
  btn_annuler_filtre_status = document.getElementById('btn-annuler-filtre-status');

  console.log('Éléments trouvés:');
  console.log('- button_croissant:', button_croissant);
  console.log('- button_decroissant:', button_decroissant);
  console.log('- liste_tickets:', liste_tickets);
  console.log('- formulaire_modification:', formulaire_modification);

  // Vérifier que tous les éléments existent
  if (!button_croissant) console.error('Bouton croissant non trouvé');
  if (!button_decroissant) console.error('Bouton décroissant non trouvé');
  if (!liste_tickets) console.error('Liste tickets non trouvée');
}

// Fonction pour afficher les tickets
function displayTickets(tickets) {
  console.log('displayTickets appelée avec:', tickets);
  console.log('liste_tickets élément:', liste_tickets);

  if (!liste_tickets) {
    console.error('ERREUR: liste_tickets est null ou undefined');
    return;
  }

  if (!tickets || tickets.length === 0) {
    console.log('Aucun ticket à afficher');
    liste_tickets.innerHTML = '<li>Aucun ticket trouvé</li>';
    return;
  }

  console.log(`Affichage de ${tickets.length} tickets`);
  const htmlContent = tickets.map(ticket => `
    <li>
      <strong>#${ticket.id} - ${ticket.title}</strong><br>
      <em>Description:</em> ${ticket.description}<br>
      <em>Auteur:</em> ${ticket.requester}<br>
      <em>Priorité:</em> ${ticket.priority}<br>
      <em>Statut:</em> ${ticket.status}<br>
      <em>Créé le:</em> ${ticket.createdAt}<br>
      <em>Mis à jour le:</em> ${ticket.updatedAt}
      <button class="btn-modifier" data-ticket-id="${ticket.id}" data-ticket-title="${ticket.title}" data-ticket-description="${ticket.description}" data-ticket-requester="${ticket.requester}" data-ticket-priority="${ticket.priority}" data-ticket-status="${ticket.status}">
        <img src="/crayon.jpg" alt="Modifier">
      </button>
      <button class="btn-supprimer" data-ticket-id="${ticket.id}" data-ticket-title="${ticket.title}">
        <img src="/corbeille.jpg" alt="Supprimer">
      </button>
    </li>
  `).join('');

  console.log('HTML généré:', htmlContent);
  liste_tickets.innerHTML = htmlContent;
  console.log('HTML inséré dans liste_tickets');

  // Ajouter les événements aux boutons dynamiques
  addDynamicButtonEvents();

  // Debug: vérifier que les boutons sont présents
  const buttons = document.querySelectorAll('.btn-modifier, .btn-supprimer');
  console.log(`Nombre de boutons trouvés: ${buttons.length}`);
  buttons.forEach((btn, index) => {
    console.log(`Bouton ${index + 1}:`, btn.className, btn.querySelector('img')?.src);
  });
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
      document.getElementById('titre-liste').innerHTML = 'Liste des tickets triés par date à partir du plus ancien';
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
        document.getElementById('titre-liste').innerHTML = 'Liste des tickets triés par date à partir du plus ancien';

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
          document.getElementById('titre-liste').innerHTML = 'Liste des tickets triés par date à partir du plus récent';
        } else {
          liste_tickets.innerHTML = '<li>Erreur lors du chargement</li>';
        }
      } catch (error) {
        console.error('Erreur lors du tri décroissant:', error);
        liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
      }
    });
  }

  // Ajouter les événements pour les filtres
  if (button_titre) {
    button_titre.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
      showFilterForm('titre');
    });
  }

  if (button_requester) {
    button_requester.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
      showFilterForm('requester');
    });
  }

  if (button_priority) {
    button_priority.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
      showFilterForm('priority');
    });
  }

  if (button_status) {
    button_status.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
      showFilterForm('status');
    });
  }

  // Les événements pour les boutons de modification/suppression sont maintenant gérés dans addDynamicButtonEvents()

  // Événements du formulaire de modification
  if (btn_sauvegarder) {
    btn_sauvegarder.addEventListener('click', async function (e) {
      e.preventDefault();
      await saveTicket();
    });
  }

  if (btn_supprimer) {
    btn_supprimer.addEventListener('click', async function (e) {
      e.preventDefault();
      await deleteTicketFromForm();
    });
  }

  if (btn_annuler) {
    btn_annuler.addEventListener('click', function (e) {
      e.preventDefault();
      hideModificationForm();
    });
  }

  if (btn_charger_ticket) {
    btn_charger_ticket.addEventListener('click', async function (e) {
      e.preventDefault();
      await loadTicketData();
    });
  }

  // Événements des formulaires de filtres
  if (btn_filtrer_titre) {
    btn_filtrer_titre.addEventListener('click', async function (e) {
      e.preventDefault();
      await filterByTitle();
    });
  }

  if (btn_filtrer_requester) {
    btn_filtrer_requester.addEventListener('click', async function (e) {
      e.preventDefault();
      await filterByRequester();
    });
  }

  if (btn_filtrer_priority) {
    btn_filtrer_priority.addEventListener('click', async function (e) {
      e.preventDefault();
      await filterByPriority();
    });
  }

  if (btn_filtrer_status) {
    btn_filtrer_status.addEventListener('click', async function (e) {
      e.preventDefault();
      await filterByStatus();
    });
  }

  // Boutons d'annulation des filtres
  if (btn_annuler_filtre_titre) {
    btn_annuler_filtre_titre.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
    });
  }

  if (btn_annuler_filtre_requester) {
    btn_annuler_filtre_requester.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
    });
  }

  if (btn_annuler_filtre_priority) {
    btn_annuler_filtre_priority.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
    });
  }

  if (btn_annuler_filtre_status) {
    btn_annuler_filtre_status.addEventListener('click', function (e) {
      e.preventDefault();
      hideAllFilterForms();
    });
  }
}

// Fonctions pour gérer les formulaires de filtres
function showFilterForm(type) {
  hideAllFilterForms();

  switch (type) {
    case 'titre':
      if (formulaire_filtre_titre) formulaire_filtre_titre.style.display = 'block';
      break;
    case 'requester':
      if (formulaire_filtre_requester) formulaire_filtre_requester.style.display = 'block';
      break;
    case 'priority':
      if (formulaire_filtre_priority) formulaire_filtre_priority.style.display = 'block';
      break;
    case 'status':
      if (formulaire_filtre_status) formulaire_filtre_status.style.display = 'block';
      break;
  }
}

function hideAllFilterForms() {
  if (formulaire_filtre_titre) formulaire_filtre_titre.style.display = 'none';
  if (formulaire_filtre_requester) formulaire_filtre_requester.style.display = 'none';
  if (formulaire_filtre_priority) formulaire_filtre_priority.style.display = 'none';
  if (formulaire_filtre_status) formulaire_filtre_status.style.display = 'none';
}

async function filterByTitle() {
  const titre = document.getElementById('filtre-titre').value.trim();

  if (!titre) {
    alert('Veuillez entrer un titre à rechercher');
    return;
  }

  try {
    const response = await fetch(`/api/getTicketByTitle?title=${encodeURIComponent(titre)}`);
    const data = await response.json();

    if (data.success) {
      displayTickets(data.result);
      hideAllFilterForms();
    } else {
      liste_tickets.innerHTML = '<li>Aucun ticket trouvé avec ce titre</li>';
    }
  } catch (error) {
    liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
  }
}

async function filterByRequester() {
  const requester = document.getElementById('filtre-requester').value.trim();

  if (!requester) {
    alert('Veuillez entrer un nom de demandeur');
    return;
  }

  try {
    const response = await fetch(`/api/getTicketByRequester?requester=${encodeURIComponent(requester)}`);
    const data = await response.json();

    if (data.success) {
      displayTickets(data.result);
      hideAllFilterForms();
    } else {
      liste_tickets.innerHTML = '<li>Aucun ticket trouvé pour cet auteur</li>';
    }
  } catch (error) {
    liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
  }
}

async function filterByPriority() {
  const priority = document.getElementById('filtre-priority').value;

  if (!priority) {
    alert('Veuillez sélectionner une priorité');
    return;
  }

  try {
    const response = await fetch(`/api/getTicketByPriority?priority=${priority}`);
    const data = await response.json();

    if (data.success) {
      displayTickets(data.result);
      hideAllFilterForms();
    } else {
      liste_tickets.innerHTML = '<li>Aucun ticket trouvé avec cette priorité</li>';
    }
  } catch (error) {
    liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
  }
}

async function filterByStatus() {
  const status = document.getElementById('filtre-status').value;

  if (!status) {
    alert('Veuillez sélectionner un statut');
    return;
  }

  try {
    const response = await fetch(`/api/getTicketByStatus?status=${status}`);
    const data = await response.json();

    if (data.success) {
      displayTickets(data.result);
      hideAllFilterForms();
    } else {
      liste_tickets.innerHTML = '<li>Aucun ticket trouvé avec ce statut</li>';
    }
  } catch (error) {
    liste_tickets.innerHTML = '<li>Erreur de connexion</li>';
  }
}

// Fonctions pour gérer le formulaire de modification
function showModificationForm(action, preserveData = false) {
  if (formulaire_modification) {
    formulaire_modification.style.display = 'block';

    // Vider le formulaire seulement si on ne préserve pas les données
    if (!preserveData) {
      document.getElementById('ticket-id').value = '';
      document.getElementById('ticket-title').value = '';
      document.getElementById('ticket-description').value = '';
      document.getElementById('ticket-requester').value = '';
      document.getElementById('ticket-priority').value = '';
      document.getElementById('ticket-status').value = '';
    }

    // Ajuster les boutons selon l'action
    if (action === 'delete') {
      btn_sauvegarder.style.display = 'none';
      btn_supprimer.style.display = 'block';
      formulaire_modification.querySelector('h4').textContent = 'Supprimer un ticket';
    } else if (action === 'update') {
      btn_sauvegarder.style.display = 'block';
      btn_supprimer.style.display = 'none';
      formulaire_modification.querySelector('h4').textContent = 'Modifier un ticket';
    }
  }
}

function hideModificationForm() {
  if (formulaire_modification) {
    formulaire_modification.style.display = 'none';
  }
}

async function loadTicketData() {
  const id = document.getElementById('ticket-id').value;

  if (!id) {
    alert('Veuillez entrer un ID de ticket');
    return;
  }

  try {
    const response = await fetch(`/api/getTicketById?id=${id}`);
    const data = await response.json();

    if (data.success && data.result) {
      const ticket = data.result;

      // Pré-remplir tous les champs
      document.getElementById('ticket-title').value = ticket.title || '';
      document.getElementById('ticket-description').value = ticket.description || '';
      document.getElementById('ticket-requester').value = ticket.requester || '';
      document.getElementById('ticket-priority').value = ticket.priority || '';
      document.getElementById('ticket-status').value = ticket.status || '';

      alert('Données du ticket chargées avec succès !');
    } else {
      alert('Ticket non trouvé avec cet ID');
    }
  } catch (error) {
    alert('Erreur lors du chargement des données');
  }
}

async function saveTicket() {
  const formData = {
    id: document.getElementById('ticket-id').value,
    title: document.getElementById('ticket-title').value,
    description: document.getElementById('ticket-description').value,
    requester: document.getElementById('ticket-requester').value,
    priority: document.getElementById('ticket-priority').value,
    status: document.getElementById('ticket-status').value
  };

  // Validation
  if (!formData.id || !formData.title || !formData.description || !formData.requester) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Validation que l'ID est un nombre valide
  if (isNaN(formData.id) || formData.id <= 0) {
    alert('L\'ID du ticket doit être un nombre positif valide');
    return;
  }

  // Confirmation avant modification
  if (!confirm(`Êtes-vous sûr de vouloir modifier le ticket #${formData.id} ?`)) {
    return;
  }

  try {
    const response = await fetch('/api/updateTicket', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Ticket mis à jour avec succès');
      hideModificationForm();
      // Recharger la liste
      const refreshResponse = await fetch('/api/getAllTicketsDESC');
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        displayTickets(refreshData.result);
      }
    } else {
      alert('Erreur lors de la mise à jour: ' + data.error);
    }
  } catch (error) {
    alert('Erreur de connexion');
  }
}

async function deleteTicketFromForm() {
  const id = document.getElementById('ticket-id').value;

  if (!id) {
    alert('Veuillez entrer l\'ID du ticket à supprimer');
    return;
  }

  if (confirm(`Êtes-vous sûr de vouloir supprimer le ticket #${id} ?`)) {
    try {
      const response = await fetch(`/api/deleteTicket?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        alert('Ticket supprimé avec succès');
        hideModificationForm();
        // Recharger la liste
        const refreshResponse = await fetch('/api/getAllTicketsDESC');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          displayTickets(refreshData.result);
        }
      } else {
        alert('Erreur lors de la suppression: ' + data.error);
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  }
}

// Fonction pour ajouter les événements aux boutons dynamiques
function addDynamicButtonEvents() {
  // Boutons de modification
  const btnModifiers = document.querySelectorAll('.btn-modifier');
  btnModifiers.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const ticketId = this.getAttribute('data-ticket-id');
      const ticketTitle = this.getAttribute('data-ticket-title');
      const ticketDescription = this.getAttribute('data-ticket-description');
      const ticketRequester = this.getAttribute('data-ticket-requester');
      const ticketPriority = this.getAttribute('data-ticket-priority');
      const ticketStatus = this.getAttribute('data-ticket-status');

      // Afficher le formulaire en mode modification (sans vider les données)
      showModificationForm('update', true);

      // Pré-remplir le formulaire avec les données du ticket
      console.log('Pré-remplissage du formulaire avec:', {
        id: ticketId,
        title: ticketTitle,
        description: ticketDescription,
        requester: ticketRequester,
        priority: ticketPriority,
        status: ticketStatus
      });

      document.getElementById('ticket-id').value = ticketId;
      document.getElementById('ticket-title').value = ticketTitle;
      document.getElementById('ticket-description').value = ticketDescription;
      document.getElementById('ticket-requester').value = ticketRequester;
      document.getElementById('ticket-priority').value = ticketPriority;
      document.getElementById('ticket-status').value = ticketStatus;

      console.log('Formulaire rempli. Valeurs actuelles:', {
        id: document.getElementById('ticket-id').value,
        title: document.getElementById('ticket-title').value,
        description: document.getElementById('ticket-description').value,
        requester: document.getElementById('ticket-requester').value,
        priority: document.getElementById('ticket-priority').value,
        status: document.getElementById('ticket-status').value
      });
    });
  });

  // Boutons de suppression
  const btnSupprimers = document.querySelectorAll('.btn-supprimer');
  btnSupprimers.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const ticketId = this.getAttribute('data-ticket-id');
      const ticketTitle = this.getAttribute('data-ticket-title');

      // Demander confirmation
      if (confirm(`Êtes-vous sûr de vouloir supprimer le ticket #${ticketId} - "${ticketTitle}" ?`)) {
        deleteTicketDirectly(ticketId);
      }
    });
  });
}

// Fonction pour supprimer directement un ticket
async function deleteTicketDirectly(ticketId) {
  try {
    const response = await fetch(`/api/deleteTicket?id=${ticketId}`, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (data.success) {
      alert('Ticket supprimé avec succès');
      // Recharger la liste
      const refreshResponse = await fetch('/api/getAllTicketsDESC');
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        displayTickets(refreshData.result);
      }
    } else {
      alert('Erreur lors de la suppression: ' + data.error);
    }
  } catch (error) {
    alert('Erreur de connexion');
  }
}