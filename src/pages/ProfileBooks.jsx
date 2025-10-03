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
import {motion} from 'motion/react'

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
    if (!user) {
      alert("🔐 Please log in first!");
      return;
    }
  
    if (!book.id) {
      // Generate a safe unique ID
      book.id = `${book.title.replace(/\s+/g, "_")}_${book.genre}`;
    }
  
    const favRef = doc(db, "users", user.uid, "favorites", book.id);
  
    try {
      const favSnap = await getDoc(favRef);
  
      if (favSnap.exists()) {
        // Already favorited → remove
        await deleteDoc(favRef);
        alert(`❌ Removed "${book.title}" from Favorites`);
      } else {
        // Not favorited → add
        await setDoc(favRef, {
          ...book,
          savedAt: serverTimestamp(),
        });
        alert(`⭐ Added "${book.title}" to Favorites`);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };
  
  const handleReadLater = async (book) => {
    if (!user) {
      alert("🔐 Please log in first!");
      return;
    }
  
    if (!book.id) {
      // Generate a safe unique ID
      book.id = `${book.title.replace(/\s+/g, "_")}_${book.genre}`;
    }
  
    const readLaterRef = doc(db, "users", user.uid, "readLater", book.id);
  
    try {
      const snap = await getDoc(readLaterRef);
  
      if (snap.exists()) {
        // Already saved → remove
        await deleteDoc(readLaterRef);
        alert(`❌ Removed "${book.title}" from Read Later`);
      } else {
        // Not saved → add
        await setDoc(readLaterRef, {
          ...book,
          savedAt: serverTimestamp(),
        });
        alert(`📌 Saved "${book.title}" for later`);
      }
    } catch (err) {
      console.error("Error toggling Read Later:", err);
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
    <motion.div initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}} className=" mt-1 justify-content-center align-items-center " >
      {/* Profile Card */}

      <div className="container d-flex flex-wrap  align-content-center " download style={{backgroundImage: `url(${profileBg})`, backgroundSize: 'cover'}}>
       
        <div className="container center  text-center bg-opacity-50 bg-dark " >
          
          <img style={{width:'150px'}}  className="rounded-circle  align-self-center" src={profile?.photoURL ||backimg} alt={user.displayName || "Anonymous"} />
          <center>
          <h5 className="card-title mb-3" style={{fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"yellow"}}>
            {profile?.displayName || "Anonymous"}
          </h5>
          <p className="card-text " style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"white"}}>
             {profile?.email || 'user.email'} <br />
            📚 <b>{books.length}</b> Books uploaded
          </p>
          <Link
            to="/favorites"
            className="btn btn-sm btn-primary text-decoration-none mx-1 my-1"
           >
            View favorite books

          </Link >
          <NavLink  to="/readLater"
            className="btn btn-sm btn-secondary text-decoration-none mx-1 my-1"
            >
             readLater
          </NavLink>
         
          <NavLink
            to="/editProfile"
            className="btn btn-sm btn-secondary ms-2 text-decoration-none mx-1 my-1"
          >
            Edit
          </NavLink>
         
          </center>
        </div>

       
      </div>

      <div className="container mt-4">
        
        <h3 className="ps-5">About me </h3>
        <p className="ps-5">{profile?.bio || "No bio available."}</p>
        <hr />
       </div> 

      {/* Books Section */}
      <h3 className="text-xl font-semibold mb-2 text-center">
        📚 My Uploaded Books
      </h3>

      <BookList
        books={books}
        currentUser={user.uid}
        onFavorite={handleFavorite}
        onReadLater={handleReadLater}
        onDelete={handleDelete}
        onShare={handleShare}
        onMessage={handleMessage}
      />
    </motion.div>
  );
};

export default ProfileBooks;
