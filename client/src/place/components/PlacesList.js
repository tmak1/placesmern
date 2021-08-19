import React from 'react';

import PlaceItem from './PlaceItem';

import './PlaceList.css';

export default function PlacesList({ items, deletePlaceHandler }) {
  return (
    <ul className="places-list">
      {items &&
        items.length > 0 &&
        items.map(
          ({
            placeId,
            title,
            description,
            imageUrl,
            address,
            coordinates,
            creatorId,
          }) => (
            <PlaceItem
              key={placeId}
              placeId={placeId}
              title={title}
              description={description}
              imageUrl={imageUrl}
              address={address}
              coordinates={coordinates}
              creatorId={creatorId}
              onDelete={deletePlaceHandler}
            />
          )
        )}
    </ul>
  );
}
