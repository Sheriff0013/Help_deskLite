# Tests Automatisés HelpDesk avec Newman

Ce projet inclut une suite complète de tests automatisés utilisant Newman (CLI de Postman) pour tester toutes les fonctionnalités de l'API HelpDesk.

## 📁 Fichiers de Tests

- `HelpDesk_Tests_Corrected.postman_collection.json` - Collection Postman corrigée et complète
- `HelpDesk_Environment.postman_environment.json` - Variables d'environnement
- `data.json` - Données de test existantes du projet
- `run-newman-tests.ps1` - Script PowerShell pour Windows

## 🚀 Installation

1. **Installer Newman globalement :**
   ```bash
   npm install -g newman
   ```

2. **Ou installer les dépendances du projet :**
   ```bash
   npm install
   ```

## 🧪 Exécution des Tests

### Méthode 1 : Scripts npm
```bash
# Tests Newman uniquement
npm run test:newman

# Tests Newman avec délai entre les requêtes
npm run test:newman:watch

# Tous les tests (Jest + Newman)
npm run test:all
```

### Méthode 2 : Scripts shell
```bash
# Linux/Mac
chmod +x run-newman-tests.sh
./run-newman-tests.sh

# Windows PowerShell
.\run-newman-tests.ps1
```

### Méthode 3 : Commande Newman directe
```bash
newman run HelpDesk_Tests_Corrected.postman_collection.json \
    -e HelpDesk_Environment.postman_environment.json \
    -d data.json \
    -r cli,html,json \
    --reporter-html-export reports/newman-report.html \
    --reporter-json-export reports/newman-results.json
```

## 📊 Rapports

Les tests génèrent plusieurs types de rapports :

- **Console** : Résultats en temps réel dans le terminal
- **HTML** : `reports/newman-report.html` - Rapport visuel détaillé
- **JSON** : `reports/newman-results.json` - Données brutes pour intégration

## 🔧 Tests Inclus

### Tests Fonctionnels
1. **Ajouter un ticket** - Création avec validation
2. **Récupérer tous les tickets (ASC)** - Tri par date croissante
3. **Récupérer tous les tickets (DESC)** - Tri par date décroissante
4. **Récupérer un ticket par ID** - Recherche spécifique
5. **Filtrer par statut** - Tickets ouverts/fermés/en cours
6. **Filtrer par priorité** - Haute/moyenne/basse
7. **Filtrer par demandeur** - Recherche par nom
8. **Filtrer par titre** - Recherche par mot-clé
9. **Mettre à jour un ticket** - Modification des données
10. **Supprimer un ticket** - Suppression avec confirmation

### Tests d'Erreur
11. **Test d'erreur** - Validation des données manquantes

## ⚙️ Configuration

### Variables d'Environnement
- `baseUrl` : URL de base de l'API (défaut: http://localhost:3000)
- `createdTicketId` : ID du ticket créé (géré automatiquement)

### Données de Test
Le fichier `data.json` existant contient des exemples de tickets pour tester différentes priorités et statuts. Newman utilise automatiquement ces données pour les tests d'itération.

## 🐛 Résolution de Problèmes

### Erreur "Serveur non accessible"
```bash
# Vérifier que le serveur est démarré
npm start

# Dans un autre terminal, lancer les tests
npm run test:newman
```

### Erreur "Newman non trouvé"
```bash
# Installer Newman globalement
npm install -g newman

# Ou utiliser npx
npx newman run HelpDesk_Tests_Corrected.postman_collection.json
```

### Tests qui échouent
1. Vérifier que la base de données est accessible
2. S'assurer que le serveur répond sur le port 3000
3. Consulter le rapport HTML pour plus de détails

## 📈 Intégration CI/CD

Pour intégrer dans un pipeline CI/CD :

```yaml
# Exemple GitHub Actions
- name: Run Newman Tests
  run: |
    npm install -g newman
    npm run test:newman
  env:
    CI: true
```

## 🔍 Surveillance Continue

Pour surveiller l'API en continu :

```bash
# Tests avec délai de 30 secondes
newman run HelpDesk_Tests_Corrected.postman_collection.json \
    -e HelpDesk_Environment.postman_environment.json \
    --delay-request 30000 \
    --timeout-request 10000
```

## 📝 Personnalisation

### Ajouter de nouveaux tests
1. Ouvrir la collection dans Postman
2. Ajouter une nouvelle requête
3. Configurer les tests dans l'onglet "Tests"
4. Exporter la collection mise à jour

### Modifier les données de test
Éditer le fichier `data.json` avec de nouveaux objets de tickets.

### Ajuster les timeouts
Modifier les paramètres `--timeout-request` et `--delay-request` selon vos besoins.
