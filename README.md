# Deck Builder UI

This repo contains a React project, deployed using Vercel, that interacts with a Flask API to facilitate 1) custom card designing and 2) deck building card game playing. The API is in a separate repo here:  https://github.com/lensesrequired/deck-builder-api.

#### Here are some screenshots:

Deck Builder and Card Editor

<img alt="DeckBuilder" src="https://github.com/lensesrequired/deck-builder-api/tree/master/docs/images/DeckBuilder.png" width="450"/><img alt="CardEditor" src="https://github.com/lensesrequired/deck-builder-api/tree/master/docs/images/CardEditor.png" width="450"/>

Settings

<img alt="GameSettings" src="https://github.com/lensesrequired/deck-builder-api/tree/master/docs/images/GameSettings.png" width="450"/><img alt="TurnSettings" src="https://github.com/lensesrequired/deck-builder-api/tree/master/docs/images/TurnSettings.png" width="450"/>

Gameplay

<img alt="Gameplay" src="https://github.com/lensesrequired/deck-builder-api/tree/master/docs/images/Gameplay.png" width="450"/>

### File structure:
- src: holds all of the intereacting stuff
  - index.js: contains the router and root of the app, this is what gets run
  - index.css: contains the styles for the app
  - components: contains the various components/pages of the app. It's separated into the two different parts, card creation/deck building and game play.

# Local Development
The following is what you will need for local development. Alternatively, you can use this app from https://deck-builder-api.herokuapp.com/

## Requirements
- NPM

## Installation 
1) Clone this repository to a local directory on your computer
2) Use npm to install the required packages:  `npm install`

## Usage
To start the app, navigate to the root of the repository folder and run `npm run dev`. This will run a script described in the package.json.
Go to a web browser and go to `localhost:3000`, this will present you with the creation web page and you can explore from there.
