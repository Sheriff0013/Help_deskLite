/**
 * Configuration globale pour les tests Jest
 * Ce fichier est exécuté avant chaque test
 */

// Configuration des timeouts pour les tests asynchrones
jest.setTimeout(10000); // 10 secondes

// Configuration globale pour les mocks
global.console = {
  ...console,
  // Supprimer les logs pendant les tests pour éviter le bruit
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuration pour les tests de base de données
beforeEach(() => {
  // Nettoyer tous les mocks avant chaque test
  jest.clearAllMocks();
});

afterEach(() => {
  // Nettoyer après chaque test
  jest.clearAllTimers();
});

// Configuration pour les tests d'intégration
if (process.env.NODE_ENV === 'test') {
  // Désactiver les logs de connexion à la base de données pendant les tests
  process.env.SUPPRESS_DB_LOGS = 'true';
}
