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

  startGame = async () => {
    this.setState({ isLoading: true });
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id + '/start', { method: 'POST' })
      .then(async (response) => {
        const game = await response.json();
        this.setState({ game, isLoading: false });
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
      this.startGame();
    }).catch((err) => {
      console.log(err);
    });
  };

  componentDidMount() {
    this.getGame();
  }

  render() {
    const { game = {}, deck, isLoading } = this.state;
    return (
      <main>
        <h1>Play a Game</h1>
        { isLoading ? 'LOADING...' : null }
        <SettingsModal isOpen={ deck.cards && (!game.settings || game.curr_player < 0) } deck={ deck }
                       saveSettings={ this.saveSettings }/>
        <div>Discard: { (game.discard || []).length } Cards - Destroyed: { (game.destroy || []).length } Cards</div>
        <div>Marketplace</div>
        <div style={ {
          display: 'flex', width: '100vw', height: '60vh',
          overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
          backgroundColor: 'lightgray'
        } }>
          { (game.marketplace || []).map(
            (card, index) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                { card.image ?
                  <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                       src={ `data:image/png;base64,${ card.image }` }/> : 'Loading...' }
                Qty: { card.qty }
              </div>
            )
          ) }
        </div>

        <div>Your Hand</div>
        <div style={ {
          display: 'flex', width: '100vw', height: '60vh',
          overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
          backgroundColor: 'lightgray'
        } }>
          { (game.curr_player > -1 ? game.players[game.curr_player].hand : []).map((card) => (
            <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
              <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                   src={ `data:image/png;base64,${ card.image }` }/>
            </div>
          )) }
        </div>
      </main>
    );
  }
}

export default Game;
