import React from "react";
import { AuthContextProvider } from "./global-context/firebase-context";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateAccout from "./components/CreateAccout";
import "./App.css";
export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/create_account" element={<CreateAccout />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}
