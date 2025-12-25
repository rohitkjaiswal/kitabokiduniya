import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BookList from "./BookList";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

const BookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // 🔍 filter state
  const { user } = useAuth();

  async function fetchBooks() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const fetchedBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFavorite = async (book) => {
    if (!user) return alert("🔐 Please log in first!");

    const favRef = doc(db, "users", user.uid, "favorites", book.id);

    const snap = await getDoc(favRef);
    if (snap.exists()) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { ...book, savedAt: serverTimestamp() });
    }
  };

  const handleReadLater = async (book) => {
    if (!user) return alert("🔐 Please log in first!");

    const ref = doc(db, "users", user.uid, "readLater", book.id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { ...book, savedAt: serverTimestamp() });
    }
  };

  const handleShare = (book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}"`,
        url: window.location.href,
      });
    }
  };

  // 🔥 Filter logic (by book name)
  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">📚 My Book Library</h2>
        <p className="text-muted">Explore books shared by fellow readers</p>

        {/* 🔍 Filter input */}
        <input
          type="text"
          placeholder="Search by book name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "320px",
            border: "none",
            borderBottom: "2px solid #ccc",
            outline: "none",
            padding: "8px 6px",
            fontSize: "15px",
            marginTop: "10px",
            background: "transparent",
          }}
        />

        <br />

        <button
          onClick={fetchBooks}
          className="btn btn-primary btn-lg mt-4"
          disabled={loading}
        >
          {loading ? "Loading…" : "Fetch Books"}
        </button>
      </div>

      <div className="row">
        <BookList
          books={filteredBooks}   // ✅ filtered result
          currentUser={user}
          onFavorite={handleFavorite}
          onReadLater={handleReadLater}
          onDelete={null}
          onShare={handleShare}
          onMessage={null}
        />
      </div>
    </div>
  );
};

export default BookLibrary;
