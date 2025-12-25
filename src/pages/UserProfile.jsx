import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import cover from "../assets/cover.webp";
import BookList from "../components/BookList";
import "./UserProfile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // user
        const userSnap = await getDoc(doc(db, "users", userId));
        if (userSnap.exists()) setProfileUser(userSnap.data());

        // books
        const booksSnap = await getDocs(
          query(collection(db, "books"), where("uploadedBy.uid", "==", userId))
        );
        setBooks(booksSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // posts
        const postsSnap = await getDocs(
          query(collection(db, "posts"), where("author.uid", "==", userId))
        );
        setPosts(
          postsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-5">Loading profile…</div>;
  }

  if (!profileUser) {
    return <div className="text-center py-5">User not found</div>;
  }

  return (
    <div className="profile-page container">
      {/* HEADER */}
      <div className="profile-header card border-0 shadow-sm">
        <img
          src={profileUser.photoURL || cover}
          alt="avatar"
          className="profile-avatar"
        />

        <h4 className="mt-3">{profileUser.displayName || "Anonymous"}</h4>
        <p className="text-muted small">{profileUser.bio}</p>

        <div className="profile-stats">
          <span>
            <strong>{posts.length}</strong> Posts
          </span>
          <span>
            <strong>{books.length}</strong> Books
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          📝 Posts
        </button>

        <button
          className={activeTab === "books" ? "active" : ""}
          onClick={() => setActiveTab("books")}
        >
          📚 Books
        </button>
      </div>

      {/* CONTENT */}
      <div className="profile-content">
        {activeTab === "posts" && (
          <>
            {posts.length === 0 && (
              <p className="text-muted text-center">No posts yet.</p>
            )}

            {posts.map((p) => (
              <div key={p.id} className="post-card">
                <h6>{p.title || "Untitled"}</h6>
                <p className="clamp-2">{p.content}</p>
                <button
                  className="see-more"
                  onClick={() => navigate(`/post/${p.id}`)}
                >
                  See more
                </button>
                <small className="text-muted">{p.views || 0} views</small>
              </div>
            ))}
          </>
        )}

        {activeTab === "books" && (
          <>
            {books.length === 0 ? (
              <p className="text-muted text-center">No books uploaded.</p>
            ) : (
              <BookList
                books={books}
                onFavorite={() => {}}
                onReadLater={() => {}}
                onShare={() => {}}
                onDelete={() => alert("Only uploader can delete")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
