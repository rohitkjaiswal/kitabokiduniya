import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import cover from "../assets/cover.webp"

const BookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">📚 My Book Library</h2>
        <p className="text-muted">Explore books shared by fellow readers.</p>
        <button
          onClick={fetchBooks}
          className="btn btn-primary btn-lg mt-3"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading...
            </>
          ) : (
            "Fetch Books"
          )}
        </button>
      </div>

      <div className="row">
        {books.map((book) => (
          <div key={book.id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card h-100 text-white shadow-sm border-0"
              style={{
                backgroundImage: `url(${book.coverPage ||cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                className="card-body"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "1rem",
                  height: "100%",
                }}
              >
                <h5 className="card-title" style={{fontSize: "1.75rem",fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"pink"}}>{book.title || "Unknown Title"}</h5>
                <p className="card-text">
                  <strong>Author:</strong> {book.author || "Unknown"}
                </p>
                <p className="card-text">
                    <strong>Genre:</strong> {book.genre || "Various"}
                </p>
                {book.description && (
                  <p className="card-text">{book.description || "No description available."}</p>
                )}
                <p>
                <a
                  href={book.link}
                  className="btn btn-outline-light btn-sm mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                
                <button className="btn btn-outline-light btn-sm mt-2 ms-2" onClick={() => alert(`You chose to read: ${book.title}`)}>
                  Read
                </button>
              </p>
              <p style={{fontSize: "0.875rem", color: "rgba(22, 243, 29, 0.7)"}}><small>Say thanks to: <a href={`mailto:${book.uploaderEmail}`} className="text-light">{book.uploaderEmail || "Unknown Contributor"}</a> for sharing this book.</small>
              visit contributor's profile <a href={`/profile/${book.uploadedBy}`} className="text-light">here</a>.
              </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookLibrary;
