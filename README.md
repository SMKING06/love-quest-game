# LOVE QUEST : 月の輝き💍❤️‍🩹

Prototype mobile-first de la surprise d'anniversaire de Mariam.

## Essayer la version de démonstration
Ouvrir le jeu dans un navigateur. Pour afficher les raccourcis d'essai, ajouter `?test=1` à l'adresse.

Le mode test permet d'avancer dans les épreuves, d'ouvrir un cadeau au hasard, d'afficher la fin et de recommencer. Le mode test n'est pas protégé et ne doit pas être considéré comme privé.

## Fonctionnalités jouables
- 15 questions, indices pour la date, progression et sept fragments.
- Photos sélectionnées et prévisualisées localement; elles ne sont ni envoyées ni enregistrées.
- Quatre lettres à ouvrir.
- Puzzle tactile à cases glissantes.
- Illustration de lune téléchargeable comme fond d'écran.
- Séquence de souvenirs de démonstration.
- Ambiance sonore synthétisée, activée uniquement après une interaction.
- Aperçu d'une vidéo choisie sur l'appareil; elle reste locale.
- Progression enregistrée seulement dans le stockage local du navigateur.

## Personnalisation avant diffusion
Les photos, la vraie vidéo, le montage souvenir et les textes personnels définitifs ne sont pas fournis dans le dépôt. Les éléments concernés sont clairement présentés comme des démonstrations ou des aperçus locaux. Remplace-les par les vrais fichiers avant de partager le jeu.

## Tester localement
Ouvrir `index.html` dans un navigateur. Le mode test se lance avec `?test=1`.

## Publication GitHub Pages
Dans le dépôt, ouvrir **Settings → Pages**, choisir **Deploy from a branch**, sélectionner la branche **main** et le dossier **/(root)**, puis enregistrer. Attendre la fin du déploiement pour obtenir le lien. Les nouveaux changements sont déployés après chaque mise à jour de la branche choisie.

## Organisation
- `index.html` : écrans et structure accessible.
- `styles.css` : présentation adaptative mobile et ordinateur.
- `game.js` : questions, progression, cadeaux, aperçu local des médias et mode test.

À la porte d'entrée, la date accepte `25/08`, `2508` et les formats avec l'année.
