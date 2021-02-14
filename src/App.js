import React, { useReducer, useEffect } from "react";

import { authReducer } from "./auth/authReducer";
import { AuthContext } from "./auth/AuthContext";
import { AppRouter } from "./routes/AppRouter";

import "antd/dist/antd.css";

const init = () => {
  return JSON.parse(localStorage.getItem("user")) || { logged: false };
};

const App = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, dispatch }}>
      <AppRouter />
    </AuthContext.Provider>
  );
};

export default App;
