import React from 'react';
import { v1 as uuid } from 'uuid';
import SettingsModal from './settingsModal';
import { Button } from 'semantic-ui-react';

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

  startTurn = () => {
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id + '/player/start')
      .then(async (response) => {
        if (await response.json() !== 'OK') {
          console.log('ERROR');
        }
      });
  };

  getActionButtons = (curr_player) => {
    if (curr_player.current_turn) {
      return <div>
        <div>actions left: { JSON.stringify(curr_player.current_turn) }</div>
        <Button>Draw</Button>
        <Button>End Turn</Button>
      </div>;
    }

    return (<Button onClick={ this.startTurn }>Start Turn</Button>);
  };

  buyCard = (curr_player, index) => {
  };

  playCard = (curr_player, index) => {
  };

  render() {
    const { game = {}, deck, isLoading } = this.state;
    const curr_player = game.curr_player > -1 ? game.players[game.curr_player] : null;
    console.log(game);
    return (
      <main>
        <h1>Play a Game</h1>
        { isLoading ? 'LOADING...' : null }
        <SettingsModal isOpen={ deck.cards && (!game.settings || game.curr_player < 0) } deck={ deck }
                       saveSettings={ this.saveSettings }/>
        <div>Destroyed: { (game.destroy || []).length } Cards</div>
        <div>Marketplace</div>
        <div style={ {
          display: 'flex', width: '100vw', height: '60vh',
          overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
          backgroundColor: 'lightgray'
        } }>
          { (game.marketplace || []).map(
            (card, index) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                     onClick={ () => this.buyCard(curr_player, index) }
                     src={ `data:image/png;base64,${ card.image }` }/>
                Qty: { card.qty }
                <Button>Buy</Button>
              </div>
            )
          ) }
        </div>

        { curr_player ?
          <div>
            <div>{ curr_player.name }'s Hand</div>
            <div>Deck: { (curr_player.deck || []).length } Cards</div>
            <div>Discard: { (curr_player.discard || []).length } Cards</div>
            <div style={ {
              display: 'flex', width: '100vw', height: '60vh',
              overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
              backgroundColor: 'lightgray'
            } }>
              { curr_player.current_turn && (curr_player.hand || []).map((card, index) => (
                <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                  <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                       onClick={ () => this.playCard(curr_player, index) }
                       src={ `data:image/png;base64,${ card.image }` }/>
                  <Button disabled={ card.played }>Play</Button>
                  <div className={ 'row' }>
                    <Button>Discard</Button>
                    <Button>Destroy</Button>
                  </div>
                </div>
              )) }
            </div>
            <div className={ 'row' } style={ { marginBottom: '10px' } }>
              { this.getActionButtons(curr_player) }
            </div>
          </div> : null }
      </main>
    );
  }
}

export default Game;
