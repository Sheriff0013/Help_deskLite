#!/usr/bin/env node

/**
 * Script simple pour afficher le contenu de la base de données SQLite dans le terminal
 * Usage: node scripts/show-db.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '..', 'tickets.db');

console.log('🔍 Contenu de la base de données SQLite - HelpDesk Lite');
console.log('═'.repeat(60));

// Connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
  console.log('✅ Connexion à la base de données réussie\n');
});

// Fonction pour exécuter une requête et afficher les résultats
function executeQuery(sql, description) {
  return new Promise((resolve, reject) => {
    console.log(`📋 ${description}`);
    console.log('─'.repeat(40));

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('❌ Erreur:', err.message);
        reject(err);
      } else {
        if (rows.length === 0) {
          console.log('Aucune donnée trouvée.\n');
        } else {
          // Affichage formaté des résultats
          rows.forEach((row, index) => {
            console.log(`\n${index + 1}. Ticket #${row.id}`);
            console.log(`   Titre: ${row.title}`);
            console.log(`   Description: ${row.description}`);
            console.log(`   Demandeur: ${row.requester}`);
            console.log(`   Priorité: ${row.priority || 'Non définie'}`);
            console.log(`   Statut: ${row.status}`);
            console.log(`   Créé le: ${row.createdAt}`);
            console.log(`   Modifié le: ${row.updatedAt}`);
            console.log('─'.repeat(30));
          });
          console.log(`\nTotal: ${rows.length} ticket(s)\n`);
        }
        resolve(rows);
      }
    });
  });
}

// Fonction pour afficher les statistiques
function showStats() {
  return new Promise((resolve) => {
    console.log('📊 Statistiques');
    console.log('─'.repeat(40));

    const queries = [
      { sql: 'SELECT COUNT(*) as total FROM ticket', label: 'Total tickets' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE status = 'open'", label: 'Tickets ouverts' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE status = 'closed'", label: 'Tickets fermés' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE status = 'in_progress'", label: 'Tickets en cours' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE priority = 'haute'", label: 'Priorité haute' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE priority = 'moyenne'", label: 'Priorité moyenne' },
      { sql: "SELECT COUNT(*) as count FROM ticket WHERE priority = 'basse'", label: 'Priorité basse' }
    ];

    let completed = 0;
    queries.forEach(query => {
      db.get(query.sql, [], (err, row) => {
        if (err) {
          console.error(`❌ Erreur pour ${query.label}:`, err.message);
        } else {
          console.log(`${query.label}: ${row.total || row.count}`);
        }

        completed++;
        if (completed === queries.length) {
          console.log('');
          resolve();
        }
      });
    });
  });
}

// Fonction principale
async function main() {
  try {
    // Afficher tous les tickets
    await executeQuery('SELECT * FROM ticket ORDER BY createdAt DESC', 'Tous les tickets');

    // Afficher les statistiques
    await showStats();

    // Afficher les tickets par statut
    await executeQuery("SELECT * FROM ticket WHERE status = 'open'", 'Tickets ouverts');

    // Fermer la connexion
    db.close((err) => {
      if (err) {
        console.error('❌ Erreur lors de la fermeture:', err.message);
      } else {
        console.log('✅ Connexion fermée');
      }
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
main();
