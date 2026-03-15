import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const inputRef = useRef(null);

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = totalTasks - completedCount;

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
    inputRef.current.focus();
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

  // Start editing
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

  // Clear completed
  const clearCompleted = async () => {
    const completed = tasks.filter((task) => task.completed);

    await Promise.all(
      completed.map((task) =>
        axios.delete(`http://localhost:5000/api/tasks/${task._id}`)
      )
    );

    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>MERN To-Do App</h1>

      {/* Input */}
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All ({totalTasks})
        </button>

        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed ({completedCount})
        </button>

        <button
          className={filter === "pending" ? "active-filter" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingCount})
        </button>
      </div>

      {/* Clear Completed */}
      {filter !== "pending" && completedCount > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}

      {/* Task List */}
      <ul>
        {filteredTasks.length === 0 ? (
          <p className="empty-msg">No tasks available</p>
        ) : (
          filteredTasks.slice().reverse().map((task) => (
            <li key={task._id}>
              <div className="task-left">
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

                    <button className="save-btn" onClick={updateTask}>
                      Save
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {task.title}
                  </span>
                )}
              </div>

              <div>
                {editingId !== task._id && (
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;