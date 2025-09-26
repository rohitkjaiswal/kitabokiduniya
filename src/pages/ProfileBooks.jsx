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

import BookList from "../components/BookList";
import { Navigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Favorites from "./Favorites";

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
    navigator.clipboard.writeText(book.link || window.location.href);
    alert("🔗 Book link copied to clipboard!");
  };

  const handleMessage = (book) => {
    alert(`💬 Messaging about: ${book.title}`);
    // 🚀 Future scope: open chat modal
  };

  async function handleDelete(book) {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await deleteDoc(doc(db, "books", book.id));
    }
  }

  // -----------------------------

  return (
    <div className=" mt-2 justify-content-center align-items-center">
      {/* Profile Card */}

      <div className="container d-flex flex-row flex-wrap">
       
        <div className="card-body center text-left m-5">
          <img className="rounded-circle align-self-center" src={profile?.photoURL || "https://th.bing.com/th/id/OIP.pDHYyL8j_5ey3eYm2Jc9bwAAAA?w=112&h=118&c=7&r=0&o=5&dpr=1.3&pid=1.7"} alt={user.displayName || "Anonymous"} />
          <center>
          <h5 className="card-title mb-3">
            {user?.displayName || "Anonymous"}
          </h5>
          <p className="card-text">
            📧 {profile?.email || user.email} <br />
            📚 <b>{books.length}</b> Books uploaded
          </p>

          <NavLink
            to="/favorites"
            className="btn btn-sm btn-outline-primary ms-2"
          >
            View favorite books
          </NavLink>
          <NavLink
            to="/editProfile"
            className="btn btn-sm btn-outline-primary ms-2"
          >
            Edit Profile
          </NavLink></center>
        </div>

       
      </div>

      <div className="container mt-4">
        <hr />
        <h3>About you </h3>
        <p>{profile?.bio || "No bio available."}</p>
        <hr />
      </div>

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
