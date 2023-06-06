## ProjetEsimedJDC


### Description du projet :
Notre client veut créer un jeu de carte. Le but étant de remplir sa collection de carte au maximum. Pour se faire, un joueur pourra faire combattre ses cartes contre d’autres joueurs. Si la partie est gagnante, alors il gagnera des pièces qui lui permettront d’acheter de nouvelles cartes. A l’inverse, l’utilisateur perdra ses pièces.

Le jeu se termine seulement lorsque l’utilisateur obtient toutes les cartes du jeu.



### Qu’est ce qu’une carte ?

Une carte sera constituée d’un nom, d’une image de créature, d’un type (ex : eau, feu, plante…) et des points de force de la carte.



### se déroule un combat ?

Un combat se déroule entre 2 utilisateurs.

Avant de lancer un combat, l’utilisateur devra choisir 3 cartes de sa collection qui lui permettront de créer son équipe et pourra filtrer ses adversaire avec les succès obtenues.

Une fois que l’utilisateur décide de combattre, un écran d’attente s’affichera le temps qu’un autre utilisateur rejoigne sa session.

Une fois les 2 utilisateurs dans la session, les utilisateurs verront leurs carte face visible mais uniquement la carte actuelle de l’adversaire en face visible.

Si l’adversaire perd contre une carte alors on verra face visible sa carte qui a perdu ainsi que celle qui va la remplacer (la dernière restant caché).

Si la seconde carte de l’adversaire est vaincu, alors toutes les cartes de l’adversaire seront face visible.

Selon la force et le type, une carte aura plus de chance de gagner contre une autre carte.

Exemple : Une carte feu avec 50 de force aura 90% de chances de gagner une carte plante de la même force (Les probabilités seront à équilibré).

Un combat se termine lorsqu’un joueur gagne la partie (match null impossible) :

Un joueur gagne la partie lorsqu’il élimine les 3 cartes de son adversaire et qui lui reste au moins 1 carte.

Si un joueur gagne face a une carte de l’adversaire, cette même carte jouera contre une des 2 cartes restante qu’aura choisis l’adversaire

Inversement, lorsque l’on perd une carte on peut choisir quelle carte jouera contre la carte avec laquelle l’adversaire nous a gagné.

Il sont alors redirigés vers la page de combat avec des pièces en plus (si victoire) ou en moins (si défaite).



### Qu’est ce qu’un succès ?

Au fur et à mesure des parties, un utilisateur peut débloquer des succès.

Par exemple: si un utilisateur gagne 10 partie, il aura le succès débutant avancé

Les succès restent à définir mais ils seront consultable dans la rebrique collection.

Une fois obtenues, ils permettrons de filtrer ses adversaire afin de tomber seulement sur ceux qui auront obtenue le succès.



### Comment évoluer dans le jeu ?

Comme dit précédemment, à l’issue d’un combat un joueur gagne ou perd des pièces. Cette monnaie sera visible dans le header dans tous les menus (hors combat). Lorsque l’on clique dessus, le joueur sera redirigé vers une boutique de cartes. Il pourra alors observer toutes les cartes qui lui manque et les acheter avec cette monnaie en cliquant sur un bouton acheter avec le prix affiché sous chaque cartes suivit d’une validation.



### Comment se déroule les premières parties ?

Le joueur, une fois inscrit aura des pièces offertes afin qu’il puisse s’acheter ses 3 premières cartes.



### Comment sont injecté les données utiles au jeu ?

Les données utiles au jeu (cartes et succès) seront injectés par un script SQL.



### CONTENU DES PAGES :
#### Page d’authentification :
Page de connexion/inscription.

Donnée nécessaire : e-mail et mot de passe. Donnée optionnelle : Une image en avatar.

Une fois connecté, l’utilisateur pourra modifier ses informations personnelles / se déconnecter ou supprimer son compte.

#### Page de collection :
Accessible seulement lorsque l’utilisateur est connecté.

header avec ses pièces, son avatar qui lorsque l’on clique dessus redirige vers ses informations personnelles

Le joueur pourra consulter ses cartes et les trier par nom, type et force.

Le joueur pourra aussi consulter ses succès

#### Page de combat :
Accessible seulement lorsque l’utilisateur est connecté.

Header visible seulement lors de la recherche d’adversaire. une fois dans le combat, le header sera masqué jusqu’à la fin du combat.

Pour pouvoir lancer un combat, le joueur devra sélectionner 3 cartes. Une fois fait, il pourra filtrer ses adversaires en fonction des succès qu’il a obtenu.

Quand le joueur 1 trouve un adversaire, alors ils sont redirigé dans un lobby. Dans se lobby, se déroule un combat. Une fois terminé

#### Page historique des combats :
Accessible seulement lorsque l’utilisateur est connecté.

Header visible

Le joueur pourra consulté l’historique de ses anciennes parties, il pourra alors filtré les parties gagnés/perdus ainsi que la chronologie des combats.

#### Page d’achat :
Accessible seulement lorsque l’utilisateur est connecté.

Le joueur pourra observer toutes les cartes qui lui manque et les acheter avec sa monnaie en cliquant sur un bouton “acheter pour X pièces” affiché sous chaque cartes suivit d’une validation.

Déroulement du jeu :
Lorsqu’un joueur s’inscrit, il recevra des pièces qui lui permettront de s’acheter ses 3 premières cartes. Une fois acheté, il pourra les sélectionner pour lancer un combat.

Pour le moment, il ne pourra donc pas filtré sa recherche de combat puisqu’il n’aura aucun succès. Lorsque le joueur trouve un adversaire, le combat se lance.

La première carte sera sélectionné automatiquement pour jouer contre la première carte de l’adversaire. Le combat se déroule comme dans les règles énoncé plus haut.

Il y a 2 issues possibles au combat :

Soit le joueur gagne et remporte un nombre de pièces (à définir)

Soit le joueur perd et perd un nombre de pièces (0 si le joueur n’a pas de pièces)

Après plusieurs combats, le joueur pourra débloquer des succès qui lui permettront de filtrer ses adversaires.

Après plusieurs victoire, et un nombre important de pièces, le joueur pourra acheter des cartes pour combattre avec.

Le jeu se termine lorsqu’il n’y a plus de cartes à débloquer.


# Commande
Pour lancer le projet : npm run start:dev

Pour la preprod, rentrer les variables d'environnement suivantes (environnement de preprod) :

export SECRET_KEY="YOURSECRETKEYGOESHERE"

export JWT_EXPIRES_IN="1h"

export DB_HOST="postgresdatabase.internal"

export DB_PASSWORD="main"

export DB_USER="main"

export DB_NAME="main"

export DB_DIALECT="postgres"

node index.js