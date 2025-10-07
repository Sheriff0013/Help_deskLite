document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formulaire-ticket');
  const button = document.getElementById('ajouter-ticket');

  button.addEventListener('click', async function (e) {
    e.preventDefault(); // Empêche le rechargement de page

    // Récupérer les données du formulaire
    const formData = {
      title: document.getElementById('titre').value,
      description: document.getElementById('description').value,
      requester: document.getElementById('requester').value,
      priority: document.getElementById('priority').value
    };

    // Validation côté client
    if (!formData.title || !formData.description || !formData.requester) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Envoyer les données au serveur
      const response = await fetch('/api/addTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Ticket ajouté avec succès !');
        form.reset(); // Vider le formulaire
      } else {
        alert('Erreur: ' + result.error);
      }
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
    }
  });
});