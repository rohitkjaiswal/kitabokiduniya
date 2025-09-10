import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // Import Navbar
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection
import PreHome from "./pages/PreHome";
import 'bootstrap/dist/css/bootstrap.min.css';
import Genre from "./components/Genre";
import AboutUs from "./components/Abouts"; 
import Authors from "./components/Authors";
import UploadBook from "./pages/UploadBooks";// Import Genre page
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileBooks from "./pages/ProfileBooks";
import Favorites from "./pages/Favorites";
import UserSearch from "./pages/UserSearch";
import EditProfile from "./pages/EditProfile";



const App = () => {
  const { user } = useAuth(); // Get user from AuthContext
  return (
    <>
    <div className=" bg-light min-vh-100">
    <Router>
      <Navbar /> {/* Add Navbar here */}
      <Routes>
        <Route path="/" element={<PreHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user" element={
          user? (<h1>Welcome to book library</h1>):(<Navigate to="/login" replace />)
        } />
        <Route path="/genre" element={<Genre />} /> 
        <Route path="/about" element={<AboutUs />} />
        <Route path="/author" element={<Authors />} />
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/profile" element={<ProfileBooks />} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/searchUser" element={<UserSearch />} />
        <Route path="/editProfile" element={user ? <EditProfile /> : <Navigate to="/login" replace />} />


        <Route path="/" element={<Navigate to="/" replace />} />
        {/* <Route path="/" element={<h1>Welcome to Book Library</h1>} /> */}
      </Routes>
    </Router>
    </div>
    </>
  );
};

export default App;
