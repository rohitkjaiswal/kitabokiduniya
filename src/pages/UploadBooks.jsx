import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UploadBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    link: "",
    description: "",
  });

  const genres = ["Fiction", "Non-Fiction", "Poetry", "Drama", "Romance", "Thriller"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("🛑 Only logged-in users can upload books!");
      navigate("/login");
      return;
    }

    // Here, you'd typically POST to a backend or update Firebase
    console.log("📚 Book uploaded:", formData);
    alert("Book uploaded successfully (not really, just a demo 😅)");

    setFormData({
      title: "",
      author: "",
      genre: "",
      link: "",
      description: "",
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📤 Upload a Book</h2>

      <form onSubmit={handleSubmit} className="p-4 shadow-sm border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">📖 Book Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Godaan"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">✍️ Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="e.g. Premchand"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">🏷️ Genre</label>
          <select
            className="form-select"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Select a genre</option>
            {genres.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">🔗 Google Drive Link</label>
          <input
            type="url"
            className="form-control"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">📝 Description (optional)</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write something spicy about this book..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success">
          🚀 Upload Book
        </button>
      </form>
    </div>
  );
};

export default UploadBook;
