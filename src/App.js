import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

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
      ],
      images: []
    };
  }

  getCard = (metadata, callback) => {
    return fetch('https://deck-builder-api.herokuapp.com/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata)
    }).then(async (response) => {
      let reader = new FileReader();
      reader.readAsDataURL(await response.blob());
      reader.onloadend = function() {
        let base64data = reader.result;
        callback(base64data);
      };
    });
  };

  getCards = async () => {
    const { cards } = this.state;
    const images = [];
    this.setState({ images });
    await Promise.all(cards.map(async (card) => {
      await this.getCard(card.metadata, (data) => {
        images.push(data);
        this.setState({ images });
      });
    }));
  };

  componentDidMount(prevProps, prevState, snapshot) {
    this.getCards();
  }

  render() {
    return (
      <main>
        <h1>Build a Deck</h1>
        <button>Upload</button>
        <button>Add a Card</button>
        <button>Export Template</button>
        <div style={ {
          display: 'flex',
          width: '100vw',
          height: '70vh',
          backgroundColor: 'lightgray',
          overflowY: 'scroll',
          flexWrap: 'wrap'
        } }>
          { this.state.images.map(
            (image) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                <img alt={ 'card' } style={ { height: '400px', marginBottom: '10px' } } src={ image }/>
                <input type={ 'number' } placeholder={ 'Qty' } min={ 1 }/>
                <button>Remove</button>
              </div>
            )
          ) }
        </div>
        <button>Export Cards as PDF</button>
        <button>Export Cards as JSON</button>
        <button>Play Game!</button>
      </main>
    );
  }
}

export default App;
