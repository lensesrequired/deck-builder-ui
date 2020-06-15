import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: []
    };
    this.fileInputRef = React.createRef();
  }

  getCard = (metadata, callback) => {
    return new Promise((resolve => {
      fetch('https://deck-builder-api.herokuapp.com/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      }).then(async (response) => {
        let reader = new FileReader();
        reader.readAsDataURL(await response.blob());
        reader.onloadend = function() {
          let base64data = reader.result;
          resolve(callback(base64data));
        };
      });
    }));
  };

  getCards = async () => {
    let { cards } = this.state;
    cards = await Promise.all(cards.map(async (card, index) => {
      return new Promise(async resolve => {
        if (!card.image) {
          await this.getCard(card.metadata, (data) => {
            card.image = data;
          });
        }
        return resolve(card);
      });
    }));
    this.setState({ cards });
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
    this.setState({ cards });
  };

  fileChange = ({ target }) => {
    const cards = JSON.parse(JSON.stringify(this.state.cards));
    let reader = new FileReader();
    const setCards = (c) => {
      this.setState({ cards: c });
    };
    reader.onload = function onReaderLoad(event) {
      let obj = JSON.parse(event.target.result);
      if (Array.isArray(obj)) {
        obj.forEach((card) => {
          // TODO: validate card
          cards.push({ metadata: card });
        });
        setCards(cards);
      } else {
        // TODO: Show error
      }
    };
    reader.readAsText(target.files[0]);
  };

  componentDidMount(prevProps, prevState, snapshot) {
    this.getCards();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevState.cards) !== JSON.stringify(this.state.cards)) {
      this.getCards();
    }
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
          display: 'flex',
          width: '100vw',
          height: '80vh',
          margin: '5px',
          backgroundColor: 'lightgray',
          overflowY: 'scroll',
          flexWrap: 'wrap'
        } }>
          { this.state.cards.map(
            (card, index) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                { card.image ?
                  <img alt={ 'card' } style={ { height: '400px', marginBottom: '10px' } } src={ card.image }/> :
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
