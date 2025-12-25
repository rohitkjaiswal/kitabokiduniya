import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookList from "../components/BookList";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Book } from "lucide-react";

const AuthorDetail = () => {
  const { slug } = useParams();

  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [liking, setLiking] = useState(false);

  /** LOAD AUTHOR + BOOKS */
  useEffect(() => {
    const loadAuthor = async () => {
      const ref = doc(db, "authors", slug);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAuthor(snap.data());
        await updateDoc(ref, { views: increment(1) });
      }
    };

    const loadBooks = async () => {
      const q = query(
        collection(db, "books"),
        where("authorId", "==", slug)
      );
      const snap = await getDocs(q);
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const loadComments = async () => {
      const q = query(
        collection(db, "comments"),
        where("authorSlug", "==", slug)
      );
      const snap = await getDocs(q);
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    loadAuthor();
    loadBooks();
    loadComments();
  }, [slug]);

  /** LIKE AUTHOR */
  const likeAuthor = async () => {
    if (liking) return;
    setLiking(true);
    await updateDoc(doc(db, "authors", slug), {
      likes: increment(1),
    });
    setAuthor(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    setLiking(false);
  };

  /** ADD COMMENT + RATING */
  const submitComment = async () => {
    if (!commentText.trim()) return;

    await addDoc(collection(db, "comments"), {
      authorSlug: slug,
      text: commentText,
      rating,
      createdAt: serverTimestamp(),
      user: {
        uid: "guest",
        name: "Anonymous",
      },
    });

    // Update rating aggregates
    await updateDoc(doc(db, "authors", slug), {
      ratingCount: increment(1),
      ratingAvg:
        ((author.ratingAvg || 0) * (author.ratingCount || 0) + rating) /
        ((author.ratingCount || 0) + 1),
    });

    setComments(prev => [
      ...prev,
      { text: commentText, rating, user: { name: "Anonymous" } },
    ]);

    setCommentText("");
    setRating(5);
  };

  if (!author) return <div className="container py-5">Loading…</div>;

  return (
    <div className="container py-5">
      {/* AUTHOR HEADER */}
      <div className="row mb-4">
        <div className="col-md-4">
          <img src={author.photo} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-8">
          <h2>{author.name}</h2>
          <p className="text-muted">{author.bio}</p>

          <p>
        <span className="text-muted">Likes</span> {author.likes || 0} · <span className="text-muted">views</span> {author.views} · <span className="text-muted">rating</span> {(author.ratingAvg || 0).toFixed(1)}
          </p>
          <p>{author.bio}</p>

          <button
            onClick={likeAuthor}
            className="btn btn-outline-primary btn-sm"
          >
            Like Author
          </button>
        </div>
      </div>

      <hr />

      {/* BOOKS */}
      <h4 className="mb-3">Books</h4>
      {/* <div className="row mb-5">
        {books.map(b => (
          <div key={b.id} className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <img src={b.coverPage} style={{ height: 200 }} />
              <div className="card-body">
                <h6>{b.title}</h6>
                <small>{b.genre}</small>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <BookList books={books} />

      <hr />

      {/* COMMENTS */}
      <h4>Community Feedback</h4>

      <div className="mb-3">
        <select
          value={rating}
          onChange={e => setRating(+e.target.value)}
          className="form-select border-0 border-bottom rounded-0 mb-2"
        >
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <textarea
          className="form-control border-0 border-bottom rounded-0"
          placeholder="Leave your thoughts…"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />

        <button
          onClick={submitComment}
          className="btn btn-success btn-sm mt-2"
        >
          Post
        </button>
      </div>

      {comments.map((c, i) => (
        <div key={i} className="border-bottom py-2">
          <strong>{c.user?.name}</strong> · ⭐ {c.rating}
          <p className="mb-1">{c.text}</p>
        </div>
      ))}
    </div>
  );
};

export default AuthorDetail;
