import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import "./PostDetail.css";
import Loading from "../components/Loading";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  /* hidden infra */
  const shareRef = useRef(null);
  const storyRef = useRef(null);
  const qrRef = useRef(null);

  /* ---------- LOAD POST ---------- */
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = { id: snap.id, ...snap.data() };
      setPost(data);

      const viewKey = `viewed_post_${id}`;
      if (!localStorage.getItem(viewKey)) {
        await updateDoc(ref, { views: increment(1) });
        localStorage.setItem(viewKey, "1");
      }

      if (data.author?.uid) {
        const q = query(
          collection(db, "posts"),
          where("author.uid", "==", data.author.uid),
          where("__name__", "!=", id),
          limit(5)
        );
        const snapMore = await getDocs(q);
        setMorePosts(snapMore.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    };

    load();
  }, [id]);

  /* ---------- SHARE ---------- */
  const handleShare = async () => {
    try {
      const postUrl = window.location.href;
      const text = `Check out this post: ${post.title} - ${post.preview}\n${postUrl}`;

      await QRCode.toCanvas(qrRef.current, postUrl, { width: 100 });

      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${post.title || "post"}.jpg`, {
          type: "image/jpeg",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: post.title,
            text: text,
            files: [file],
          });
        } else {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = file.name;
          a.click();
        }

        await addDoc(collection(db, "postreaction"), {
          postId: id,
          userId: user?.uid || "guest",
          authorId: post.author.uid,
          type: "share",
          createdAt: serverTimestamp(),
        });
      }, "image/jpeg");
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  /* ---------- EDIT ---------- */
  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setShowModal(true);
  };

  const saveEdit = async () => {
    try {
      const ref = doc(db, "posts", id);
      await updateDoc(ref, {
        title: editTitle,
        content: editContent,
        updatedAt: serverTimestamp(),
      });
      setPost({ ...post, title: editTitle, content: editContent });
      setShowModal(false);
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (!post) return <Loading />;

  return (
    <div className="post-layout">
      {/* MAIN POST */}
      <motion.div className="post-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="post-title">{post.title}</h2>

        <div className="post-meta">
          <span>{post.author?.name}</span>
          <span>·</span>
          <span>{post.views || 0} views</span>
        </div>

        <div className="post-content">{post.content}</div>

        {/* ONLY ACTION USER SEES */}
        <button className="btn btn-dark btn-sm mt-3" onClick={handleShare}>
          Share
        </button>

        {user?.uid === post.author?.uid && (
          <button className="btn btn-warning btn-sm mt-3 ms-2" onClick={handleEdit}>
            Edit
          </button>
        )}
      </motion.div>

      {/* SIDEBAR */}
      <aside className="post-sidebar">
        <div className="author-card">
          <h6>About the author</h6>
          <p>{post.author?.name}</p>
          <button
            className="btn btn-outline-dark btn-sm w-100"
            onClick={() => navigate(`/profile/${post.author.uid}`)}
          >
            Visit Profile
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
                <strong>{p.title}</strong>
                <p className="clamp-2">{p.preview}</p>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ================= HIDDEN SHARE CARD ================= */}
      <div ref={shareRef} className="share-card">
        <div className="share-header">
          <img src={post.author.photoURL} className="share-avatar" />
          <div>
            <h1>{post.title}</h1>
            <p>{post.author.name}</p>
            <small>{window.location.origin}/profile/{post.author.uid}</small>
          </div>
        </div>

        <div className="share-content">{post.content}</div>

        <div className="share-footer">
          <span>Shared by {user?.name || "Reader"}</span>
          <canvas ref={qrRef}></canvas>
        </div>

        <div className="share-watermark">© {post.author.name}</div>
      </div>

      {/* IG STORY */}
      <div ref={storyRef} className="story-card">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <span>{post.author.name}</span>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h4>Edit Post</h4>
            <input
              type="text"
              className="form-control mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              rows="5"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;