import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import MainLayout from "./components/MainLayout";

// Pages
import PreHome from "./pages/PreHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UploadBook from "./pages/UploadBooks";
import ProfileBooks from "./pages/ProfileBooks";
import EditProfile from "./pages/EditProfile";
import Favorites from "./pages/Favorites";
import ReadLater from "./pages/ReadLater";
import UserProfile from "./pages/UserProfile";
import UserSearch from "./pages/UserSearch";

// Components / Public Pages
import Genre from "./components/Genre";
import AboutUs from "./components/Abouts";
import Authors from "./components/Authors";
import BookLibrary from "./components/BookLibrary";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AuthorDetail from "./pages/AuthorDetail";
import Feeds from "./pages/Feeds";
import PostDetail from "./pages/PostDetails";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>

        {/* 🌍 Public layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PreHome />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/searchUser" element={<UserSearch />} />
          <Route path="/author" element={<Authors />} />
          <Route path="/miniLibrary" element={<BookLibrary />} />
          <Route path="/upload" element={<UploadBook />} />
          <Route path="/profile" element={<ProfileBooks />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:slug" element={<AuthorDetail />} />
          <Route path="/feeds" element={<Feeds/>}/>
          <Route path="/post/:id" element={<PostDetail/>}/>

        </Route>

        {/* 🔐 Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadBook />
            </ProtectedRoute>
          }
        />

        <Route path="/author/:slug" element={
          <ProtectedRoute><AuthorDetail /></ProtectedRoute>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editProfile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readLater"
          element={
            <ProtectedRoute>
              <ReadLater />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchUser"
          element={
            <ProtectedRoute>
              <UserSearch />
            </ProtectedRoute>
          }
        />

         <Route
          path="/post/:id"
          element={
           
              <PostDetail />
           
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
