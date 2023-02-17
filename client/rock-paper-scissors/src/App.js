import "./app.css";
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Singup from "./components/Login/Singup";
// import Game from "./components/Game/Game";
// import MainMenu from "./components/pages/MainMenu";

import { SocketProvider } from "./components/context/SocketProvider";
import { AuthContext } from "./components/context/auth-context";
import { useAuth } from "./components/hooks/auth-hook";
import { RoomsProvider } from "./components/context/RoomsProvider";
import useSessionStorage from "./components/hooks/sessionStorage-hook";

const MainMenu = React.lazy(() => import("./components/pages/MainMenu"));

const Game = React.lazy(() => import("./components/Game/Game"));

function App() {
  const { token, userId, login, logout, username, isLoggedIn } = useAuth();

  const [value] = useSessionStorage("userData");
  let routes;
  if (isLoggedIn) {
    routes = (
      <SocketProvider id={username}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="video">
                <div className="video-sub">
                  <Login />
                </div>
              </div>
            }
            exact
          ></Route>
          <Route
            path="/register"
            element={
              <div className="video">
                <div className="video-sub">
                  <Singup />
                </div>
              </div>
            }
          ></Route>
          <Route
            path="/game/:roomId"
            element={
              <RoomsProvider>
                <Game />
              </RoomsProvider>
            }
          ></Route>
          <Route
            path="/mainmenu"
            element={
              <RoomsProvider>
                <MainMenu />
              </RoomsProvider>
            }
          ></Route>
          <Route
            path="*"
            element={
              <div className="video">
                <div className="video-sub">
                  <Login />
                </div>
              </div>
            }
          ></Route>
        </Routes>
      </SocketProvider>
    );
  } else {
    routes = (
      <Routes>
        <Route
          path="/"
          element={
            <div className="video">
              <div className="video-sub">
                <Login />
              </div>
            </div>
          }
          exact
        ></Route>
        <Route
          path="/register"
          element={
            <div className="video">
              <div className="video-sub">
                <Singup />
              </div>
            </div>
          }
        ></Route>
        <Route path="/game" element={<Game />}></Route>
        <Route
          path="/mainmenu"
          element={
            <RoomsProvider>
              <MainMenu />
            </RoomsProvider>
          }
        ></Route>
        <Route
          path="*"
          element={
            <div className="video">
              <div className="video-sub">
                <Login />
              </div>
            </div>
          }
        ></Route>
      </Routes>
    );
  }

  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          username: username,
          login: login,
          logout: logout,
        }}
      >
        <Suspense fallback={<div>Loading, wait a bit</div>}>{routes}</Suspense>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;
