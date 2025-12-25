// src/components/ProfileBooks.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "motion/react";

import BookList from "../components/BookList";
import profileBg from "../assets/profileBg.png";
import backimg from "../assets/cover.webp";
import { Link } from "react-router-dom";

const TABS = {
  UPLOADED: "uploaded",
  FAVORITES: "favorites",
  READ_LATER: "readLater",
  POSTS: "posts",
};

const ProfileBooks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const [activeTab, setActiveTab] = useState(TABS.UPLOADED);

  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [readLaterBooks, setReadLaterBooks] = useState([]);
  const [posts, setPosts] = useState([]);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  // ---------------- FETCH BOOKS BASED ON TAB ----------------
  useEffect(() => {
    if (!user) return;

    let unsubscribe;

    if (activeTab === TABS.UPLOADED) {
      const q = query(
        collection(db, "books"),
        where("uploadedBy.uid", "==", user.uid)
      );
      unsubscribe = onSnapshot(q, (snap) =>
        setUploadedBooks(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
      );
    }

    if (activeTab === TABS.FAVORITES) {
      unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "favorites"),
        (snap) =>
          setFavoriteBooks(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          )
      );
    }

    if (activeTab === TABS.READ_LATER) {
      unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "readLater"),
        (snap) =>
          setReadLaterBooks(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          )
      );
    }

    if (activeTab === TABS.POSTS) {
      const q = query(
        collection(db, "posts"),
        where("author.uid", "==", user.uid)
      );
      unsubscribe = onSnapshot(q, (snap) =>
        setPosts (
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
      );
    }


    return () => unsubscribe && unsubscribe();
  }, [user, activeTab]);

  // ---------------- ACTION HANDLERS ----------------
  const toggleSubCollection = async (type, book) => {
    const ref = doc(db, "users", user.uid, type, book.id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { ...book, savedAt: serverTimestamp() });
    }
  };

  const handleDelete = async (book) => {
    if (window.confirm("Delete this book permanently?")) {
      await deleteDoc(doc(db, "books", book.id));
    }
  };

  if (!user)
    return <p className="text-center mt-5">🔐 Please log in</p>;

  // ---------------- UI ----------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* PROFILE HEADER */}
      <div
        className="container py-5 text-left text-white"
        style={{
          backgroundImage: `url(${profileBg})`,
          backgroundSize: "cover",
        }}
      >
        <img
          src={profile?.photoURL || backimg}
          alt="profile"
          className="rounded-circle mb-3"
          style={{ width: 140, height: 140, objectFit: "cover" }}
        />
        <h4 className="fw-bold text-dark">{profile?.displayName || "Anonymous"}</h4>
        <p className="opacity-75 text-dark">{profile?.email}</p>
        <p className="opacity-75 text-dark">
          📚 <b className="text-dark">{uploadedBooks.length}</b> books uploaded
        </p>
        <Link to="/editprofile" className="btn btn-sm mt-2 text-dark">
          ... Edit Profile
        </Link>
      </div>

      {/* ABOUT */}
      <div className="container mt-4">
        <h5>About</h5>
        <p className="text-muted">
          {profile?.bio || "No bio provided yet."}
        </p>
      </div>

      {/* TABS */}
      <div className="container mt-4">
        <ul className="nav nav-tabs justify-content-center">
          {Object.values(TABS).map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${
                  activeTab === tab ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace("_", " ").toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* TAB CONTENT */}
      <div className="container mt-4">
        {activeTab === TABS.UPLOADED && (
          <BookList
            books={uploadedBooks}
            currentUser={user.uid}
            onFavorite={(b) => toggleSubCollection("favorites", b)}
            onReadLater={(b) => toggleSubCollection("readLater", b)}
            onDelete={handleDelete}
          />
        )}

        {activeTab === TABS.FAVORITES && (
          <BookList
            books={favoriteBooks}
            currentUser={user.uid}
            onFavorite={(b) => toggleSubCollection("favorites", b)}
          />
        )}

        {activeTab === TABS.READ_LATER && (
          <BookList
            books={readLaterBooks}
            currentUser={user.uid}
            onReadLater={(b) => toggleSubCollection("readLater", b)}
          />
        )}

        {/* {activeTab === TABS.SHARED && (
          <p className="text-center text-muted mt-5">
            🚧 Shared books coming soon
          </p>
        )} */}

         {activeTab === "posts" && (
          <>
            {posts.length === 0 && (
              <p className="text-muted text-center">No posts yet.</p>
            )}

            {posts.map((p) => (
              <div key={p.id} className="post-card">
                <h6>{p.title || "Untitled"}</h6>
                <p className="clamp-2">{p.content}</p>
                <button
                  className="see-more"
                  onClick={() => navigate(`/post/${p.id}`)}
                >
                  See more
                </button>
                <small className="text-muted text-end d-block">{p.views || 0} views</small>
              </div>
            ))}
          </>
        )}

      </div>
    </motion.div>
  );
};

export default ProfileBooks;
