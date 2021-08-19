import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
import UserPlaces from './place/pages/UserPlaces';
import NewPlace from './place/pages/NewPlace';
import UpdatePlace from './place/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { useAuth } from './shared/hooks/useAuth';
import { AuthContext } from './shared/context/auth-context';
import { useHttpClient } from './shared/hooks/useHttpClient';

import './App.css';

function App() {
  const { sendRequest } = useHttpClient();
  const { token, userId, isLoggedIn, login, logout } = useAuth();
  const [googleApiKey, setGoogleApiKey] = useState(null);
  let routes;
  // console.log('APP IS RENDERING!');
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route path="/:uid/places">
          <UserPlaces />
        </Route>
        <Route path="/places/new">
          <NewPlace />
        </Route>
        <Route path="/places/:pid">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route path="/:uid/places">
          <UserPlaces />
        </Route>
        <Route path="/login">
          <Auth />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await sendRequest(
  //         `${process.env.REACT_APP_API_URL}/googleApiKey`
  //       );
  //       // setGoogleApiKey(data.apiKey); //not secure
  //     } catch (error) {}
  //   })();
  // }, [sendRequest]);
  return (
    <div className="App">
      <AuthContext.Provider
        value={{ token, userId, isLoggedIn, login, logout }}
      >
        <Router>
          <Helmet>
            <title>Places</title>
            {/* {googleApiKey && googleApiKey.length > 0 && (
              <script
                src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`}
                async
                defer
              ></script>
            )} */}
            <meta name="description" content="A Places to visit app" />
            <meta name="author" content="Tarik Khan" />
          </Helmet>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
