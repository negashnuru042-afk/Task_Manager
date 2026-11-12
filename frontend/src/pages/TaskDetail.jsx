
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks/${id}`);
        if (!res.ok) throw new Error("Task not found");
        setTask(await res.json());
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTask();
  }, [id]);


  // One helper for every PATCH, so toggling and renaming share the same code
  const updateTask = async (changes) => {
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      setTask(await res.json());
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    }
  };
  const toggleCompleted = () => updateTask({ completed: !task.completed });

  const startEditing = () => {
    setNewTitle(task.title); // start the input with the current title
    setActionError(null);
    setIsEditing(true);
  };

  const saveTitle = async (e) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setActionError("Title can't be empty");
      return;
    }
    if (trimmed === task.title) {
      setIsEditing(false); // nothing changed, skip the request
      return;
    }
    const ok = await updateTask({ title: trimmed });
    if (ok) setIsEditing(false);
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) navigate("/");
  };

  if (error) return <div className="error">Error: {error}</div>;
  if (!task) return <p className="muted">Loading...</p>;

  const status = task.completed ? "completed" : "pending";

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate("/")}>
        ← Back to tasks
      </button>
      <div className="panel">
        {isEditing ? (
          <form onSubmit={saveTitle}>
            <div className="form-group">
              <label htmlFor="title">Task title</label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>
            {actionError && <div className="error">{actionError}</div>}
            <div className="actions" style={{ marginTop: 0 }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="page-header" style={{ marginBottom: "0.75rem" }}>
              <h1>{task.title}</h1>
              <span className={`badge ${status}`}>{status}</span>
            </div>
            <p className="muted">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </p>

            {actionError && (
              <div className="error" style={{ marginTop: "1rem" }}>{actionError}</div>
            )}

            <div className="actions">
              <button
                className={`btn ${task.completed ? "btn-primary" : "btn-success"}`}
                onClick={toggleCompleted}
              >
                {task.completed ? "Mark as Pending" : "Mark as Completed"}
              </button>
              <button className="btn btn-primary" onClick={startEditing}>
                Edit Title
              </button>
              <button className="btn btn-danger" onClick={deleteTask}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskDetail;