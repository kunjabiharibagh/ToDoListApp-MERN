import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Get tasks
  const getTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  // Add task
  const addTask = async () => {
    if (!title) return;
    await axios.post("http://localhost:5000/api/tasks", { title });
    setTitle("");
    getTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    getTasks();
  };

  // Toggle completed
  const toggleCompleted = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      completed: !task.completed,
    });
    getTasks();
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  // Update task
  const updateTask = async () => {
    if (!editingTitle) return;
    await axios.put(`http://localhost:5000/api/tasks/${editingId}`, {
      title: editingTitle,
    });
    setEditingId(null);
    setEditingTitle("");
    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>MERN To-Do App</h1>

      <input
        type="text"
        placeholder="Enter task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ margin: "10px 0" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />
            {editingId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={updateTask}>Save</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    marginLeft: "10px",
                  }}
                >
                  {task.title}
                </span>
                <button style={{ marginLeft: "10px" }} onClick={() => startEditing(task)}>
                  Edit
                </button>
              </>
            )}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;