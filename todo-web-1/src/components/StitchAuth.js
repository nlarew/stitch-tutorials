import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { useWhyDidYouUpdate } from "./../utils/useWhyDidYouUpdate";
import {
  app,
  hasLoggedInUser,
  loginAnonymous,
  logoutUser,
  getCurrentUser,
} from "./../stitch";

const StitchAuthContext = React.createContext();
export function useStitchAuth() {
  const context = React.useContext(StitchAuthContext);
  console.log('useStitchAuth', context)
  if (!context) {
    throw new Error(`useStitchAuth must be used within a StitchAuthProvider`);
  }
  return context;
}
export function StitchAuthProvider(props) {
  const [authState, setAuthState] = React.useState({
    isLoggedIn: false,
    currentUser: null,
  });
  useEffect(() => {
    console.log('initializing')
    setAuthState({
      isLoggedIn: hasLoggedInUser(),
      currentUser: getCurrentUser(),
    });
  }, [])
  useWhyDidYouUpdate('StitchAuthProvider', { ...authState })

  // Authentication Actions
  const handleAnonymousLogin = async () => {
    const { isLoggedIn } = authState;
    if (!isLoggedIn) {
      const loggedInUser = await loginAnonymous();
      console.log("onUserLoggedIn", loggedInUser);
      setAuthState({
        ...authState,
        isLoggedIn: true,
        currentUser: loggedInUser
      });
    }
  };
  const handleLogout = async () => {
    const { isLoggedIn, currentUser } = authState;
    if (isLoggedIn) {
      const loggedOutUser = await logoutUser(currentUser);
      console.log("onUserLoggedOut", loggedOutUser);
      setAuthState({
        ...authState,
        isLoggedIn: false,
        currentUser: null
      });
    } else {
      console.log(`can't handleLogout when no user is logged in`)
    }
  };

  // We useMemo to improve performance by eliminating some re-renders
  const authInfo = React.useMemo(() => {
    const { isLoggedIn, currentUser } = authState;
    const value = {
      isLoggedIn,
      currentUser,
      actions: { handleAnonymousLogin, handleLogout }
    };
    console.log("authInfo", value);
    return value;
  }, [authState.isLoggedIn]);
  return (
    <StitchAuthContext.Provider value={authInfo}>
      {props.children}
    </StitchAuthContext.Provider>
  );
}
StitchAuthProvider.propTypes = {
  children: PropTypes.element
};
