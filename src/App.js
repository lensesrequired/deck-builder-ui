import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      cards: []
    };
    this.fileInputRef = React.createRef();
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

  updateCards = async (cards) => {
    fetch('https://deck-builder-api.herokuapp.com/cards/5ee8173ff5e32e48a1e6b1e4', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cards.map((c) => {
        delete c.image;
        return c;
      }))
    }).then(() => {
      this.getCards();
    });
  };

  updateQty = (index, value) => {
    const { cards } = this.state;
    const card = cards[index];
    card.qty = value;
    cards.splice(index, 1, card);
    this.setState({ cards });
  };

  removeCard = (index) => {
    const { cards } = this.state;
    cards.splice(index, 1);
    this.updateCards(cards);
  };

  fileChange = ({ target }) => {
    const { cards } = this.state;
    let reader = new FileReader();
    const setCards = (c) => {
      this.updateCards(c);
    };
    reader.onload = function onReaderLoad(event) {
      let obj = JSON.parse(event.target.result);
      if (Array.isArray(obj)) {
        setCards([...cards, ...obj]);
      } else {
        // TODO: Show error
      }
    };
    reader.readAsText(target.files[0]);
  };

  componentDidMount(prevProps, prevState, snapshot) {
    this.getCards();
  }

  render() {
    return (
      <main>
        <h1>Build a Deck</h1>
        <Button content={ 'Upload Cards' } onClick={ () => this.fileInputRef.current.click() }/>
        <input
          ref={ this.fileInputRef }
          type="file" hidden
          onChange={ this.fileChange }/>
        <Button onClick={ () => {
          alert('TODO');
        } }>Add a Card</Button>
        <Button><a href={ `${ process.env.PUBLIC_URL }/deck_template.json` } download={ `deck_template.json` }>
          Download Template</a></Button>
        <div style={ {
          display: 'flex', width: '100vw', height: '80vh',
          overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
          backgroundColor: 'lightgray'
        } }>
          { this.state.isLoading ? <p>{ 'LOADING' }</p> : this.state.cards.map(
            (card, index) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                { card.image ?
                  <img alt={ 'card' } style={ { height: '400px', marginBottom: '10px' } }
                       src={ `data:image/png;base64,${ card.image }` }/> :
                  'Loading...' }
                <Input label={ 'Qty' } style={ { marginBottom: '3px' } } type={ 'number' } min={ 1 }
                       value={ card.qty || '1' } onChange={ (_, { value }) => this.updateQty(index, value) }/>
                <Button onClick={ () => this.removeCard(index) }>Remove</Button>
              </div>
            )
          ) }
        </div>
        <Button onClick={ () => {
          alert('TODO');
        } }>Export Cards as PDF</Button>
        <Button onClick={ () => {
          alert('TODO');
        } }>Export Cards as JSON</Button>
        <Button onClick={ () => {
          alert('TODO');
        } }>Play Game!</Button>
      </main>
    );
  }
}

export default App;
