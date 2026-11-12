import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TaskList from "./components/TaskList";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<TaskList key="all" filter="all" title="My Tasks" />} />
          <Route path="/pendingTask" element={<TaskList key="pending" filter="pending" title="Pending Tasks" />} />
          <Route path="/completedTask" element={<TaskList key="completed" filter="completed" title="Completed Tasks" />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;