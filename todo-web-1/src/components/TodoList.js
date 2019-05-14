import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import TodoItem from "./TodoItem";

TodoList.propTypes = {
  items: PropTypes.array,
  actions: PropTypes.object
};
export default function TodoList(props) {
  const { items, actions } = props;
  return (
    <ErrorBoundary>
      <List>
        {items.length === 0 ? (
          <NoTodoItems>
            <span role="img" aria-label="celebrate">
              {" "}
              🎉
              {" "}
            </span>
            All done!
            Enjoy your day!
          </NoTodoItems>
        ) : (
          items.map(item => (
            <TodoItem
              key={item._id.toString()}
              item={item}
              toggleStatus={() => actions.toggleTodoStatus(item._id)}
            />
          ))
        )}
      </List>
    </ErrorBoundary>
  );
}
const NoTodoItems = styled.div`
  text-align: center;
  font-size: 2em;
  padding-top: 60px;
  padding-bottom: 60px;
`
const List = styled.ul`
  padding: 0;
  margin-top: 10px;
  width: 450px;
`
