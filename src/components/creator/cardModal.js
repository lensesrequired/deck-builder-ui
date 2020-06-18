import React from 'react';
import { Modal, Form, Input, Button } from 'semantic-ui-react';
import ArtModal from './artModal';

const DEFAULT_CARD = {
  'qty': 0,
  'art': '',
  'name': '',
  'actions': {
    'discardQty': 0,
    'discardRequired': false,
    'destroyQty': 0,
    'destroyRequired': false,
    'buyingPower': 0
  },
  'costBuy': 0,
  'victoryPoints': 0
};

class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      discard: false,
      destroy: false,
      additions: {
        Draw: 0,
        Action: 0,
        Buy: 0
      },
      card: JSON.parse(JSON.stringify(DEFAULT_CARD))
    };
  }

  selectArt = (photoType, artName) => {
    this.setState({ card: { ...this.state.card, art: `${ photoType }/${ artName }` } });
  };

  onInput = (event, { name, value }) => {
    this.setState({ card: { ...this.state.card, [name]: value } });
  };

  onActionChange = (event, { name, value }) => {
    this.setState({ card: { ...this.state.card, actions: { ...this.state.card.actions, [name]: value } } });
  };

  onAdditionChange = (event, { name, value }) => {
    this.setState({ additions: { ...this.state.additions, [name]: value } });
  };

  flipAction = (event, data) => {
    this.setState({
      [data.name]: !this.state[data.name]
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.isOpen && !prevProps.isOpen) {
      const { card } = this.props;
      const editMode = !!card.name;
      this.setState({
        card: editMode ? card : JSON.parse(JSON.stringify(DEFAULT_CARD)), editMode,
        additions: editMode ? card.actions.additions.reduce((acc, addition) => {
          acc[addition.type] = addition.qty;
          return acc;
        }, {}) : {}
      });
    }
  }

  render() {
    const { isOpen, onClose, onSave } = this.props;
    const { editMode, destroy, discard, card, additions } = this.state;

    return (
      <Modal as={ Form } open={ isOpen } onClose={ onClose } centered={ false }>
        <Modal.Header>{ editMode ? 'Edit Card' : 'Add Card' }</Modal.Header>
        <Modal.Content image>
          <ArtModal art={ card.art } select={ this.selectArt }/>
          <Modal.Description>
            <Form.Group>
              <Form.Input label={ 'Name' } name={ 'name' } onChange={ this.onInput }/>
              <Form.Input label={ 'Qty' } name={ 'qty' } type={ 'number' } onChange={ this.onInput }/>
            </Form.Group>
            <Form.Group>
              <Form.Input label={ 'Cost' } name={ 'costBuy' } type={ 'number' } onChange={ this.onInput }/>
              <Form.Input label={ 'Points' } name={ 'victoryPoints' } type={ 'number' } onChange={ this.onInput }/>
            </Form.Group>
            <Form.Field>
              <label>Actions</label>
              <Form.Field style={ { paddingLeft: '25px' } }>
                <label>Additions</label>
                <Input label={ 'Draws' } type={ 'number' } name={ 'Draw' } value={ additions.Draw || '0' }
                       style={ { padding: '5px 0' } } onChange={ this.onAdditionChange }/>
                <Input label={ 'Actions' } type={ 'number' } name={ 'Action' } value={ additions.Action || '0' }
                       style={ { padding: '5px 0' } } onChange={ this.onAdditionChange }/>
                <Input label={ 'Buys' } type={ 'number' } name={ 'Buy' } value={ additions.Buy || '0' }
                       style={ { padding: '5px 0' } } onChange={ this.onAdditionChange }/>
              </Form.Field>
              <Form.Checkbox label={ 'Discard Action' } name={ 'discard' } onChange={ this.flipAction }/>
              { discard ?
                <Form.Group>
                  <Input label={ 'Qty' } type={ 'number' } name={ 'discardQty' } onChange={ this.onActionChange }/>
                  <Form.Checkbox label={ 'Require' }
                                 onChange={ () => this.onActionChange(null,
                                   { name: 'discardRequired', value: card.actions.discardRequired }) }/>
                </Form.Group> : null }
              <Form.Checkbox label={ 'Destroy Action' } name={ 'destroy' } onChange={ this.flipAction }/>
              { destroy ?
                <Form.Group>
                  <Input label={ 'Qty' } type={ 'number' } name={ 'destroyQty' } onChange={ this.onActionChange }/>
                  <Form.Checkbox label={ 'Require' }
                                 onChange={ () => this.onActionChange(null,
                                   { name: 'destroyRequired', value: card.actions.destroyRequired }) }/>
                </Form.Group> : null }
              <Form.Input label={ 'Buying Power' } name={ 'buyingPower' } type={ 'number' }
                          onChange={ this.onActionChange }/>
            </Form.Field>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' onClick={ onClose }>Cancel</Button>
          <Button color='green' onClick={ () => onSave(card, additions) }>Save</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardModal;
