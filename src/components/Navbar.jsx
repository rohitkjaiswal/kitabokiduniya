import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.module.css";
import { Book } from "lucide-react";
import BookLibrary from "./BookLibrary";
import {easeInOut, motion} from 'motion/react'

const Navbar = () => {
  const { user, logout } = useAuth();
  // const [darkMode, setDarkMode] = useState(false);

  // const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <nav
      className='navbar navbar-expand-lg shadow-sm  px-4 py-3 justify-content-space-between'
     >
      <div className="container " >
        <div>
          <NavLink to="/" className="navbar-brand fw-bold fs-4 text-primary text-decoration-none">
            Kitabi
          </NavLink>
        </div>
        <button
          className="navbar-toggler outline-none justify-content-end"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <div
            className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center me-2"
            style={{ width: "32px", height: "32px", fontSize: "0.9rem" }}
          >
            {user?.displayName?.charAt(0).toUpperCase() || "B"}
          </div>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end outline-none text-decoration-none "
          id="navbarContent"
        >
          <motion.ul initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}} className="navbar-nav align-items-center gap-2 ">
            {/* <li className="nav-item">
              <button
                onClick={toggleDarkMode}
                className="btn btn-sm btn-outline-secondary"
                title="Toggle Dark Mode"
              >
                {darkMode ? "🌞 Light" : "🌙 Dark"}
              </button>
            </li> */}

            {user ? (
              <>
                <motion.li initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}} className="nav-item dropdown justify-content-end">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center text-decoration-none"
                    href="/profile"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
                      style={{
                        width: "32px",
                        height: "32px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.displayName?.charAt(0).toUpperCase() || "B"}
                    </div>
                    {user.displayName || "Bookist"}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end m-4 "
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <NavLink
                        to="/profile"
                        className="dropdown-item text-decoration-none"
                      >
                        👤 Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/upload"
                        className="dropdown-item text-decoration-none"
                      >
                        ⬆️ Upload
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/searchUser"
                        className="dropdown-item text-decoration-none"
                      >
                        🔍 Search Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/miniLibrary"
                        className="dropdown-item text-decoration-none"
                      >
                        📚 Your Library
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/about"
                        className="dropdown-item text-decoration-none"
                      >
                        Know about kitabi
                      </NavLink>
                    </li>



                    <hr />
                    <li>
                      <button
                        onClick={logout}
                        className="dropdown-item text-danger text-decoration-none"
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </motion.li>
              </>
            ) : (
              <>
                <motion.div initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}} className="container d-flex flex-direction-column">
                  <li className="nav-item ">
                    <NavLink
                      to="/login"
                      className="btn btn-sm btn-outline-secondary text-decoration-none m-2"
                    >
                      🔑 Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/register"
                      className="btn btn-sm btn-outline-secondary text-decoration-none m-2"
                    >
                      ✍️ Register
                    </NavLink>
                  </li>
                </motion.div>
              </>
            )}
          </motion.ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
