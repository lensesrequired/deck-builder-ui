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
      deck: [],
      images: {}
    };
  }

  getGame = async (getDeck = false) => {
    this.setState({ isLoading: true });
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id)
      .then(async (response) => {
        const game = await response.json();
        if (getDeck) {
          fetch('https://deck-builder-api.herokuapp.com/deck/' + game.deck_id)
            .then(async (response) => {
              const deck = await response.json();
              this.setState({ game, deck, isLoading: false });
            });
        } else {
          this.setState({ game, isLoading: false });
        }
      });
  };

  getCardImages = async () => {
    fetch('https://deck-builder-api.herokuapp.com/deck/images/' + this.state.game.deck_id)
      .then(async (response) => {
        if (this.state.game.deck_id) {
          const card_images = await response.json();
          const images = card_images.reduce((acc, { id, data, modified_at }) => {
            acc[id] = { data, modified_at };
            return acc;
          }, {});
          this.setState({ images });
        }
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
    this.getGame(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.game.deck_id && prevState.game.deck_id !== this.state.game.deck_id) {
      this.getCardImages();
    }
  }

  turn_action = (action) => {
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id + '/player/' + action, { method: 'POST' })
      .then(async (response) => {
        if (await response.json() !== 'OK') {
          console.log('ERROR');
        } else {
          this.getGame();
        }
      });
  };

  card_action = (action, query) => {
    let url = `https://deck-builder-api.herokuapp.com/games/${ this.props.id }/player/card/${ action }`;
    if (query) {
      url += `?${ Object.entries(query).map(([key, value]) => (`${ key }=${ value }`)).join('&') }`;
    }
    fetch(url, { method: 'POST' })
      .then(async (response) => {
        if (await response.json() !== 'OK') {
          console.log('ERROR');
        } else {
          this.getGame();
        }
      });
  };

  getActionButtons = (curr_player) => {
    if (curr_player.current_turn) {
      return <div>
        <div>actions left: { JSON.stringify(curr_player.current_turn) }</div>
        <Button onClick={ () => this.card_action('draw', { 'num': 1 }) }>Draw</Button>
        <Button onClick={ () => this.turn_action('end') }>End Turn</Button>
      </div>;
    }

    return (<Button onClick={ () => this.turn_action('start') }>Start Turn</Button>);
  };

  playCard = (curr_player, index) => {
  };

  render() {
    const { game = {}, deck, images, isLoading } = this.state;
    const curr_player = game.curr_player > -1 ? game.players[game.curr_player] : {};
    return (
      <main>
        { isLoading ? 'LOADING...' : null }
        <SettingsModal isOpen={ deck.cards && (!game.settings || game.curr_player < 0) } deck={ deck }
                       images={ images } saveSettings={ this.saveSettings }/>
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
                { images[card.id] ?
                  <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                       src={ `data:image/png;base64,${ images[card.id].data }` }/> : <div>LOADING...</div> }
                Qty: { card.qty }
                { curr_player.current_turn ?
                  <Button onClick={ () => this.card_action('buy', { index }) }>Buy</Button> :
                  null }
              </div>
            )
          ) }
        </div>

        { curr_player.name ?
          <div>
            <div>{ curr_player.name }'s Hand</div>
            <div>
              Deck: { (curr_player.deck || []).length } Cards
              -
              Discard: { (curr_player.discard || []).length } Cards
            </div>
            <div style={ {
              display: 'flex', width: '100vw', height: '60vh',
              overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
              backgroundColor: 'lightgray'
            } }>
              { curr_player.current_turn && (curr_player.hand || []).map((card, index) => (
                <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                  { images[card.id] ?
                    <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                         src={ `data:image/png;base64,${ images[card.id].data }` }/> : 'LOADING...' }
                  <Button disabled={ card.played } onClick={ () => this.card_action('play', { index }) }>Play</Button>
                  <div className={ 'row' }>
                    <Button onClick={ () => this.card_action('discard', { index }) }>Discard</Button>
                    <Button onClick={ () => this.card_action('destroy', { index }) }>Destroy</Button>
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
