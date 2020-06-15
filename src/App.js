import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        },
        {
          metadata: {
            'art': 'characters/03.png',
            'name': 'Blind Dude',
            'actions': {
              'additions': [
                {
                  'type': 'Draw',
                  'qty': 1
                }
              ],
              'discardQty': 1,
              'discardRequired': true,
              'destroyQty': 0,
              'destroyRequired': true,
              'buyingPower': 2
            },
            'costBuy': 3,
            'victoryPoints': 1
          }
        }
      ]
    };
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

  componentDidMount(prevProps, prevState, snapshot) {
    this.getCards();
  }

  render() {
    return (
      <main>
        <h1>Build a Deck</h1>
        <Button>Upload</Button>
        <Button>Add a Card</Button>
        <Button>Export Template</Button>
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
        <Button>Export Cards as PDF</Button>
        <Button>Export Cards as JSON</Button>
        <Button>Play Game!</Button>
      </main>
    );
  }
}

export default App;
