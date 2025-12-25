// src/components/DesktopSidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Upload,
  User,
  Search,
  BookOpen,
  LogOut,
  Info,
} from "lucide-react";
import { motion } from "motion/react";

const DesktopSidebar = () => {
  const { user, logout } = useAuth();
 

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="d-none d-lg-flex flex-column vh-100 border-end px-3 py-4"
      style={{
        width: "260px",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#fff",
        zIndex: 1000,
      }}
    >
      {/* Brand */}
      <h3 className="fw-bold mb-4 text-primary">Kitabi</h3>

      {/* Navigation */}
      <nav className="nav flex-column gap-2">
        <SidebarItem to="/" icon={<Home size={20} />} label="Home" />
        <SidebarItem to="/upload" icon={<Upload size={20} />} label="Upload" />
        {/* Pass the logged-in user's ID dynamically */}
        {user && (
        <SidebarItem
          to={`/profile`}
          icon={<User size={20} />}
          label="Profile"
        /> 

         )}  

         <SidebarItem
          to={`/authors`}
          icon={<User size={20} />}
          label="Authors"
        /> 
        
        <SidebarItem
          to="/miniLibrary"
          icon={<BookOpen size={20} />}
          label="Your Library"
        />
      
        <SidebarItem
          to="/searchUser"
          icon={<Search size={20} />}
          label="Search Users"
        />
        <SidebarItem to="/about" icon={<Info size={20} />} label="About" />
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 mt-4"
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </div>
    </motion.aside>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
        isActive ? "bg-primary text-white" : "text-dark hover-bg-light"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default DesktopSidebar;