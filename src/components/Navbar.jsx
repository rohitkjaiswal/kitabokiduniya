import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <nav
        className="d-flex align-items-center justify-content-between px-4 py-2 fixed-top "
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          zIndex: 1000,
          textDecoration: "none",
        }}
      >
        <NavLink
          to="/"
          className="fw-bold fs-4 text-decoration-none"
          style={{ color: "#1e293b" }}
        >
          Kitabi
        </NavLink>

        <button
          className="btn border-0"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <div
            style={{
              width: 28,
              height: 2,
              background: "#1e293b",
              marginBottom: 6,
              transition: "0.3s",
              transform: open ? "rotate(45deg) translateY(8px)" : "none",
            }}
          />
          <div
            style={{
              width: 28,
              height: 2,
              background: "#1e293b",
              transition: "0.3s",
              opacity: open ? 0 : 1,
            }}
          />
          <div
            style={{
              width: 28,
              height: 2,
              background: "#1e293b",
              marginTop: 6,
              transition: "0.3s",
              transform: open ? "rotate(-45deg) translateY(-8px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Overlay menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
          }}
        >
          <ul className="list-unstyled text-center fs-5 fw-medium">
            <li className="mb-3">
              <NavLink to="/upload" className="nav-link custom-link text-decoration-none">
                Upload Book
              </NavLink>
            </li>
            <li className="mb-3">
              <NavLink to="/miniLibrary" className="nav-link custom-link text-decoration-none">
                My Library
              </NavLink>
            </li>
            <li className="mb-3">
              <NavLink to="/searchUser" className="nav-link custom-link text-decoration-none">
                Find Readers
              </NavLink>
            </li>
            <li className="mb-3">
              <NavLink to="/about" className="nav-link custom-link text-decoration-none">
                About Kitabi
              </NavLink>
            </li>
            {user && (
              <li className="mb-3">
                <NavLink to="/profile" className="nav-link custom-link text-decoration-none">
                  Profile
                </NavLink>
              </li>
            )}
            {user ? (
              <li>
                <button
                  onClick={logout}
                  className="btn btn-outline-dark px-4 py-2"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="mb-2">
                  <NavLink to="/login" className="btn btn-outline-dark px-4 py-2">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="btn btn-dark px-4 py-2">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}

      {/* Hover effect styling */}
      <style>
        {`
          .custom-link {
            color: #1e293b;
            text-decoration: none;
            position: relative;
            transition: all 0.3s ease;
          }
          .custom-link::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 0%;
            height: 2px;
            background: #1e293b;
            transition: width 0.3s ease;
          }
          .custom-link:hover::after {
            width: 100%;
          }
          .custom-link:hover {
            transform: translateX(4px);
          }
        `}
      </style>
    </>
  );
};

export default Navbar;