const express = require('express');
const path = require('path');
const { addTicket } = require('./fonctionnalitesTickets');
const router = express.Router();

router.post("/addTicket", (req, res) => {
  res.json({ result: addTicket() })
})

router.get("/formulaire", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/formulaire.html'));
})

router.get("/liste", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/liste.html'));
})

module.exports = router;