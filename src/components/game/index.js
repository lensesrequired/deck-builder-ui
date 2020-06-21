import React from 'react';
import { v1 as uuid } from 'uuid';
import SettingsModal from './settingsModal';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      game: {},
      deck: {}
    };
  }

  getGame = async () => {
    this.setState({ isLoading: true });
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id)
      .then(async (response) => {
        const game = await response.json();
        fetch('https://deck-builder-api.herokuapp.com/deck/' + game.deck_id)
          .then(async (response) => {
            const deck = await response.json();
            deck.cards.forEach((card) => {
              card.id = uuid();
            });

            this.setState({ game, deck, isLoading: false });
          });
      });
  };

  saveSettings = (settings) => {
    settings.marketplace = settings.marketplace.map((deck) => (deck.map((card) => {
      delete card.id;
      delete card.image;
      return card;
    })));
    settings.startingDeck = settings.startingDeck.map((card) => {
      delete card.id;
      delete card.image;
      return card;
    });
    fetch('https://deck-builder-api.herokuapp.com/deck/' + this.props.id, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.parse(settings))
    })
      .then(async () => {
        this.getGame();
      });
  };

  componentDidMount() {
    this.getGame();
  }

  render() {
    const { game, deck } = this.state;
    return (
      <main>
        <h1>Play a Game</h1>
        <SettingsModal isOpen={ !game.settings || (game.curr_player || -1) < 0 } deck={ deck }
                       saveSettings={ this.saveSettings }/>
      </main>
    );
  }
}

export default Game;
