const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'tickets.db'), (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie');
    // Initialiser la table si elle n'existe pas
    initDatabase();
  }
});

function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ticket (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requester TEXT NOT NULL,
      priority TEXT,
      status TEXT DEFAULT 'open',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table ticket initialisée avec succès');
    }
  });
}

function addTicket(ticket) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ticket (title, description, requester, priority) 
                   VALUES (?, ?, ?, ?)`;

    db.run(sql, [ticket.title, ticket.description, ticket.requester, ticket.priority],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...ticket });
        }
      }
    );
  });
}


module.exports = { addTicket };