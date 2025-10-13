const {
  addTicketToDatabase, getAllTicketsASC, getAllTicketsDESC, updateTicket, deleteTicket,
  getTicketByStatus, getTicketByPriority, getTicketByRequester, getTicketByTitle, getTicketById
} = require('../src/fonctionnalitesTickets');

// Mock de la base de données : fausse BDD
const mockDb = {
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
};
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

jest.mock('sqlite3', () => ({
  verbose: () => ({
    Database: jest.fn().mockImplementation(() => mockDb)
  })
}));

describe('Fonctionnalités Tickets - Tests avec jeu de données complet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTicketsASC', () => {
    test('devrait retourner tous les tickets en ordre croissant', async () => {
      // Arrange : On configure le mock pour retourner notre jeu de données
      mockDb.all.mockImplementation((sql, callback) => {
        callback(null, mockTickets);
      });

      // Act : On appelle la fonction
      const result = await getAllTicketsASC();

      // Assert : On vérifie le résultat
      expect(result).toEqual(mockTickets);
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM ticket ORDER BY createdAt ASC',
        expect.any(Function)
      );
    });
  });

  describe('getAllTicketsDESC', () => {
    test('devrait retourner tous les tickets en ordre décroissant', async () => {
      mockDb.all.mockImplementation((sql, callback) => {
        callback(null, mockTickets);
      });

      const result = await getAllTicketsDESC();

      expect(result).toEqual(mockTickets);
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM ticket ORDER BY createdAt DESC',
        expect.any(Function)
      );
    });
  });
});

describe('getTicketByStatus', () => {
  test('devrait retourner seulement les tickets ouverts', async () => {
    // Arrange : On filtre nos données de test pour simuler la requête
    const openTickets = mockTickets.filter(ticket => ticket.status === 'open');

    mockDb.all.mockImplementation((sql, params, callback) => {
      // On simule que la base retourne seulement les tickets ouverts
      callback(null, openTickets);
    });

    // Act
    const result = await getTicketByStatus('open');

    // Assert
    expect(result).toEqual(openTickets);
    expect(result).toHaveLength(2); // On sait qu'il y a 2 tickets ouverts
    expect(result.every(ticket => ticket.status === 'open')).toBe(true);
  });

  test('devrait retourner seulement les tickets fermés', async () => {
    const closedTickets = mockTickets.filter(ticket => ticket.status === 'closed');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, closedTickets);
    });

    const result = await getTicketByStatus('closed');

    expect(result).toEqual(closedTickets);
    expect(result).toHaveLength(2);
    expect(result.every(ticket => ticket.status === 'closed')).toBe(true);
  });

  test('devrait retourner les tickets en cours', async () => {
    const inProgressTickets = mockTickets.filter(ticket => ticket.status === 'in_progress');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, inProgressTickets);
    });

    const result = await getTicketByStatus('in_progress');

    expect(result).toEqual(inProgressTickets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Bug dans l\'interface utilisateur');
  });
});

describe('getTicketByTitle', () => {
  test('devrait retourner seulement les tickets avec le titre "Problème de connexion réseau"', async () => {
    const openTickets = mockTickets.filter(ticket => ticket.title === 'Problème de connexion réseau');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, openTickets);
    });

    const result = await getTicketByTitle('Problème de connexion réseau');

    expect(result).toEqual(openTickets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Problème de connexion réseau');
  });
});

describe('getTicketByPriority', () => {
  test('devrait retourner seulement les tickets haute priorité', async () => {
    const highPriorityTickets = mockTickets.filter(ticket => ticket.priority === 'haute');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, highPriorityTickets);
    });


    const result = await getTicketByPriority('haute');

    expect(result).toEqual(highPriorityTickets);
    expect(result).toHaveLength(2);
    expect(result.every(ticket => ticket.priority === 'haute')).toBe(true);
  });

  test('devrait retourner seulement les tickets moyenne priorité', async () => {
    const mediumPriorityTickets = mockTickets.filter(ticket => ticket.priority === 'moyenne');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, mediumPriorityTickets);
    });

    const result = await getTicketByPriority('moyenne');

    expect(result).toEqual(mediumPriorityTickets);
    expect(result).toHaveLength(2);
  });

  test('devrait retourner seulement les tickets basse priorité', async () => {
    const lowPriorityTickets = mockTickets.filter(ticket => ticket.priority === 'basse');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, lowPriorityTickets);
    });

    const result = await getTicketByPriority('basse');

    expect(result).toEqual(lowPriorityTickets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Mise à jour du logiciel');
  });
});

describe('getTicketByRequester', () => {
  test('devrait retourner tous les tickets de Jean Dupont', async () => {
    const jeanTickets = mockTickets.filter(ticket =>
      ticket.requester.toLowerCase().includes('jean dupont')
    );

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, jeanTickets);
    });

    const result = await getTicketByRequester('Jean Dupont');

    expect(result).toEqual(jeanTickets);
    expect(result).toHaveLength(2);
    expect(result.every(ticket =>
      ticket.requester.toLowerCase().includes('jean dupont')
    )).toBe(true);
  });

  test('devrait faire une recherche insensible à la casse', async () => {
    const marieTickets = mockTickets.filter(ticket =>
      ticket.requester.toLowerCase().includes('marie')
    );

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, marieTickets);
    });

    const result = await getTicketByRequester('MARIE');

    expect(result).toEqual(marieTickets);
    expect(result).toHaveLength(1);
    expect(result[0].requester).toBe('Marie Martin');
  });
});

describe('getTicketById', () => {
  test('devrait retourner le ticket avec l\'ID 3', async () => {
    const ticket3 = mockTickets.find(ticket => ticket.id === 3);

    mockDb.get.mockImplementation((sql, params, callback) => {
      callback(null, ticket3);
    });

    const result = await getTicketById(3);

    expect(result).toEqual(ticket3);
    expect(result.title).toBe('Mise à jour du logiciel');
    expect(result.priority).toBe('basse');
  });

  test('devrait retourner null pour un ID inexistant', async () => {
    mockDb.get.mockImplementation((sql, params, callback) => {
      callback(null, null);
    });

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

    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
      return { lastID: 1, changes: 1 };
    });

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
    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
      return { lastID: 5, changes: 1 };
    });

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

    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
      return { lastID: 6, changes: 1 };
    });

    const createdTicket = await addTicketToDatabase(newTicket);
    expect(createdTicket.id).toBe(6);

    // 2. Récupérer tous les tickets (incluant le nouveau)
    const allTicketsWithNew = [...mockTickets, { id: 6, ...newTicket, status: 'open' }];

    mockDb.all.mockImplementation((sql, callback) => {
      callback(null, allTicketsWithNew);
    });

    const allTickets = await getAllTicketsASC();
    expect(allTickets).toHaveLength(6);

    // 3. Filtrer par priorité haute (incluant le nouveau)
    const highPriorityTickets = allTicketsWithNew.filter(ticket => ticket.priority === 'haute');

    mockDb.all.mockImplementation((sql, params, callback) => {
      callback(null, highPriorityTickets);
    });

    const highPriority = await getTicketByPriority('haute');
    expect(highPriority).toHaveLength(3); // 2 anciens + 1 nouveau

    // 4. Mettre à jour le nouveau ticket
    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
      return { lastID: 6, changes: 1 };
    });

    const updateResult = await updateTicket(6, { ...newTicket, status: 'in_progress' });
    expect(updateResult.changes).toBe(1);

    //6. Ajouter un ticket incomplet pour un champ puis l'autre
    const NoTitleTicket = {
      title: '',
      description: 'Système complètement bloqué',
      requester: 'Alice Dubois',
      priority: 'haute'
    };
    try {
      const result = await addTicketToDatabase(NoTitleTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('Le champ titre est obligatoire');
    } catch (error) {
      expect(error).toContain('Le champ titre est obligatoire');
    }

    const NoDescriptionTicket = {
      title: 'Nouveau problème critique',
      description: '',
      requester: 'Alice Dubois',
      priority: 'haute'
    };

    try {
      const result = await addTicketToDatabase(NoDescriptionTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('Le champ description est obligatoire');
    } catch (error) {
      expect(error).toContain('Le champ description est obligatoire');
    }

    const NoRequesterTicket = {
      title: 'Nouveau problème critique',
      description: 'Système complètement bloqué',
      requester: '',
      priority: 'haute'
    };
    try {
      const result = await addTicketToDatabase(NoRequesterTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('Le champ requester est obligatoire');
    } catch (error) {
      expect(error).toContain('Le champ requester est obligatoire');
    }
    const NoPriorityTicket = {
      title: 'Nouveau problème critique',
      description: 'Système complètement bloqué',
      requester: 'Alice Dubois',
      priority: ''
    };
    try {
      const result = await addTicketToDatabase(NoPriorityTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('Le champ priority est obligatoire');
    } catch (error) {
      expect(error).toContain('Le champ priority est obligatoire');
    }
    const NothingInTicket = {
      title: '',
      description: '',
      requester: '',
      priority: ''
    };
    try {
      const result = await addTicketToDatabase(NothingInTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('champ titre description requester priority obligatoire');
    } catch (error) {
      expect(error).toContain('champ titre description requester priority obligatoire');
    }
    //7. Ajouter un ticket avec un Id existant
    const ExistingIdTicket = {
      id: 1,
      title: 'Nouveau problème critique',
      description: 'Système complètement bloqué',
      requester: 'Alice Dubois',
      priority: 'haute'
    };
    try {
      const result = await addTicketToDatabase(ExistingIdTicket);
      expect(result).toBe(undefined);
      expect(error).toContain('id existe');
    } catch (error) {
      expect(error).toContain('id existe');
    };
  });
});

