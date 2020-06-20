import React from 'react';
import { v1 as uuid } from 'uuid';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';
import CardModal from './cardModal';

class Creator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isDownloading: false,
      isModalOpen: false,
      deckId: '5ee8173ff5e32e48a1e6b1e4',
      cards: [],
      editCard: {},
      editCardIndex: -1
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

  updateCards = async (cards, reload = true) => {
    fetch('https://deck-builder-api.herokuapp.com/cards/' + this.state.deckId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.parse(JSON.stringify(cards)).map((c) => {
        delete c.image;
        return c;
      }))
    }).then(() => {
      if (reload) {
        this.getCards();
      } else {
        this.setState({ cards });
      }
    });
  };

  addCard = async (card, additionActions, discard, destroy) => {
    const { cards } = this.state;
    const newCard = {
      ...card,
      actions: {
        ...card.actions, additions: Object.entries(additionActions).reduce((acc, [type, qty]) => {
          if (qty) {
            acc.push({ type, qty });
          }
          return acc;
        }, [])
      }
    };
    if (!discard) {
      newCard.actions.discardQty = 0;
    }
    if (!destroy) {
      newCard.actions.destroyQty = 0;
    }
    this.state.editCardIndex > -1 ? cards.splice(this.state.editCardIndex, 1, newCard) : cards.push(newCard);
    this.updateCards(cards);
  };

  downloadCards = () => {
    this.setState({ isDownloading: true });
    const { cards } = JSON.parse(JSON.stringify(this.state));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(cards.map((c) => {
        delete c.image;
        return c;
      }))
    );
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'deck.json');
    dlAnchorElem.click();
    this.setState({ isDownloading: false });
  };

  exportPDF = () => {
    this.setState({ isDownloading: true });
    fetch(`https://deck-builder-api.herokuapp.com/deck/${ this.state.deckId }/pdf/${ uuid() }`)
      .then(async (response) => {
        const downloadPDF = (data) => {
          const dlAnchorElem = document.createElement('a');
          dlAnchorElem.setAttribute('href', `${ data }`);
          dlAnchorElem.setAttribute('download', 'deck.pdf');
          dlAnchorElem.click();
          this.setState({ isDownloading: false });
        };

        let reader = new FileReader();
        reader.readAsDataURL(await response.blob());
        reader.onloadend = function() {
          let base64data = reader.result;
          downloadPDF(base64data);
        };
      });
  };

  createGame = () => {
    this.setState({ isDownloading: true });
    fetch(`https://deck-builder-api.herokuapp.com/games/create/${ this.state.deckId }`, { method: 'POST' })
      .then(async (response) => {
        const gameId = await response.json();
        console.log(gameId);
        window.location = '/game?id=' + gameId;
      });
  };

  updateQty = (index, value) => {
    const { cards } = this.state;
    const card = cards[index];
    card.qty = value;
    cards.splice(index, 1, card);
    this.updateCards(cards, false);
  };

  removeCard = (index) => {
    const { cards } = this.state;
    cards.splice(index, 1);
    this.updateCards(cards);
  };

  openCardModal = (index = -1) => {
    const { cards } = this.state;
    this.setState({
      isModalOpen: true, editCardIndex: index,
      editCard: index < 0 ? {} : JSON.parse(JSON.stringify(cards[index]))
    });
  };

  fileChange = ({ target }) => {
    const { cards } = this.state;
    let reader = new FileReader();
    const setCards = (c) => this.updateCards(c);
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
    const { isLoading, isDownloading, isModalOpen, editCard, cards } = this.state;
    return (
      <main>
        <h1>Build a Deck</h1>
        <CardModal isOpen={ isModalOpen } card={ editCard } onSave={ this.addCard }
                   onClose={ () => this.setState({ isModalOpen: false }) }/>
        <div className={ 'row' }>
          <Button content={ 'Upload Cards' } onClick={ () => this.fileInputRef.current.click() }/>
          <input ref={ this.fileInputRef } type="file" hidden onChange={ this.fileChange }/>
          <Button onClick={ () => this.openCardModal() }>Add a Card</Button>
          <Button>
            <a href={ `${ process.env.PUBLIC_URL }/deck_template.json` } download={ `deck_template.json` }>
              Download Template</a>
          </Button>
        </div>
        <div style={ {
          display: 'flex', width: '100vw', height: '80vh',
          overflowY: 'scroll', flexWrap: 'wrap', margin: '5px',
          backgroundColor: 'lightgray'
        } }>
          { isLoading ? <p>{ 'LOADING' }</p> : cards.map(
            (card, index) => (
              <div style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
                { card.image ?
                  <img alt={ 'card' } style={ { height: '400px', marginBottom: '10px' } }
                       src={ `data:image/png;base64,${ card.image }` }/> : 'Loading...' }
                <Input label={ 'Qty' } style={ { marginBottom: '3px' } } type={ 'number' } min={ 1 }
                       value={ card.qty || '1' } onChange={ (_, { value }) => this.updateQty(index, value) }/>
                <div className={ 'row' }>
                  <Button onClick={ () => this.openCardModal(index) }>Edit</Button>
                  <Button onClick={ () => this.removeCard(index) }>Remove</Button>
                </div>
              </div>
            )
          ) }
        </div>
        <div className={ 'row' }>
          <Button onClick={ this.exportPDF }>{ isDownloading ? 'Exporting...' : 'Export Cards as PDF' }</Button>
          <Button onClick={ this.downloadCards }>{ isDownloading ? 'Exporting...' : 'Export Cards as JSON' }</Button>
          <Button onClick={ this.createGame }>Play Game!</Button>
        </div>
      </main>
    );
  }
}

export default Creator;
