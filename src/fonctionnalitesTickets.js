const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, 'tickets.db'), (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie');
  }
});
function addTicket(ticket) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ticket (title, description, requester, priority) 
                   VALUES (?, ?, ?, ?)`;

    db.run(sql, [ticketData.title, ticketData.description, ticketData.requester, ticketData.priority],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...ticketData });
        }
      }
    );
  });
}


module.exports = { addTicket };