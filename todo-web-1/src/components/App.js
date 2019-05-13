import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import TodoApp from "./TodoListNew";
import Banner from "./Banner";
import Navbar from "./Navbar";
import PropTypes from 'prop-types';

import Login from "./LoginAnon";
import { app, hasLoggedInUser, loginAnonymous, logoutUser } from "./../stitch";
import { useStitchAuth, StitchAuthProvider } from "./StitchAuth";
import { useWhyDidYouUpdate } from "./../utils/useWhyDidYouUpdate";

const AppLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "search list detail";
  grid-template-rows: 140px 1fr;
  grid-template-columns: 5fr 1fr;
  width: 100vw;
  min-height: 100vh;
  background: #5e9668;
`;

function ApplicationContext(props) {
  return <StitchAuthProvider>{props.children}</StitchAuthProvider>;
}
ApplicationContext.propTypes = {
  children: PropTypes.element
};

function AppUI(props) {
  const { isLoggedIn, actions } = useStitchAuth();
  
  return isLoggedIn ? (
    <TodoApp />
  ) : (
    <Login />
  );
}
AppUI.propTypes = {};

export default function App() {
  return (
    <ApplicationContext>
      <AppUI />
    </ApplicationContext>
  );
}
App.propTypes = {
  children: PropTypes.node
};
