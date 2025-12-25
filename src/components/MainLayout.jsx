// src/layouts/MainLayout.jsx
import DesktopSidebar from "./DesktopSidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="d-flex">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <DesktopSidebar />
      </div>

      {/* Main Area */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: window.innerWidth >= 992 ? "260px" : "0",
          minHeight: "100vh",
        }}
      >
        {/* Mobile Navbar */}
        <div className="d-lg-none">
          <Navbar />
        </div>

        {/* Page Content */}
        <main>
          <Outlet />   {/* 👈 यही child route render करेगा */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;