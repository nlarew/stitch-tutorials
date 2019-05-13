import React from "react";
import TodoItem from "./TodoItem";
import { useStitchAuth } from "./StitchAuth";
import {app, items} from "../stitch";

const todoReducer = (state, { type, payload }) => {
   switch(type) {
      case "setTodos": {
         return {
            ...state,
            todos: payload.todos || []
         }
      }
      case "addTodo": {
         return {
            ...state,
            todos: state.todos.push(payload)
         }
      }
      case "removeTodo": {
         const removeSpecifiedTodo = todo => todo.id !== payload.id
         return {
           ...state,
           todos: state.todos.filter(removeSpecifiedTodo)
         };
      }
      case "clearTodos": {
         return { ...state, todos: [] }
      }
      case "setTodoStatus": {
         const updateTodoStatus = todo => todo.id !== payload.id
            ? todo
            : { ...todo, status: payload.status }
         return {
            ...state,
            todos: state.todos.map(updateTodoStatus)
         }
      }
      default: {}
   }
}

function useTodoItems(userId) {
   const [state, dispatch] = React.useReducer(todoReducer, { todos: [] });
   
   // Todo Actions
   const loadTodos = async () => {
      const todos = await items.find({}, {limit: 1000}).asArray()
      dispatch({ type: "setTodos", payload: { todos } })
   }
   const addTodo = async (text) => {
      const todo = { text, owner_id: userId }
      const result = await items.insertOne(todo)
      dispatch({ type: "addTodo", payload: { ...todo, _id: result.insertedId } })
   }
   const removeTodo = async (todoId) => {
      await items.deleteOne({ _id: todoId })
      dispatch({ type: "removeTodo", payload: { id: todoId } })
   }
   const clearTodos = async () => {
      await items.deleteMany({});
      dispatch({ type: "clearTodos" })
   }
   const setTodoStatus = async (id, status) => {
      await items.updateOne(
         { _id: id },
         { $set: { checked: status } },
         { returnNewDocument: true }
      )
      dispatch({ type: "setTodoStatus", payload: { id, status } })
   }

   React.useEffect(() => {
      loadTodos()
   }, []);

   return {
      items: state.todos,
      actions: { addTodo, removeTodo, setTodoStatus, clearTodos }
   }
}

function TodoControls(props) {
   const items = props.items || []
   return (
      <div className="controls">
         <input
            type="text"
            className="new-item"
            placeholder="Add a new item and hit <enter>"
            onKeyDown={e => this.addItem(e)}
         />
         {items.filter(x => x.checked).length > 0
            ? <div
               href=""
               className="cleanup-button"
               onClick={() => this.clear()}
            >
               delete selected item(s)
            </div>
            : null}
      </div>
   )
}

function TodoList(props) {
   const { items, actions } = useTodoItems();
   // Calculated Properties
   const hasItems = items.length > 0;
   // Sub-Components
   const EmptyList = () => (
     <li>
       <div className="list-empty-label">No Todo Items :(</div>
     </li>
   );

   return (
     <ul className="items-list">
       {!hasItems ? (
         <EmptyList />
       ) : (
         items.map(item => (
           <TodoItem
             key={item._id.toString()}
             item={item}
             items={this.items}
             onChange={() => this.loadList()}
             onStartChange={() => this.setPending()}
           />
         ))
       )}
     </ul>
   );
}

function TodoApp(props) {
   const { currentUser, actions } = useStitchAuth();
   const todo = useTodoItems(currentUser.id);
   return (
      <div>
         <button onClick={actions.handleLogout}>logout</button>
         <TodoControls />
         <TodoList
            items={todo.items}
         />
      </div>
   )
}

export default TodoApp;
