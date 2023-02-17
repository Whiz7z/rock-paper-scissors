import { useState, useCallback, useEffect } from "react";

import { useNavigate } from "react-router";

let logoutTimer;

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((id, token, name, expirationDate) => {
    setIsLoggedIn(true);
    setUserId(id);
    setToken(token);
    setUsername(name);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 3000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        userId: id,
        username: name,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setUsername(null);

    sessionStorage.removeItem("userData");
  }, []);

  // useEffect(() => {
  //   if (username === null) {
  //     navigate("/");
  //   }
  // }, [username, navigate]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.username,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
    username,
    isLoggedIn,
  };
};
