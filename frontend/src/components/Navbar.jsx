// components/Navbar.jsx
import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="brand">✔ TaskManager</span>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/create" className={linkClass}>Create Task</NavLink>
            <NavLink to="/completedTask" className={linkClass}>Completed Task</NavLink>
            <NavLink to="/pendingTask" className={linkClass}>Pending Task</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;