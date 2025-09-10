// src/components/Genre.jsx
import React, { useState, useEffect } from "react";
import booksByGenre from "../data/booksByGenre";
import { fetchBooksByGenre } from "../data/booksByGenre"; // Firestore fetcher
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  // Static genres normalize
  const staticBooks = Object.entries(booksByGenre).flatMap(([genre, books]) =>
    books.map((book) => ({ ...book, genre }))
  );

  // Firestore genres normalize (⚡ Fix: spread the book object)
  const firestoreBooks = Array.isArray(dynamicGenres)
  ? dynamicGenres.flatMap((g) =>
      g.books.map((title) => ({
        title,
        genre: g.genre,
        link: g.link || "#", // Agar Firestore me link hai to yahan add karna
      }))
    )
  : [];

  // Dono ko merge
  const allBooks = [...staticBooks, ...firestoreBooks];

  // Filter logic
  const filteredBooks = allBooks.filter((book) => {
    const matchGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
            ].map((genre) => (
              <option key={genre} value={genre}>
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
      <div className="row">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div className="col-sm-12 col-md-6 col-lg-4 mb-3" key={index}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenBook(book.link)}
                  >
                    📖 Open in Google Drive
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Genre;
