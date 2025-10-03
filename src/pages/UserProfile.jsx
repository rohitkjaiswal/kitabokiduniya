import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import BookMenu from "../components/BookMenu";
import { MoreVertical } from "lucide-react";
import BookList from "../components/BookList";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        const booksQuery = query(
          collection(db, "books"),
          where("uploadedBy", "==", userId)
        );
        const booksSnap = await getDocs(booksQuery);
        const userBooks = booksSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(userBooks);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">User not found</h3>
        <p>Please check the profile link or try again later.</p>
      </div>
    );
  }

  const isOwner = user.id;
  const handleFavorite = async (book) => {
    if (!user) {
      alert("🔐 Please log in first!");
      return;
    }

    if (!book.id) {
      // Generate a safe unique ID
      book.id = `${book.title.replace(/\s+/g, "_")}_${book.genre}`;
    }

    const favRef = doc(db, "users", user.uid, "favorites", book.id);

    try {
      const favSnap = await getDoc(favRef);

      if (favSnap.exists()) {
        // Already favorited → remove
        await deleteDoc(favRef);
        alert(`❌ Removed "${book.title}" from Favorites`);
      } else {
        // Not favorited → add
        await setDoc(favRef, {
          ...book,
          savedAt: serverTimestamp(),
        });
        alert(`⭐ Added "${book.title}" to Favorites`);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleReadLater = async (book) => {
    if (!user) {
      alert("🔐 Please log in first!");
      return;
    }

    if (!book.id) {
      // Generate a safe unique ID
      book.id = `${book.title.replace(/\s+/g, "_")}_${book.genre}`;
    }

    const readLaterRef = doc(db, "users", user.uid, "readLater", book.id);

    try {
      const snap = await getDoc(readLaterRef);

      if (snap.exists()) {
        // Already saved → remove
        await deleteDoc(readLaterRef);
        alert(`❌ Removed "${book.title}" from Read Later`);
      } else {
        // Not saved → add
        await setDoc(readLaterRef, {
          ...book,
          savedAt: serverTimestamp(),
        });
        alert(`📌 Saved "${book.title}" for later`);
      }
    } catch (err) {
      console.error("Error toggling Read Later:", err);
    }
  };

  const handleShare = (book) => {
    if (navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out this book: ${book.title} by ${book.author}`,
          url: book.link || window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="container py-2">
      <div className="card shadow-lg border-0 mb-5 p-3 rounded">
        <div className="row g-0">
          <div className="col-md-4 d-flex align-items-center justify-content-center bg-light flex-wrap">
            <img
              src={user.photoURL || cover}
              alt="User Avatar"
              className="img rounded-circle"
              style={{ objectFit: "cover", height: "150px", width: "150px" }}
            />
          </div>
          <div className="col-md-8 p-1 text-center">
            <div className="card-body" style={{ fontStyle: "inherit" }}>
              <h5
                className="card-title text-primary"
                style={{ fontWeight: "bold" }}
              >
                {user.displayName || "Anonymous Reader"}
              </h5>

              <p style={{ color: "green" }}>
                Current reading :{" "}
                <span style={{ color: "red" }}>{user.currentReading}</span>
              </p>
              <p className="card-text text-start">
                <small>{`Wish me on ${
                  user.dob
                    ? user.dob.toDate
                      ? user.dob.toDate().toLocaleDateString()
                      : new Date(user.dob).toLocaleDateString()
                    : "not available"
                }`}</small>{" "}
                <br />
                Uploaded books : <strong>{books.length}</strong>
                <br />
                {user.bio}
                <br />
                <small className="text-muted">
                  {`Joined on ${
                    user.createdAt
                      ? user.createdAt.toDate
                        ? user.createdAt.toDate().toLocaleDateString()
                        : new Date(user.createdAt).toLocaleDateString()
                      : "Not Provided"
                  }`}
                </small>
              </p>
              <p className="card-text text-end">
                {" "}
                <a
                  className="text-decoration-none"
                  href={`mailto:${user.email}`}
                >
                  send email ...
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex"></div>

      <h5 className="mb-4 text-secondary">
        📚 Books Shared by {user.displayName || "this user"}
      </h5>
      <div className="row">
        {books.length > 0 ? (
          <BookList
            books={books}
            currentUser={user.uid}
            onFavorite={handleFavorite}
            onReadLater={handleReadLater}
            onDelete={() => alert("you are not uplader!")}
            onShare={handleShare}
            onMessage={() => alert("this feature will be provide soon")}
          />
        ) : (
          <p className="text-muted">No books uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
