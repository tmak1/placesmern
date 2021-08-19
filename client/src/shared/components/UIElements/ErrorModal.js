import React from 'react';

import Modal from './Modal';
import Button from '../FormEements/Button';

import '../../../place/components/PlaceItem.css';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
      footerClass="place-item__modal-actions"
    >
      <div className="center">
        <h3>{props.error}</h3>
      </div>
    </Modal>
  );
};

export default ErrorModal;
