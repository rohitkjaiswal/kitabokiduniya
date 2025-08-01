import React, { useState } from "react";
import authorsData from "../data/authorsData";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Authors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenBook = (url) => {
    if (!user) {
      alert("🛑 You must log in to read! We’re strict like school librarians.");
      navigate("/login");
      return;
    }
    window.open(url, "_blank");
  };

  const filteredAuthors = authorsData.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">✍️ Authors & Their Legendary Books</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search authors... (even fictional ones)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredAuthors.length > 0 ? (
          filteredAuthors.map((author, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={index}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{author.name}</h5>
                  <p className="card-text text-muted" style={{ fontSize: "0.95rem" }}>
                    {author.description}
                  </p>
                  <ul className="list-unstyled flex-grow-1">
                    {author.books.map((book, i) => (
                      <li key={i} className="mb-2">
                        📘 {book.title}
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => handleOpenBook(book.link)}
                        >
                          Open
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-end">
                    🖊️ {author.books.length} {author.books.length === 1 ? "masterpiece" : "books"} shared
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p>No authors found. Try typing "Kabir", "Premchand", or "that one guy who wrote one book." 😅</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;
