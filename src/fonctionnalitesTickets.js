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

function getAllTicketsASC() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket ORDER BY createdAt ASC`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllTicketsDESC() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getTicketByStatus(status) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket WHERE status = ?`;
    db.all(sql, [status], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getTicketByPriority(priority) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket WHERE priority = ?`;
    db.all(sql, [priority], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function updateTicket(id, ticket) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE ticket SET title = ?, description = ?, requester = ?, priority = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [ticket.title, ticket.description, ticket.requester, ticket.priority, ticket.status, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id: id, changes: this.changes });
      }
    });
  });
}

function getTicketByRequester(requester) {

  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket WHERE requester = ?`;
    db.all(sql, [requester], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getTicketByTitle(title) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket WHERE title = ?`;
    db.all(sql, [title], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function deleteTicket(id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ticket WHERE id = ?`;
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id: id, changes: this.changes });
      }
    });
  });
}

module.exports = { addTicket, getAllTicketsASC, getAllTicketsDESC, getTicketByStatus, getTicketByPriority, updateTicket, getTicketByRequester, getTicketByTitle, deleteTicket };