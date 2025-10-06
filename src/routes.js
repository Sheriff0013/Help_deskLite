const express = require('express');
const path = require('path');
const { addTicket } = require('./fonctionnalitesTickets');
const router = express.Router();

router.post("/addTicket", (req, res) => {
  const ticket = req.body;
  addTicket(ticket)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de l\'ajout du ticket:', err);
      res.status(500).json({ success: false, error: err.message });
    });
})

router.get("/formulaire", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/formulaire.html'));
})

router.get("/liste", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/liste.html'));
})

module.exports = router;