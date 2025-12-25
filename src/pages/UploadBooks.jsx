import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  orderBy,
  limit,
} from "firebase/firestore";

/* ---------------- utils ---------------- */
const normalize = (str = "") =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");

const slugify = (str = "") => normalize(str).replace(/\s/g, "-");

/* ---------------- component ---------------- */
const UploadBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    authorPhoto: "",
    genre: "",
    link: "",
    coverPage: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [showPhotoInput, setShowPhotoInput] = useState(true);

  /* -------- handlers -------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* -------- duplicate book check -------- */
  const checkDuplicateBook = async (authorId, title) => {
    const q = query(
      collection(db, "books"),
      where("authorId", "==", authorId),
      where("titleNormalized", "==", normalize(title))
    );
    const snap = await getDocs(q);
    return !snap.empty;
  };

  /* -------- ensure author exists -------- */
  const ensureAuthor = async (authorName, authorPhoto) => {
    const authorId = slugify(authorName);
    const ref = doc(db, "authors", authorId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // CREATE AUTHOR (ONCE)
      await setDoc(ref, {
        name: authorName,
        slug: authorId,
        photo: authorPhoto || "",
        bio: "",
        booksCount: 0,
        views: 0,
        likes: 0,
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
        lastBookAt: serverTimestamp(),
      });
    } else {
      // UPDATE ONLY SAFE FIELDS
      const data = snap.data();
      const updates = {
        lastBookAt: serverTimestamp(),
      };

      // store photo only if missing
      if (!data.photo && authorPhoto) {
        updates.photo = authorPhoto;
      }

      await updateDoc(ref, updates);
    }

    return authorId;
  };

  /* -------- author suggestions -------- */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!formData.author.trim()) {
        setAuthorSuggestions([]);
        return;
      }
      try {
        const q = query(
          collection(db, "authors"),
          orderBy("name"),
          limit(10)
        );
        const snap = await getDocs(q);
        const allAuthors = snap.docs.map((doc) => doc.data());
        const filtered = allAuthors.filter((a) =>
          a.name.toLowerCase().startsWith(formData.author.toLowerCase())
        );
        setAuthorSuggestions(filtered);
      } catch (err) {
        console.error("Error fetching author suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [formData.author]);

  const handleSelectAuthor = (author) => {
    setFormData({
      ...formData,
      author: author.name,
      authorPhoto: author.photo || "",
    });
    if (author.photo) {
      setShowPhotoInput(false); // hide photo input if already available
    } else {
      setShowPhotoInput(true);
    }
    setAuthorSuggestions([]);
  };

  /* -------- submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const authorId = await ensureAuthor(
        formData.author,
        formData.authorPhoto
      );

      const isDuplicate = await checkDuplicateBook(
        authorId,
        formData.title
      );

      if (isDuplicate) {
        setError("🚫 This book already exists for this author.");
        setLoading(false);
        return;
      }

      // ADD BOOK
      await addDoc(collection(db, "books"), {
        title: formData.title,
        titleNormalized: normalize(formData.title),
        authorName: formData.author,
        authorId,
        genre: formData.genre,
        link: formData.link,
        coverPage: formData.coverPage || "",
        description: formData.description || "",
        uploadedBy: {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
        },
        createdAt: serverTimestamp(),
      });

      // INCREMENT AUTHOR BOOK COUNT
      await updateDoc(doc(db, "authors", authorId), {
        booksCount: increment(1),
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    formData.title &&
    formData.author &&
    formData.genre &&
    formData.link;

  /* -------- UI -------- */
  return (
    <div className="container mt-5" style={{ maxWidth: 720 }}>
      <h2 className="text-center mb-4">Upload Book</h2>

      <form onSubmit={handleSubmit} className="p-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control input-underline"
          placeholder="Book title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <div className="position-relative mt-4">
          <input
            className="form-control input-underline"
            placeholder="Author name"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {authorSuggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow-sm">
              {authorSuggestions.map((author) => (
                <li
                  key={author.slug}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectAuthor(author)}
                >
                  {author.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {showPhotoInput && (
          <input
            className="form-control input-underline mt-4"
            placeholder="Author photo URL (Wikipedia / Google image)"
            name="authorPhoto"
            value={formData.authorPhoto}
            onChange={handleChange}
          />
        )}

        {formData.authorPhoto && (
          <img
            src={formData.authorPhoto}
            alt="Author photo preview"
            className="img-fluid mt-2"
            style={{ maxHeight: 200 }}
          />
        )}

        <input
          className="form-control input-underline mt-4"
          placeholder="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
        />

        <input
          className="form-control input-underline mt-4"
          placeholder="Google Drive link"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />

        <input
          className="form-control input-underline mt-4"
          placeholder="Cover image URL (optional)"
          name="coverPage"
          value={formData.coverPage}
          onChange={handleChange}
        />

        {formData.coverPage && (
          <img
            src={formData.coverPage}
            alt="Cover preview"
            className="img-fluid mt-2"
            style={{ maxHeight: 200 }}
          />
        )}

        <textarea
          className="form-control input-underline mt-4"
          placeholder="Short description (optional)"
          name="description"
          rows="2"
          value={formData.description}
          onChange={handleChange}
        />

        <button
          className="btn btn-dark w-100 mt-4"
          disabled={!isValid || loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <style>{`
        .input-underline {
          border: none;
          border-bottom: 2px solid #ccc;
          border-radius: 0;
          box-shadow: none;
        }
        .input-underline:focus {
          border-bottom-color: #000;
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default UploadBook;
