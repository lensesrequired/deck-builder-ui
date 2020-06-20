import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import SettingsModal from './settingsModal';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      game: {}
    };
  }

  getGame = async () => {
    this.setState({ isLoading: true });
    fetch('https://deck-builder-api.herokuapp.com/games/' + this.props.id)
      .then(async (response) => {
        const game = await response.json();

        this.setState({ game, isLoading: false });
      });
  };

  componentDidMount() {
    this.getGame();
  }

  render() {
    const { game } = this.state;
    return (
      <main>
        <h1>Play a Game</h1>
        <SettingsModal isOpen={ !game.settings || (game.curr_player || -1) < 0 }/>
      </main>
    );
  }
}

export default Game;
