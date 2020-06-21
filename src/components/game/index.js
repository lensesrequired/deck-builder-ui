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
    settings.marketplace = settings.marketplace.map((card) => {
      delete card.id;
      delete card.image;
      return card;
    });
    settings.startingDeck = settings.startingDeck.map((card) => {
      delete card.id;
      delete card.image;
      return card;
    });
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(async () => {
      this.getGame();
    }).catch((err) => {
      console.log(err);
    });
  };

  componentDidMount() {
    this.getGame();
  }

  render() {
    const { game = {}, deck } = this.state;
    return (
      <main>
        <h1>Play a Game</h1>
        <SettingsModal isOpen={ deck.length && (!game.settings || game.curr_player < 0) } deck={ deck }
                       saveSettings={ this.saveSettings }/>
        <div>Discard: { (game.discard || []).length } Cards</div>
        <div>Destroyed: { (game.destroy || []).length } Cards</div>
        <div>Marketplace</div>
        <div></div>
      </main>
    );
  }
}

export default Game;
