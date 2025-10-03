import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import cover from "../assets/cover.webp"
import { use } from "framer-motion/m";
import {easeInOut, motion} from 'motion/react'
import BookList from "./BookList";
import { useAuth } from "../context/AuthContext";
import {
  
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

const BookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user}=useAuth();

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
     navigator.share({
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
        <BookList
  books={books}        // ✅ Filtered & merged books
  currentUser={''}           // ✅ Current logged in user
  onFavorite={handleFavorite}
  onReadLater={handleReadLater}
  onDelete={''}
  onShare={handleShare}
  onMessage={'handleMessage'}
/>


        
      </div>
    </div>
  );
};

export default BookLibrary;
