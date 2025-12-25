import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import "./Feeds.css";

const WORD_LIMIT = 120;

const Feeds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [wordCount, setWordCount] = useState(0);

  /* ---------- load posts ---------- */
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "posts"));
      setPosts(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );
    };
    load();
  }, []);

  /* ---------- handlers ---------- */
  const handleContentChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length > WORD_LIMIT) return;

    setForm({ ...form, content: text });
    setWordCount(words.length);
  };

  const handleSubmit = async () => {
    if (!form.content || !user) return;

    await addDoc(collection(db, "posts"), {
      title: form.title || "",
      content: form.content,
      preview: form.content.slice(0, 180),
      wordCount,
      views: 0,
      author: {
        uid: user.uid,
        name: user.displayName || "Anonymous",
      },
      createdAt: serverTimestamp(),
    });

    setForm({ title: "", content: "" });
    setWordCount(0);
    setShowModal(false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="feed-container">
      {posts.map((p) => (
        <motion.div
          key={p.id}
          className="feed-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h6 className="fw-bold text-success">{p.title || "Untitled"}</h6>
          <p className="preview clamp-2">{p.preview}</p>

          <button
            className="see-more"
            onClick={() => navigate(`/post/${p.id}`)}
          >
            Read more
          </button>

          <div className="meta">
            <span>{p.author?.name}</span>
            <span>{p.views || 0} views</span>
          </div>
        </motion.div>
      ))}

      {/* Floating Add Button */}
      <button className="fab" onClick={() => setShowModal(true)}>+</button>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <motion.div
            className="modal-card"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h5>Create Post</h5>

            <input
              className="underline"
              placeholder="Title (optional)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="underline mt-3"
              placeholder="Write your poem / shayari…"
              rows={5}
              value={form.content}
              onChange={handleContentChange}
            />

            <small
              style={{
                color: wordCount > 100 ? "red" : "#666",
              }}
            >
              {wordCount}/{WORD_LIMIT} words
            </small>

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-dark w-100" onClick={handleSubmit}>
                Publish
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Feeds;
