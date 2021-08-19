import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../components/FormEements/Button';
import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

export default function NavLinks() {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink exact to="/">
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">NEW PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn ? (
        <li>
          <NavLink to="/login">LOGIN</NavLink>
        </li>
      ) : (
        <Button
          onClick={() => {
            auth.logout();
          }}
        >
          LOGOUT
        </Button>
      )}
    </ul>
  );
}
