import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((uid, tok, tokExp) => {
    const tokenExpire =
      tokExp || new Date(new Date().getTime() + 1000 * 60 * 30);
    setIsLoggedIn(true);
    setUserId(uid);
    setToken(tok);
    setTokenExpirationDate(tokenExpire);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: tok,
        tokenExpirationDate: tokenExpire.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const timeLeft = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, timeLeft);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationDate]);

  useEffect(() => {
    let storedData = localStorage.getItem('userData');
    if (!storedData) {
      return;
    }
    storedData = JSON.parse(storedData);
    if (
      storedData.userId &&
      storedData.token &&
      storedData.tokenExpirationDate &&
      new Date(storedData.tokenExpirationDate) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.tokenExpirationDate)
      );
    }
  }, [login]);

  return { token, userId, isLoggedIn, login, logout };
};
