// src/components/ProfileBooks.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import backimg from "../assets/cover.webp"

import BookList from "../components/BookList";
import { Navigate } from "react-router-dom";
import {NavLink, Link,Outlet } from "react-router-dom";
import Favorites from "./Favorites";
import EditProfile from "./EditProfile";
import profileBg from "../assets/profileBg.png";

const ProfileBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Fetch profile info
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };
    fetchProfile();

    // Fetch books uploaded by this user
    const q = query(
      collection(db, "books"),
      where("uploadedBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-6">🛑 Please login to see your profile.</p>
    );

  // -----------------------------
  // Handlers for BookList actions
  // -----------------------------

  const handleFavorite = async (book) => {
    try {
      await setDoc(doc(db, "users", user.uid, "favorites", book.id), {
        ...book,
        savedAt: serverTimestamp(),
      });
      alert(`⭐ Added "${book.title}" to Favorites`);
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  const handleReadLater = async (book) => {
    try {
      await setDoc(doc(db, "users", user.uid, "readLater", book.id), {
        ...book,
        savedAt: serverTimestamp(),
      });
      alert(`📌 Saved "${book.title}" for later`);
    } catch (err) {
      console.error("Error adding to read later:", err);
    }
  };

  const handleShare = (book) => {
  if (navigator.share) {
    navigator.share({
      title: book.title,
      text: `Check out this book: ${book.title} by ${book.author}`,
      url: book.link || window.location.href,
    })
    .then(() => console.log("Shared successfully"))
    .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing is not supported on this device.");
  }
};

  const handleMessage = (book) => {
    alert(`💬 Messaging about: ${book.title}`);
    // 🚀 Future scope: open chat modal
  };

  async function handleDelete(book) {
    if (window.confirm("Are you sure you want to delete this book?")) {

      await deleteDoc(doc(db, "books", book.id));
       console.log("Delete successfully");
    }
   
  }

  // -----------------------------

  return (
    <div className=" mt-2 justify-content-center align-items-center " >
      {/* Profile Card */}

      <div className="container-fluid d-flex flex-wrap  align-content-center " download style={{backgroundImage: `url(${profileBg})`, backgroundSize: 'cover', height:'100%'}}>
       
        <div className="container-fluid h-full center  text-center bg-opacity-50 bg-dark p-5" >
          
          <img className="rounded-circle  align-self-center" src={profile?.photoURL ||backimg} alt={user.displayName || "Anonymous"} />
          <center>
          <h5 className="card-title mb-3" style={{fontSize: "1.5rem",fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"yellow"}}>
            {profile?.displayName || "Anonymous"}
          </h5>
          <p className="card-text " style={{fontSize: "1.2rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"white"}}>
             {profile?.email || 'user.email'} <br />
            📚 <b>{books.length}</b> Books uploaded
          </p>
          <Link
            to="/favorites"
            className="btn btn-sm btn-primary text-decoration-none"
            style={{fontSize: "1.2rem"}}>
            View favorite books

          </Link >
          <NavLink  to="/readLater"
            className="btn btn-sm btn-secondary text-decoration-none mx-3"
            style={{fontSize: "1.2rem"}}>
             readLater
          </NavLink>
         
          <NavLink
            to="/editProfile"
            className="btn btn-sm btn-secondary ms-2 text-decoration-none"
          style={{fontSize: "1.2rem" }}>
            Edit Profile
          </NavLink>
         
          </center>
        </div>

       
      </div>

      {/* <div className="container-fluid mt-4"> */}
        
        <h3 className="ps-5">About me </h3>
        <p className="ps-5">{profile?.bio || "No bio available."}</p>
        <hr />
      {/* </div> */}

      {/* Books Section */}
      <h3 className="text-xl font-semibold mb-2 text-center">
        📚 My Uploaded Books
      </h3>

      <BookList
        books={books}
        currentUser={user}
        onFavorite={handleFavorite}
        onReadLater={handleReadLater}
        onDelete={handleDelete}
        onShare={handleShare}
        onMessage={handleMessage}
      />
    </div>
  );
};

export default ProfileBooks;
