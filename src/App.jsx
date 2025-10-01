import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // Import Navbar
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection
import PreHome from "./pages/PreHome";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Genre from "./components/Genre";
import AboutUs from "./components/Abouts"; 
import Authors from "./components/Authors";
import UploadBook from "./pages/UploadBooks";// Import Genre page
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileBooks from "./pages/ProfileBooks";
import Favorites from "./pages/Favorites";
import UserSearch from "./pages/UserSearch";
import EditProfile from "./pages/EditProfile";
import BookLibrary from "./components/BookLibrary";
import UserProfile from "./pages/UserProfile";
import ReadLater from "./pages/ReadLater";



const App = () => {
  const { user } = useAuth(); // Get user from AuthContext
  return (
    <>
    <div >
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
        
       
         <Route path="/profile" element={<ProfileBooks />  } />
       <Route path="editProfile" element={user ? <EditProfile /> : <Navigate to="/login" replace />} />
        <Route path="favorites" element={<Favorites/>} />
        <Route path="readLater" elament={<ReadLater/>} />
        
        <Route path="/searchUser" element={<UserSearch />} />
        <Route path="/miniLibrary" element={<BookLibrary />} />
       
        <Route path="/profile/:userId" element={<UserProfile />} />


        <Route path="/" element={<Navigate to="/" replace />} />
        {/* <Route path="/" element={<h1>Welcome to Book Library</h1>} /> */}
      </Routes>
      
    </Router>
    </div>
    </>
  );
};

export default App;
