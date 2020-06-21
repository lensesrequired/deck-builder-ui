import React from 'react';
import { Modal, Form, Button, Step, Icon } from 'semantic-ui-react';
import CardPicker from './cardPicker';

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: {},
      steps: [
        {
          icon: 'user',
          title: 'Players',
          active: true,
          valid: true
        },
        {
          icon: 'map',
          title: 'Marketplace',
          active: false,
          valid: true
        },
        {
          icon: 'trophy',
          title: 'Game Play',
          active: false,
          valid: true
        }
      ],
      game: {
        numPlayers: '2',
        handSize: '5',
        startingDeck: [],
        marketplace: []
      }
    };
  }

  setDeck = (startingDeck, selectedCards, deckName) => {
    const newDeck = startingDeck.reduce((acc, card) => {
      if (selectedCards[card.id] && selectedCards[card.id] !== '0') {
        const newCard = JSON.parse(JSON.stringify(card));
        newCard.qty = selectedCards[card.id];
        acc.push(newCard);
      }
      return acc;
    }, []);

    this.setState({ game: { ...this.state.game, [deckName]: newDeck } });
  };

  onInput = (event, { name, value }) => {
    this.setState({ game: { ...this.state.game, [name]: value } });
  };

  formParts = () => ({
    'Players': <div>
      <Form.Input label='Number of Players' name='numPlayers' value={ this.state.game.numPlayers }
                  onChange={ this.onInput }/>
      <Form.Input label='Default Hand Size' name='handSize' value={ this.state.game.handSize }
                  onChange={ this.onInput }/>
      <Form.Field>
        <label>Starting Deck</label>
        <CardPicker cards={ this.state.deck.cards || [] } deckName={ 'startingDeck' }
                    onSave={ this.setDeck }/>
        Number of Cards: { this.state.game.startingDeck.reduce((acc, card) => (acc + parseInt(card.qty, 10)), 0) }
      </Form.Field>
    </div>,
    'Marketplace': <div>
      <Form.Field><label>Marketplace</label>
        <div><CardPicker cards={ this.state.deck.cards || [] } deckName={ 'marketplace' } onSave={ this.setDeck }/>
          Number of Cards: { this.state.game.marketplace.reduce((acc, card) => (acc + parseInt(card.qty, 10)), 0) }
        </div>
        ))
      </Form.Field>
    </div>,
    'Game Play': <div>
      <Form.Field><label>Turn Actions</label></Form.Field>
      <Form.Field style={ { paddingLeft: '25px' } }>
        <Form.Field>
          <label>Pre</label>
          None
        </Form.Field>
        <Form.Field>
          <label>During</label>
          1 Action, 1 Buy
        </Form.Field>
        <Form.Field>
          <label>Post</label>
          Discard all, Draw starting hand size
        </Form.Field>
      </Form.Field>
      <Form.Field>
        <label>Conditions to end game</label>
        1 Pile empty
      </Form.Field>
      <Form.Group style={ { paddingLeft: '25px' } }>
      </Form.Group>
    </div>
  });

  setActive = (step) => {
    const { steps } = this.state;
    const newSteps = steps.map((s) => {
      s.active = (step.title === s.title);
      return s;
    });
    this.setState({ steps: newSteps });
  };

  getFormPart = () => {
    const { steps } = this.state;
    const activeStep = steps.find((s) => s.active);

    return this.formParts()[activeStep.title];
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.isOpen && !prevProps.isOpen || (prevProps.deck !== this.props.deck)) {
      this.setState({ deck: this.props.deck });
    }
  }

  componentDidMount() {
    this.setState({ deck: this.props.deck });
  }

  render() {
    const { isOpen, saveSettings } = this.props;
    const { steps } = this.state;

    return (
      <Modal as={ Form } open={ isOpen } centered={ false }>
        <Modal.Header>{ 'Game Set-up' }</Modal.Header>
        <Modal.Content>
          <Step.Group size={ 'mini' }>
            { steps.map((step) => (
              <Step active={ step.active } onClick={ () => this.setActive(step) }>
                <Icon name={ step.valid ? 'check' : step.icon }/>
                <Step.Content>
                  <Step.Title>{ step.title }</Step.Title>
                </Step.Content>
              </Step>
            )) }
          </Step.Group>
          { this.getFormPart() }
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={ () => saveSettings(this.state.game) }
                  disabled={ steps.some(({ valid }) => !valid) }>Save</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SettingsModal;
