import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import "./PostDetail.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = { id: snap.id, ...snap.data() };
      setPost(data);
      setEditContent(data.content);

      /* VIEW TRACKING (ONCE) */
      const viewKey = `viewed_post_${id}`;
      if (!localStorage.getItem(viewKey)) {
        await updateDoc(ref, { views: increment(1) });
        localStorage.setItem(viewKey, "1");

        // Optimistic UI update
        setPost(prev => ({ ...prev, views: (prev.views || 0) + 1 }));
      }

      /* MORE POSTS */
      if (data.author?.uid) {
        const q = query(
          collection(db, "posts"),
          where("author.uid", "==", data.author.uid),
          where("__name__", "!=", id),
          limit(5)
        );

        const snapMore = await getDocs(q);
        setMorePosts(
          snapMore.docs.map(d => ({ id: d.id, ...d.data() }))
        );
      }
    };

    load();
  }, [id]);

  /* -------- SAVE EDIT -------- */
  const saveEdit = async () => {
    if (!editContent.trim()) return;

    await updateDoc(doc(db, "posts", id), {
      content: editContent,
      preview: editContent.slice(0, 180),
    });

    setPost(prev => ({ ...prev, content: editContent }));
    setEditing(false);
  };

  if (!post) return <div className="container py-5">Loading…</div>;

  const isAuthor = user?.uid === post.author?.uid;

  return (
    <div className="post-layout">

      {/* CENTER MAIN POST */}
      <motion.div
        className="post-main"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="post-title">{post.title || "Untitled"}</h2>

        <div className="post-meta">
          <span className="author-name">{post.author?.name}</span>
          <span>·</span>
          <span>{post.views || 0} views</span>
        </div>

        {/* CONTENT */}
        {!editing ? (
          <div className="post-content">{post.content}</div>
        ) : (
          <textarea
            className="edit-box"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={6}
          />
        )}

        {/* AUTHOR ACTION */}
        {isAuthor && (
          <div className="author-actions">
            {!editing ? (
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit Post
              </button>
            ) : (
              <>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={saveEdit}
                >
                  Save
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setEditing(false);
                    setEditContent(post.content);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* RIGHT SIDEBAR */}
      <aside className="post-sidebar">
        <div className="author-card">
          <h6>About the author</h6>
          <p className="fw-semibold">{post.author?.name}</p>

          <button
            className="btn btn-outline-dark btn-sm w-100"
            onClick={() => navigate(`/profile/${post.author.uid}`)}
          >
            Visit Author Profile
          </button>
        </div>

        {morePosts.length > 0 && (
          <div className="more-posts">
            <h6>More from this author</h6>

            {morePosts.map(p => (
              <div
                key={p.id}
                className="more-post-item"
                onClick={() => navigate(`/post/${p.id}`)}
              >
                <strong>{p.title || "Untitled"}</strong>
                <p className="clamp-2 text-muted">{p.preview}</p>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

export default PostDetails;
