import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Could not reach the backend API.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask({ title, completed: false });
      setTitle("");
      loadTasks();
    } catch (err) {
      setError("Could not add task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      loadTasks();
    } catch (err) {
      setError("Could not update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <form className="task-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
            <span className="actions">
              <button className="btn-toggle" onClick={() => handleToggle(task)}>
                {task.completed ? "Undo" : "Done"}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
