/** @jsx jsx */
import React, { useState } from "react";
import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import { useStitchAuth } from "./StitchAuth";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import Banner from "./Banner";
import PropTypes from 'prop-types';

const LoginLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "leftMargin content rightMargin";
  grid-template-rows: 120px 1fr;
  grid-template-columns: 1fr 500px 1fr;
  width: 100vw;
  min-height: 100vh;
  background: #5e9668;
`;
const LoginCard = styled(Card)`
  grid-area: ${props => props.gridArea ? props.gridArea : "content"};
`
const layout = {
  banner: css`grid-area: banner;`,
  content: css`grid-area: content;`,
}

export default function Login(props) {
  const { isLoggedIn, actions } = useStitchAuth();
  const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;
  return (
    <ErrorBoundary>
      <LoginLayout>
        <Banner>Stitch Todo Tracker</Banner>
        <LoginCard css={layout.content}>
          <CardBody>
            <ButtonRow>
              <Button onClick={actions.handleAnonymousLogin}>
                Log In as a Guest User
              </Button>
            </ButtonRow>
          </CardBody>
        </LoginCard>
      </LoginLayout>
    </ErrorBoundary>
  );
}
Login.propTypes = {};
