Le site est composé de 2 pages.
La première est celle de complétion du formulaire de ticket.
Touts les champs sont obligatoires.
Ils comportent : 
   un id numérique qui s'incrémente seul,
   un titre,
   une description,
   le nom du scribe,
   la priorité,
   le statut qui est par défaut 'open',
   la date du post automatiquement créee,
   la date de mise a jour updatedAt automatiquement incrémentée;

et il y a un bouton de validation.

La seconde page permet de visualiser tous les tickets,
de les trier par ordre d'ajout (croissant ou décroissant),
et de les filtrer par auteur, priorité, titre ou statut.
Il est bien-sûr possible de mettre à jour les tickets et de les supprimer.

La base de donnée stoquant les posts est un fichier codé avec SQLite (mimant la base de donnée MYSQL si son volume n'est pas excéssif)
