const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

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
      priority TEXT CHECK (priority IN ('haute', 'moyenne', 'basse')),
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

// Fonction pour insérer directement dans la base (utilisée par les routes)
async function addTicketToDatabase(ticket) {
  const sql = `INSERT INTO ticket (title, description, requester, priority) 
                 VALUES (?, ?, ?, ?)`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(sql, [ticket.title, ticket.description, ticket.requester, ticket.priority],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        }
      );
    });

    return { id: result.lastID, ...ticket };
  } catch (err) {
    throw err;
  }
}

// Fonction avec fetch pour les appels externes
async function addTicket(ticket) {
  try {
    const response = await fetch('http://localhost:3000/api/addTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket)
    });

    const data = await response.json();

    if (data.success && data.result !== undefined) {
      return data.result;
    } else {
      throw new Error(data.error || 'Erreur lors de l\'ajout du ticket');
    }
  } catch (error) {
    throw error;
  }
}

//Tout les tickets en ordre croissant
async function getAllTicketsASC() {
  const sql = `SELECT * FROM ticket ORDER BY createdAt ASC`;
  const allTAsync = promisify(db.all.bind(db));
  const allTickets = await allTAsync(sql);
  return allTickets;
}

//Tout les tickets en ordre décroissant
async function getAllTicketsDESC() {
  const sql = `SELECT * FROM ticket ORDER BY createdAt DESC`;
  const allAsync = promisify(db.all.bind(db));
  const allTickets = await allAsync(sql);
  return allTickets;
}


//Les tickets filtrés par status
async function getTicketByStatus(status) {
  const statusLower = status.toLowerCase();
  const sql = `SELECT * FROM ticket WHERE status = ?`;
  const allAsync = promisify(db.all.bind(db));
  const allTickets = await allAsync(sql, [statusLower]);
  return allTickets;
}


//Les tickets filtrés par priorité
async function getTicketByPriority(priority) {
  const priorityLower = priority.toLowerCase();
  const sql = `SELECT * FROM ticket WHERE priority = ?`;
  const allAsync = promisify(db.all.bind(db));
  const allTickets = await allAsync(sql, [priorityLower]);
  return allTickets;
}

//Les ticket filtrés par requester
async function getTicketByRequester(requester) {
  const requesterLower = requester.toLowerCase();
  const sql = `SELECT * FROM ticket WHERE LOWER(requester) LIKE ?`;
  const allAsync = promisify(db.all.bind(db));
  const allTickets = await allAsync(sql, [`%${requesterLower}%`]);
  return allTickets;
}

//Les tickets filtrés par titre
async function getTicketByTitle(title) {
  const titleLower = title.toLowerCase();
  const sql = `SELECT * FROM ticket WHERE LOWER(title) LIKE ?`;
  const allAsync = promisify(db.all.bind(db));
  const allTickets = await allAsync(sql, [`%${titleLower}%`]);
  return allTickets;
}

//Récupérer un ticket par son ID
async function getTicketById(id) {
  const sql = `SELECT * FROM ticket WHERE id = ?`;
  const getAsync = promisify(db.get.bind(db));
  const ticket = await getAsync(sql, [id]);
  return ticket;
}


//Mettre à jour un ticket
async function updateTicket(id, ticket) {
  const sql = `UPDATE ticket SET title = ?, description = ?, requester = ?, priority = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(sql, [ticket.title, ticket.description, ticket.requester, ticket.priority, ticket.status, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        }
      );
    });

    return { id: id, changes: result.changes };
  } catch (err) {
    throw err;
  }
}



//Supprimer un ticket avec son id
async function deleteTicket(id) {
  const sql = `DELETE FROM ticket WHERE id = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(sql, [id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        }
      );
    });

    return { id: id, changes: result.changes };
  } catch (err) {
    throw err;
  }
}


module.exports = { db, addTicket, addTicketToDatabase, getAllTicketsASC, getAllTicketsDESC, updateTicket, deleteTicket, getTicketByStatus, getTicketByPriority, getTicketByRequester, getTicketByTitle, getTicketById };