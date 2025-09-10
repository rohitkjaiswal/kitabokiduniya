import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
    }}>
      <h2 style={{ margin: 0, fontSize: "1.8em", color: "#4b2e83" }}>
        <NavLink to="/" style={{ textDecoration: "none", color: "#4b2e83" }}>  
        📚 Kitabi </NavLink> <span style={{ fontSize: "1em" }}></span>
      </h2>
      
      <div>
        {user ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontSize: "1em",
            color: "#444",
          }}>
            <span> <strong>{user.displayName || "bookist"}</strong></span>
            <NavLink to="/searchUser"  className="btn btn-sm btn-outline-primary ms-1" style={{
              textDecoration: "none"
            }}>
              Search
            </NavLink>
            <a href="/upload" style={{
              textDecoration: "none",
             
             
            }} className="btn btn-sm btn-outline-primary ms-1">
              upload
            </a>

            <NavLink to="/profile" style={{
              textDecoration: "none",
             
             
            }} className="btn btn-sm btn-outline-primary ms-2">
              Profile
            </NavLink>

            <button onClick={logout} className="btn btn-sm btn-outline-danger ms-2">
              Logout
            </button>
          </div>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontSize: "1em",
          }}>
            <a href="/login" style={{
              textDecoration: "none",
              background: "#caffbf",
              color: "#000",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "0.3s",
            }}>
              🔑 Login
            </a>
            <a href="/register" style={{
              textDecoration: "none",
              background: "#ffd6a5",
              color: "#000",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "0.3s",
            }}>
              ✍️ Register
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
