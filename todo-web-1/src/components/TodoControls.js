import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

TodoControls.propTypes = {
  items: PropTypes.array,
  actions: PropTypes.object
};
export default function TodoControls(props) {
  const { items, actions } = props;
  const [inputText, setInputText] = useState("");
  const hasCheckedItems = items && items.filter(x => x.checked).length > 0;
  const handleInput = e => setInputText(e.target.value);
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      if (inputText) {
        actions.addTodo(inputText);
        setInputText("");
      }
    }
  };
  return (
    <Layout>
      <Input
        type="text"
        placeholder="Add a new item and hit <enter>"
        onChange={handleInput}
        onKeyDown={handleKeyPress}
        value={inputText}
      />
      {hasCheckedItems && (
        <CleanupButton onClick={actions.clearCompletedTodos}>
          Clear Completed
        </CleanupButton>
      )}
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 450px;
`;
const Input = styled.input`
  font-size: 1.8em;
  width: 100%;
  border: 1px solid rgba(0,0,0,0.6);
  padding: 10px;
  border-radius: 0.25rem;
`;
const CleanupButton = styled.button`
  background-color: #f83d0e;
  position: relative;
  border: 1px solid black;
  display: inline-block;
  margin-left: 30px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  :active {
    top: 2px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.19), 0 4px 4px rgba(0, 0, 0, 0.23);
  }
`;
