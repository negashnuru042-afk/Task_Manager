import React from 'react'
import { API_URL } from "../config";
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const emptyMessages={
all:"No tsaks yet.",
pending:"All caught up! No pending tasks.",
completed:"No completed tasks yet."
};
const TaskList = ({filter,title}) => {
const[tasks,setTasks]=useState([]);
const[loading,setLoading]=useState(true);
const[error,setError]=useState(null);
const[actionError,setActionError]=useState(null)
const[updatingId,setUpdatingId]=useState(null);
const navigate=useNavigate()
useEffect(()=>{
const fetchTasks=async()=>{
try{
const res= await fetch(`${API_URL}/api/tasks`);
if(!res.ok)throw new Error("Failed to fetch");
setTasks(await res.json());
}catch(err){
setError(err.message)
}finally{
    setLoading(false)
}
};
fetchTasks()
},[])
const toggleCompleted = async (task) => {
  setActionError(null);
  setUpdatingId(task._id);
  try {
    const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (!res.ok) throw new Error(`Update failed (${res.status})`);
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  } catch (err) {
    setActionError(err.message);
  } finally {
    setUpdatingId(null);
  }
};
 if (loading) return <p className="muted">Loading...</p>;
  if (error) return <div className="error">Error: {error}</div>;
  const shown=tasks.filter((task)=>{
if(filter==="pending") return !task.completed;
if(filter==="completed") return task.completed;
return true;
  }).sort((a,b)=>a.completed-b.completed)

  return (
   <div>
      <div className="page-header">
        <h1>{title}</h1>                                {/* <- title prop */}
        <span className="muted">
          {shown.length} {filter === "all" ? "total" : filter}
        </span>
      </div>

      {actionError && <div className="error">{actionError}</div>}

      {shown.length === 0 ? (
        <div className="empty panel">
          <p className="muted">{emptyMessages[filter]}</p>  {/* <- filter picks the message */}
          <button
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/create")}
          >
            Create a task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {shown.map((task) => {
            const status = task.completed ? "completed" : "pending";
            return (
              <div
                key={task._id}
                className={`task-card ${task.completed ? "done" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/tasks/${task._id}`)}
                onKeyDown={(e) => {
                  if (e.target === e.currentTarget && e.key === "Enter") {
                    navigate(`/tasks/${task._id}`);
                  }
                }}
              >
                <div className="task-main">
                  <input
                    type="checkbox"
                    className="task-check"
                    checked={task.completed}
                    disabled={updatingId === task._id}
                    onChange={() => toggleCompleted(task)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`}
                  />
                  <h3>{task.title}</h3>
                </div>
                <span className={`badge ${status}`}>{status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
}
export default TaskList