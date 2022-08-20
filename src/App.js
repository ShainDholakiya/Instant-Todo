import { useEffect, useState } from "react";
import { useInit, useQuery, tx, transact, id, auth } from "@instantdb/react";
import Login from "./components/Login";
import "./App.css";

const APP_ID = "933ee840-b985-417a-9765-d549e04197c8";

function App() {
  const [isLoading, error, auth] = useInit({
    appId: APP_ID,
    websocketURI: "wss://instant-server.herokuapp.com/api",
    apiURI: "https://instant-server.herokuapp.com/api",
  });
  if (isLoading) {
    return <div>...</div>;
  }
  if (error) {
    return <div>Oi! {error?.message}</div>;
  }
  if (!auth) {
    return <Login />;
  }
  return <Main />;
}

function Main() {
  const data = useQuery({ goals: { todos: {} } });
  const [goals, setGoals] = useState();
  const [goal, setGoal] = useState("");
  const [todo, setTodo] = useState("");
  const [selectedGoal, setSelectedGoal] = useState();
  
  console.log(data);

  useEffect(() => {
    setGoals(data.goals);
  }, [data]);

  useEffect(() => {
    if (data.goals.length > 0) {
      setSelectedGoal(0);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    transact([tx.goals[id()].update({ title: goal })]);
  };

  const handleTodoSubmit = (event) => {
    event.preventDefault();
    const todoId = id();
    transact([tx.todos[todoId].update({ title: todo }),tx.goals[goals[selectedGoal].id].link({ todos: todoId })]);
  };

  return (
    <div style={{textAlign: "center"}}><h1>My Goalz</h1>
    <div
      style={{
        backgroundColor: "#E4E7EB",
        padding: "2rem",
        display: "flex",
        height: "100vh"
      }}
    >
      <div
        style={{
          height: "72vh",
          overflowY: "auto",
          backgroundColor: "white",
          padding: "2rem",
          marginRight: "6rem",
          borderRadius: "10px",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
      >
        {goals && goals.map((goal, index) => (
            <button key={goal.id} onClick={() => setSelectedGoal(index)} style={{ cursor: "pointer", display: "block", borderRadius: "10px", marginBottom: "0.5rem", padding: "0.75rem", textAlign: "left", width: "100%", backgroundColor: "white", border: "none", display: "flex", justifyContent: "space-between", backgroundColor: `${selectedGoal === index ? "#E4E7EB" : "white"}`}}>{goal.title} <span style={{color: "#929292"}}>{goal.todos.length}</span></button>
        ))}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{marginRight: "10px"}}
          />
          <input type="submit" value="Add Goal" />
        </form>
      </div>
      <div style={{}}>
      <h2 style={{textAlign: "left"}}>{goals && goals[selectedGoal]?.title}</h2>
      {goals && goals[selectedGoal]?.todos.map((todo) => (
          <div style={{marginBottom: "1rem", padding: "0.5rem", backgroundColor: "white",  width: "400px", borderRadius: "10px"}}>
            <p key={todo.id} style={{ textAlign: "left"}}>{todo.title}</p>
          </div>
        ))}
        <form onSubmit={handleTodoSubmit} style={{textAlign: "left"}}>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            style={{marginRight: "10px"}}
          />
          <input type="submit" value="Add Todo" />
        </form>
      </div>
    </div>
    </div>
  );
}

export default App;
