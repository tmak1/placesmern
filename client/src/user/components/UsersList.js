import React from 'react';

import UserItem from './UserItem';

import './UsersList.css';

export default function UsersList({ items }) {
  return (
    <ul className="users-list">
      {items &&
        items.length > 0 &&
        items.map(({ userId, name, email, imageUrl }) => (
          <UserItem
            key={userId}
            userId={userId}
            name={name}
            email={email}
            imageUrl={imageUrl}
          />
        ))}
    </ul>
  );
}
