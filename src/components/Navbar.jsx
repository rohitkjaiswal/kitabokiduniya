import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      background: "#faf3e0",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
    }}>
      <h2 style={{ margin: 0, fontSize: "1.8em", color: "#4b2e83" }}>
        📚 Kitabo ki Duniya <span style={{ fontSize: "1em" }}>– Where books smell like victory</span>
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
            <span>👋 Welcome, <strong>{user.email}</strong></span>
            <a href="/upload" style={{
              textDecoration: "none",
              background: "#7bdff2",
              color: "#000",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "0.3s",
            }}>
              🚀 Upload Book
            </a>
            <button onClick={logout} style={{
              background: "#ff6b6b",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}>
              🔒 Logout
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
