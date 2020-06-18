import React from 'react';
import { v1 as uuid } from 'uuid';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      deckId: '5ee8173ff5e32e48a1e6b1e4',
      cards: []
    };
  }

  getCards = async () => {
    this.setState({ isLoading: true });
    fetch('https://deck-builder-api.herokuapp.com/deck/5ee8173ff5e32e48a1e6b1e4')
      .then(async (response) => {
        const deck = await response.json();
        const { cards } = deck;

        this.setState({ cards, isLoading: false });
      });
  };

  render() {
    const { isLoading, isDownloading, isModalOpen, editCard, cards } = this.state;
    return (
      <main>
        <h1>Play a Game</h1>
      </main>
    );
  }
}

export default Game;
