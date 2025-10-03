// src/components/Genre.jsx
import React, { useState, useEffect } from "react";
import booksByGenre from "../data/booksByGenre";
import { fetchBooksByGenre } from "../data/fetchBooksByGenre"; // Firestore fetcher
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import cover from "../assets/cover.webp"
import BookList from "./BookList";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
 getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // apna firebase config se import


const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicGenres, setDynamicGenres] = useState([]); // Firestore se aayenge
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔥 Firestore + static merge
  useEffect(() => {
  const loadGenres = async () => {
    try {
      const uploadedGenres = await fetchBooksByGenre(); // Firestore fetch
      setDynamicGenres(Array.isArray(uploadedGenres) ? uploadedGenres : []);
    } catch (error) {
      console.error("❌ Firestore fetch error:", error);
      setDynamicGenres([]); // fallback
    }
  };
  loadGenres();
}, []);

 // Static books
const staticBooks = Object.entries(booksByGenre).flatMap(([genre, books]) =>
  books.map((book) => ({
    ...book,
    genre,
    title: typeof book.title === "string" ? book.title : book?.title || "Untitled Book",
    link: book.link || "#",
    coverPage: book.coverPage || cover,
    description: book.description || "No description available",
    uploaderEmail: book.uploaderEmail || "Unknown Contributor",
    uploadedBy: book.uploadedBy || "anonymous",
  }))
);

// Firestore books
const firestoreBooks = dynamicGenres.flatMap((g) =>
  g.books.map((book) => ({
    ...book,
    genre: g.genre,
    title: typeof book.title === "string" ? book.title : book?.title || "Untitled Book",
    link: book.link || "#",
    coverPage: book.coverPage || cover,
    description: book.description || "No description available",
    uploaderEmail: book.uploaderEmail || "Unknown Contributor",
    uploadedBy: book.uploadedBy || "anonymous",
  }))
);

// Merge all books
const allBooks = [...staticBooks, ...firestoreBooks];

  const filteredBooks = allBooks.filter((book) => {
  const matchGenre = selectedGenre === "All" || book.genre === selectedGenre;
  const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
  return matchGenre && matchSearch;
});



  const handleOpenBook = (bookUrl) => {
    if (!user) {
      alert("🔐 Please log in to open this book!");
      navigate("/login");
      return;
    }
    window.open(bookUrl, "_blank");
  };

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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📚 Explore Genres</h2>

      {/* Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="All">All Genres</option>
            {[
              ...new Set([
                ...Object.keys(booksByGenre),
                ...dynamicGenres.map((g) => g.genre),
              ]),
            ].map((genre,index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by book title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Book List */}
      <div className="grow">
      <BookList
  books={filteredBooks}        // ✅ Filtered & merged books
  currentUser={user}           // ✅ Current logged in user
  onFavorite={handleFavorite}
  onReadLater={handleReadLater}
  onDelete={''}
  onShare={handleShare}
  onMessage={'handleMessage'}
/></div>

    </div>
  );
};

export default Genre;
