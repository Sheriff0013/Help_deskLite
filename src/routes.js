const express = require('express');
const path = require('path');
const { addTicket, addTicketToDatabase, getAllTicketsASC, getAllTicketsDESC, getTicketByStatus, getTicketByPriority, getTicketByRequester, getTicketByTitle, deleteTicket, updateTicket, getTicketById } = require('./fonctionnalitesTickets');
const router = express.Router();

router.post("/addTicket", async (req, res) => {
  // Accepter les données depuis le body OU les paramètres d'URL
  const ticket = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

  // Validation des données requises
  if (!ticket || !ticket.title || !ticket.description || !ticket.requester) {
    return res.status(400).json({
      success: false,
      error: "Données manquantes. Les champs 'title', 'description', 'requester' et 'priority' sont obligatoires."
    });
  }

  // Validation des types
  if (typeof ticket.title !== 'string' || typeof ticket.description !== 'string' || typeof ticket.requester !== 'string') {
    return res.status(400).json({
      success: false,
      error: "Les champs 'title', 'description', 'requester' et 'priority' doivent être des chaînes de caractères."
    });
  }

  try {
    const result = await addTicketToDatabase(ticket);
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du ticket:', err);
    res.status(400).json({ success: false, error: err.message });
  }
})

router.get("/getAllTicketsASC", (req, res) => {
  getAllTicketsASC()
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.get("/getAllTicketsDESC", (req, res) => {
  getAllTicketsDESC()
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})


router.get("/getTicketByStatus", (req, res) => {
  getTicketByStatus(req.query.status)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})


router.get("/getTicketByPriority", (req, res) => {
  getTicketByPriority(req.query.priority)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.get("/getTicketByRequester", (req, res) => {
  getTicketByRequester(req.query.requester)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.get("/getTicketByTitle", (req, res) => {
  getTicketByTitle(req.query.title)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des tickets:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.get("/getTicketById", (req, res) => {
  getTicketById(req.query.id)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération du ticket:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.delete("/deleteTicket", (req, res) => {
  deleteTicket(req.query.id)
    .then(result => {
      res.json({ success: true, result: result });
    })
    .catch(err => {
      console.error('Erreur lors de la suppression du ticket:', err);
      res.status(400).json({ success: false, error: err.message });
    });
})

router.put("/updateTicket", async (req, res) => {
  const { id, title, description, requester, priority, status } = req.body;

  // Validation des données requises
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "L'ID du ticket est obligatoire."
    });
  }

  if (!title || !description || !requester) {
    return res.status(400).json({
      success: false,
      error: "Les champs 'title', 'description' et 'requester' sont obligatoires."
    });
  }

  // Validation que l'ID est un nombre valide
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: "L'ID du ticket doit être un nombre positif valide."
    });
  }

  try {
    // Vérifier que le ticket existe avant de le modifier
    const existingTicket = await getTicketById(id);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        error: "Ticket non trouvé avec cet ID."
      });
    }

    const ticket = { title, description, requester, priority, status };
    const result = await updateTicket(id, ticket);

    // Vérifier que la mise à jour a bien eu lieu
    if (result.changes === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune modification effectuée. Vérifiez que l'ID existe."
      });
    }

    res.json({ success: true, result: result });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du ticket:', err);
    res.status(400).json({ success: false, error: err.message });
  }
})

router.get("/formulaire", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/formulaire.html'));
})

router.get("/liste", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/liste.html'));
})

module.exports = router;