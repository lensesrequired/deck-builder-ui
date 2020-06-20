import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';

const DEFAULT_SETUP = {
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

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.isOpen && !prevProps.isOpen) {
    }
  }

  render() {
    const { isOpen } = this.props;

    return (
      <Modal as={ Form } open={ isOpen } centered={ false }>
        <Modal.Header>{ 'Game Set-up' }</Modal.Header>
        <Modal.Content>
          <Form.Input label={ 'Number of Players' }/>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green'>Save</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SettingsModal;
