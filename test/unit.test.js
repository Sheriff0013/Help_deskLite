//JEU DE DONNÉES DE TEST COMPLET
const mockTickets = [
  {
    id: 1,
    title: 'Problème de connexion réseau',
    description: 'Impossible de se connecter au serveur principal',
    requester: 'Jean Dupont',
    priority: 'haute',
    status: 'open',
    createdAt: '2023-01-01 10:00:00',
    updatedAt: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    title: 'Demande de nouveau compte utilisateur',
    description: 'Création d\'un compte pour le nouveau stagiaire',
    requester: 'Marie Martin',
    priority: 'moyenne',
    status: 'open',
    createdAt: '2023-01-02 14:30:00',
    updatedAt: '2023-01-02 14:30:00'
  },
  {
    id: 3,
    title: 'Mise à jour du logiciel',
    description: 'Mise à jour vers la version 2.1',
    requester: 'Pierre Durand',
    priority: 'basse',
    status: 'closed',
    createdAt: '2023-01-03 09:15:00',
    updatedAt: '2023-01-03 16:45:00'
  },
  {
    id: 4,
    title: 'Bug dans l\'interface utilisateur',
    description: 'Le bouton de sauvegarde ne fonctionne pas',
    requester: 'Sophie Bernard',
    priority: 'haute',
    status: 'in_progress',
    createdAt: '2023-01-04 11:20:00',
    updatedAt: '2023-01-04 15:30:00'
  },
  {
    id: 5,
    title: 'Formation sur le nouveau système',
    description: 'Demande de formation pour l\'équipe',
    requester: 'Jean Dupont',
    priority: 'moyenne',
    status: 'closed',
    createdAt: '2023-01-05 08:45:00',
    updatedAt: '2023-01-05 17:00:00'
  }
];

// Mock de la base de données : fausse BDD
const mockDb = {
  run: jest.fn().mockImplementation(function (sql, params, callback) {
    // Simuler le comportement réel de SQLite
    if (callback) {
      // Simuler les propriétés SQLite sur 'this'
      this.lastID = 1;
      this.changes = 1;
      // Appeler le callback avec le bon contexte
      callback.call(this, null);
    }
    // Retourner l'objet avec les bonnes propriétés comme SQLite
    return {
      lastID: 1,
      changes: 1,
      sql: sql,
      params: params
    };
  }),

  all: jest.fn().mockImplementation((sql, params, callback) => {
    // Détecter si c'est un appel avec 2 ou 3 paramètres
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }

    // Logique de filtrage
    let results = [...mockTickets];

    // Appliquer les filtres seulement si params existe
    if (params !== undefined) {
      // Si params est un tableau, prendre le premier élément
      const paramValue = Array.isArray(params) ? params[0] : params;

      if (sql.includes('WHERE status = ?')) {
        results = results.filter(t => t.status === paramValue);
      }
      if (sql.includes('WHERE priority = ?')) {
        results = results.filter(t => t.priority === paramValue);
      }
      if (sql.includes('WHERE LOWER(requester) LIKE ?')) {
        const searchTerm = paramValue.replace(/%/g, '').toLowerCase();
        results = results.filter(t => t.requester.toLowerCase().includes(searchTerm));
      }
      if (sql.includes('WHERE LOWER(title) LIKE ?')) {
        const searchTerm = paramValue.replace(/%/g, '').toLowerCase();
        results = results.filter(t => t.title.toLowerCase().includes(searchTerm));
      }
    }

    // Trier selon l'ordre SQL (toujours appliqué)
    if (sql.includes('ORDER BY createdAt ASC')) {
      results = results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sql.includes('ORDER BY createdAt DESC')) {
      results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Appeler le callback
    if (callback) {
      callback(null, results);
    }

    return results;
  }),

  get: jest.fn().mockImplementation((sql, params, callback) => {
    // Détecter si c'est un appel avec 2 ou 3 paramètres
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }

    // Si params est un tableau, prendre le premier élément
    const paramValue = Array.isArray(params) ? params[0] : params;
    const ticket = mockTickets.find(t => t.id === paramValue);

    if (callback) {
      callback(null, ticket || null);
    }

    return ticket || null;
  })
};

// Mock de sqlite3 AVANT l'import des fonctions
jest.mock('sqlite3', () => ({
  verbose: () => ({
    Database: jest.fn().mockImplementation(() => mockDb)
  })
}));

// Import des fonctions APRÈS le mock
const {
  addTicketToDatabase, getAllTicketsASC, getAllTicketsDESC, updateTicket, deleteTicket,
  getTicketByStatus, getTicketByPriority, getTicketByRequester, getTicketByTitle, getTicketById
} = require('../src/fonctionnalitesTickets');

describe('Fonctionnalités Tickets - Tests avec jeu de données complet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addTicketToDatabase', () => {
    test('devrait ajouter un ticket avec succès', async () => {
      const ticket = {
        title: 'Test Ticket',
        description: 'Description du test',
        requester: 'Test User',
        priority: 'haute'
      };

      const result = await addTicketToDatabase(ticket);

      expect(result).toEqual({
        id: 1,
        title: 'Test Ticket',
        description: 'Description du test',
        requester: 'Test User',
        priority: 'haute'
      });
    });

    test('devrait gérer les erreurs de base de données', async () => {
      const ticket = {
        title: 'Test Ticket',
        description: 'Description du test',
        requester: 'Test User',
        priority: 'haute'
      };

      // Temporairement remplacer le mock pour simuler une erreur
      const originalMock = mockDb.run.getMockImplementation();
      mockDb.run.mockImplementation((sql, params, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      await expect(addTicketToDatabase(ticket)).rejects.toThrow('Erreur de base de données');

      // Restaurer le mock original
      mockDb.run.mockImplementation(originalMock);
    });
  });

  describe('getAllTicketsASC', () => {
    test('devrait retourner tous les tickets en ordre croissant', async () => {
      // Act : On appelle la fonction
      const result = await getAllTicketsASC();

      // Vérifier que les tickets sont triés par date croissante
      expect(result).toHaveLength(5);
      expect(result[0].createdAt).toBe('2023-01-01 10:00:00'); // Plus ancien en premier
      expect(result[4].createdAt).toBe('2023-01-05 08:45:00'); // Plus récent en dernier
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM ticket ORDER BY createdAt ASC',
        expect.any(Function)
      );
    });
  });

  describe('getAllTicketsDESC', () => {
    test('devrait retourner tous les tickets en ordre décroissant', async () => {
      const result = await getAllTicketsDESC();

      // Vérifier que les tickets sont triés par date décroissante
      expect(result).toHaveLength(5);
      expect(result[0].createdAt).toBe('2023-01-05 08:45:00'); // Plus récent en premier
      expect(result[4].createdAt).toBe('2023-01-01 10:00:00'); // Plus ancien en dernier
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM ticket ORDER BY createdAt DESC',
        expect.any(Function)
      );
    });
  });

  describe('getTicketByStatus', () => {
    test('devrait retourner seulement les tickets ouverts', async () => {
      // Act
      const result = await getTicketByStatus('open');

      // Assert
      expect(result).toHaveLength(2); // On sait qu'il y a 2 tickets ouverts
      expect(result.every(ticket => ticket.status === 'open')).toBe(true);
    });

    test('devrait retourner seulement les tickets fermés', async () => {
      const result = await getTicketByStatus('closed');

      expect(result).toHaveLength(2);
      expect(result.every(ticket => ticket.status === 'closed')).toBe(true);
    });

    test('devrait retourner les tickets en cours', async () => {
      const result = await getTicketByStatus('in_progress');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Bug dans l\'interface utilisateur');
    });
  });

  describe('getTicketByTitle', () => {
    test('devrait retourner seulement les tickets avec le titre "Problème de connexion réseau"', async () => {
      const result = await getTicketByTitle('Problème de connexion réseau');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Problème de connexion réseau');
    });
  });

  describe('getTicketByPriority', () => {
    test('devrait retourner seulement les tickets haute priorité', async () => {
      const result = await getTicketByPriority('haute');

      expect(result).toHaveLength(2);
      expect(result.every(ticket => ticket.priority === 'haute')).toBe(true);
    });

    test('devrait retourner seulement les tickets moyenne priorité', async () => {
      const result = await getTicketByPriority('moyenne');

      expect(result).toHaveLength(2);
    });

    test('devrait retourner seulement les tickets basse priorité', async () => {
      const result = await getTicketByPriority('basse');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Mise à jour du logiciel');
    });
  });

  describe('getTicketByRequester', () => {
    test('devrait retourner tous les tickets de Jean Dupont', async () => {
      const result = await getTicketByRequester('Jean Dupont');

      expect(result).toHaveLength(2);
      expect(result.every(ticket =>
        ticket.requester.toLowerCase().includes('jean dupont')
      )).toBe(true);
    });

    test('devrait faire une recherche insensible à la casse', async () => {
      const result = await getTicketByRequester('MARIE');

      expect(result).toHaveLength(1);
      expect(result[0].requester).toBe('Marie Martin');
    });
  });

  describe('getTicketById', () => {
    test('devrait retourner le ticket avec l\'ID 3', async () => {
      const result = await getTicketById(3);

      expect(result.title).toBe('Mise à jour du logiciel');
      expect(result.priority).toBe('basse');
    });

    test('devrait retourner null pour un ID inexistant', async () => {
      const result = await getTicketById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateTicket', () => {
    test('devrait mettre à jour le ticket 1 avec succès', async () => {
      const updatedTicket = {
        title: 'Problème de connexion réseau - RÉSOLU',
        description: 'Problème résolu après redémarrage du serveur',
        requester: 'Jean Dupont',
        priority: 'haute',
        status: 'closed'
      };

      const result = await updateTicket(1, updatedTicket);

      expect(result).toEqual({ id: 1, changes: 1 });
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE ticket SET title = ?, description = ?, requester = ?, priority = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [
          'Problème de connexion réseau - RÉSOLU',
          'Problème résolu après redémarrage du serveur',
          'Jean Dupont',
          'haute',
          'closed',
          1
        ],
        expect.any(Function)
      );
    });
  });

  describe('deleteTicket', () => {
    test('devrait supprimer le ticket 5 avec succès', async () => {
      const result = await deleteTicket(5);

      expect(result).toEqual({ id: 5, changes: 1 });
      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM ticket WHERE id = ?',
        [5],
        expect.any(Function)
      );
    });
  });

  describe('Tests de scénarios complexes', () => {
    test('devrait gérer un scénario complet de gestion de ticket', async () => {
      // 1. Créer un nouveau ticket
      const newTicket = {
        title: 'Nouveau problème critique',
        description: 'Système complètement bloqué',
        requester: 'Alice Dubois',
        priority: 'haute'
      };

      const createdTicket = await addTicketToDatabase(newTicket);
      expect(createdTicket.id).toBe(1);

      // 2. Récupérer tous les tickets (incluant le nouveau)
      const allTicketsWithNew = [...mockTickets, { id: 1, ...newTicket, status: 'open' }];

      const allTickets = await getAllTicketsASC();
      expect(allTickets).toHaveLength(5);

      // 3. Filtrer par priorité haute (incluant le nouveau)
      const highPriorityTickets = allTicketsWithNew.filter(ticket => ticket.priority === 'haute');

      const highPriority = await getTicketByPriority('haute');
      expect(highPriority).toHaveLength(2); // 2 tickets haute priorité

      // 4. Mettre à jour le nouveau ticket
      const updateResult = await updateTicket(1, { ...newTicket, status: 'in_progress' });
      expect(updateResult.changes).toBe(1);
    });
  });
});

