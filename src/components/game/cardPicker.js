import React from 'react';
import { Modal, Form, Button, Input } from 'semantic-ui-react';

class CardPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCards: {}
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.isOpen && !prevProps.isOpen) {
    }
  }

  selectCard = (cardId, qty) => {
    const { selectedCards } = this.state;
    selectedCards[cardId] = qty;
    this.setState({ selectedCards });
  };

  render() {
    const { selectedCards } = this.state;
    const { onSave, cards = [], deckName, deckIndex } = this.props;
    return (
      <Modal as={ Form } trigger={ <Button>Select Cards</Button> } centered={ false }>
        <Modal.Header>{ 'Select Cards' }</Modal.Header>
        <Modal.Content>
          { cards.map((card) => (
            <div>
              <img alt={ 'card' } style={ { height: '250px', marginBottom: '10px' } }
                   src={ `data:image/png;base64,${ card.image }` }/>
              <div><Input type="number" label='Qty' value={ selectedCards[card.id] || '' }
                          onChange={ (_, { value }) => this.selectCard(card.id, value) }/>
              </div>
            </div>
          )) }
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={ () => onSave(cards, selectedCards, deckName, deckIndex) }>Save</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardPicker;
