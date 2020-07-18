import React from 'react';
import { Modal, Form, Button, Step, Icon, Table, Input, Dropdown } from 'semantic-ui-react';
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
          valid: () => (this.state.game.numPlayers && this.state.game.numPlayers !== '0' && this.state.game.handSize &&
            this.state.game.handSize !== '0' && this.state.game.startingDeck.length)
        },
        {
          icon: 'map',
          title: 'Marketplace',
          active: false,
          valid: () => (this.state.game.marketplace.length)
        },
        {
          icon: 'trophy',
          title: 'Game Play',
          active: false,
          valid: () => (true)
        }
      ],
      game: {
        numPlayers: '2',
        handSize: '5',
        startingDeck: [],
        marketplace: [],
        turn: {
          pre: {
            'draw': { required: 0 },
            'discard': { required: 0 },
            'destroy': { required: 0 }
          },
          during: {
            'play': { optional: 1, required: 0 },
            'buy': { optional: 1, required: 0 },
            'draw': { optional: 0, required: 0 },
            'discard': { optional: 0, required: 0 },
            'destroy': { optional: 0, required: 0 }
          },
          post: {
            'draw': { required: 5 },
            'discard': { required: -1 },
            'destroy': { required: 0 }
          }
        },
        end_trigger: {}
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

  changeAction = (turn_phase, action_type, action_qty_type, str_value) => {
    const int_value = parseInt(str_value, 10);
    if (!isNaN(int_value) || str_value === '') {
      const game = this.state.game;
      game.turn[turn_phase][action_type][action_qty_type] = isNaN(int_value) ? '' : int_value;
      this.setState({ game });
    }
  };

  actionTable = (turn_phase) => (<Table definition>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell/>
        <Table.HeaderCell>Required</Table.HeaderCell>
        { turn_phase === 'during'
          ? (<Table.HeaderCell>Optional</Table.HeaderCell>)
          : null }
      </Table.Row>
    </Table.Header>
    <Table.Body>
      { Object.entries(this.state.game.turn[turn_phase]).reduce((acc, [action_type, qtys]) => {
        acc.push(<Table.Row>
          <Table.Cell>{ action_type }</Table.Cell>
          <Table.Cell><Input value={ qtys.required } type={ 'number' }
                             onChange={ (event, { value }) => this.changeAction(turn_phase, action_type,
                               'required', value) }/></Table.Cell>
          { turn_phase === 'during'
            ? (<Table.Cell><Input value={ qtys.optional } type={ 'number' }
                                  onChange={ (event, { value }) => this.changeAction(turn_phase, action_type,
                                    'optional', value) }/></Table.Cell>)
            : null }
        </Table.Row>);
        return acc;
      }, []) }
    </Table.Body>
  </Table>);

  formParts = () => ({
    'Players': <div>
      <Form.Input label='Number of Players' name='numPlayers' value={ this.state.game.numPlayers }
                  onChange={ this.onInput }/>
      <Form.Input label='Default Hand Size' name='handSize' value={ this.state.game.handSize }
                  onChange={ this.onInput }/>
      <Form.Field>
        <label>Starting Deck</label>
        <CardPicker cards={ this.state.deck.cards || [] } deckName={ 'startingDeck' } images={ this.props.images }
                    onSave={ this.setDeck }/>
        Number of Cards: { this.state.game.startingDeck.reduce((acc, card) => (acc + parseInt(card.qty, 10)), 0) }
      </Form.Field>
    </div>,
    'Marketplace': <div>
      <Form.Field><label>Marketplace</label>
        <div><CardPicker cards={ this.state.deck.cards || [] } deckName={ 'marketplace' } images={ this.props.images }
                         onSave={ this.setDeck }/>
          Number of Cards: { this.state.game.marketplace.reduce((acc, card) => (acc + parseInt(card.qty, 10)), 0) }
        </div>
      </Form.Field>
    </div>,
    'Game Play': <div>
      <Form.Field><label>Turn Actions (use -1 to signify all cards possible)</label></Form.Field>
      <Form.Field style={ { paddingLeft: '25px' } }>
        <Form.Field>
          <label>Pre</label>
          { this.actionTable('pre') }
        </Form.Field>
        <Form.Field>
          <label>During</label>
          { this.actionTable('during') }
        </Form.Field>
        <Form.Field>
          <label>Post</label>
          { this.actionTable('post') }
        </Form.Field>
      </Form.Field>
      <Form.Field>
        <label>Conditions to end game</label>
        <Dropdown placeholder={ 'Trigger Type' } fluid selection
                  options={ [{ text: 'Turns', value: 'turns' }, { text: 'Empty Piles', value: 'piles' }] }/>
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
              <Step completed={ step.valid() } active={ step.active } onClick={ () => this.setActive(step) }>
                <Icon name={ step.icon }/>
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
                  disabled={ steps.some(({ valid }) => !valid()) }>Save</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SettingsModal;
