const express = require('express');
const { addTicket } = require('./fonctionnalitesTickets');
const router = express.Router();

router.post("/addTicket", (req, res) => {
  res.json({ result: addTicket() })
})

module.exports = router;