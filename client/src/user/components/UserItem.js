import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';

import './UserItem.css';

export default function UserItem({ userId, name, email, imageUrl }) {
  return (
    <li className="user-item">
      <>
        <Card className="user-item__content">
          <Link to={`/${userId}/places`}>
            <div className="user-item__image">
              <Avatar
                image={`${process.env.REACT_APP_API_URL}/uploads/${imageUrl}`}
                alt={name}
              />
            </div>
            <div className="user-item__info">
              <h3>{name}</h3>
              <h3>{email}</h3>
            </div>
          </Link>
        </Card>
      </>
    </li>
  );
}
