import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <nav className="navbar">
      <div className="logo">🏒 NHL Stats</div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive("/")}>Home</Link>
        </li>
        <li>
          <Link to="/players" className={isActive("/players")}>Players</Link>
        </li>
        <li>
          <Link to="/goalies" className={isActive("/goalies")}>Goalies</Link>
        </li>
        <li>
          <Link to="/teams" className={isActive("/teams")}>Teams</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;