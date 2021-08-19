import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormEements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceItem.css';

export default function PlaceItem({
  placeId,
  title,
  description,
  imageUrl,
  address,
  coordinates,
  creatorId,
  onDelete,
}) {
  const auth = useContext(AuthContext);
  const { isLoading, error, clearError } = useHttpClient();
  const [mapIsOpen, setMapIsOpen] = useState(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);

  const showMapModal = () => {
    setMapIsOpen(true);
  };

  const closeMapModal = () => {
    setMapIsOpen(false);
  };

  const showConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(false);
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Modal
        show={mapIsOpen}
        onCancel={closeMapModal}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapModal}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={confirmDeleteModalIsOpen}
        onCancel={closeConfirmDeleteModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmDeleteModal}>
              CANCEL
            </Button>
            <Button
              danger
              onClick={() => {
                onDelete(placeId);
              }}
            >
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          This will permantly delete <strong>{title}</strong>
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${imageUrl}`}
              alt={title}
            />
          </div>
          <div className="place-item__info">
            <h1>{title}</h1>
            <p>{description}</p>
            <h3>{address}</h3>
          </div>
          <div className="place-item__actions">
            <Button onClick={showMapModal}>VIEW ON MAP</Button>
            {auth.userId === creatorId && (
              <Button inverse to={`/places/${placeId}`}>
                EDIT
              </Button>
            )}
            {auth.userId === creatorId && (
              <Button danger onClick={showConfirmDeleteModal}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
