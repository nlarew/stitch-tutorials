import React from "react";
import { items } from "../stitch";

const todoReducer = (state, { type, payload }) => {
  switch (type) {
    case "setTodos": {
      return {
        ...state,
        todos: payload.todos || []
      };
    }
    case "addTodo": {
      return {
        ...state,
        todos: [...state.todos, payload]
      };
    }
    case "removeTodo": {
      const removeSpecifiedTodo = todo => todo.id !== payload.id;
      return {
        ...state,
        todos: state.todos.filter(removeSpecifiedTodo)
      };
    }
    case "clearCompletedTodos": {
      const isNotCompleted = todo => todo.checked !== true;
      return {
        ...state,
        todos: state.todos.filter(isNotCompleted)
      };
    }
    case "clearTodos": {
      return { ...state, todos: [] };
    }
    case "setTodoStatus": {
      const updateTodoStatus = todo => {
        const isThisTodo = todo._id === payload.id;
        return isThisTodo ? { ...todo, status: payload.status } : todo;
      };
      return {
        ...state,
        todos: state.todos.map(updateTodoStatus)
      };
    }
    case "toggleTodoStatus": {
      const updateStatus = todo => {
        const isThisTodo = todo._id === payload.id;
        return isThisTodo ? { ...todo, checked: !todo.checked } : todo;
      };
      return {
        ...state,
        todos: state.todos.map(updateStatus)
      };
    }
    default: {
      console.error(`Received invalid todo action type: ${type}`);
    }
  }
};

export function useTodoItems(userId) {
  //
  const [state, dispatch] = React.useReducer(todoReducer, { todos: [] });
  // Todo Actions
  const loadTodos = async () => {
    const todos = await items.find({}, { limit: 1000 }).asArray();
    dispatch({ type: "setTodos", payload: { todos } });
  };
  const addTodo = async text => {
    const todo = { text, owner_id: userId };
    const result = await items.insertOne(todo);
    dispatch({ type: "addTodo", payload: { ...todo, _id: result.insertedId } });
  };
  const removeTodo = async todoId => {
    await items.deleteOne({ _id: todoId });
    dispatch({ type: "removeTodo", payload: { id: todoId } });
  };
  const clearTodos = async () => {
    await items.deleteMany({});
    dispatch({ type: "clearTodos" });
  };
  const clearCompletedTodos = async () => {
    await items.deleteMany({ checked: true });
    dispatch({ type: "clearCompletedTodos" });
  };
  const setTodoCompletionStatus = async (todoId, status) => {
    await items.updateOne(
      { _id: todoId },
      { $set: { checked: status } },
      { returnNewDocument: true }
    );
    dispatch({ type: "setTodoStatus", payload: { todoId, status } });
  };
  const toggleTodoStatus = async todoId => {
    const todo = state.todos.find(t => t._id === todoId);
    await items.updateOne(
      { _id: todoId },
      { $set: { checked: !todo.currentStatus } },
      { returnNewDocument: true }
    );
    dispatch({ type: "toggleTodoStatus", payload: { id: todoId } });
  };

  React.useEffect(() => { loadTodos() }, []);
  return {
    items: state.todos,
    actions: {
      addTodo,
      removeTodo,
      setTodoCompletionStatus,
      clearTodos,
      clearCompletedTodos,
      toggleTodoStatus
    }
  };
}
