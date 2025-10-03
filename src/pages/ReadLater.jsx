import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

import BookList from "../components/BookList";

const ReadLater = () => {
  const { user } = useAuth();
  const [readLaterBooks, setReadLaterBooks] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Firestore query -> users/{uid}/readLater
    const q = query(
      collection(db, "users", user.uid, "readLater"),
      orderBy("savedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReadLaterBooks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-6">🛑 Please login to see your Read Later list.</p>;
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
  
    const handleMessage = (book) => {
      alert(`💬 Messaging about: ${book.title}`);
      // 🚀 Future scope: open chat modal
    };

  return (
    <div className="container mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">📖 Read Later</h2>

      {readLaterBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books saved for later. Add some ⏳</p>
      ) : (
        <BookList
          books={readLaterBooks}
          currentUser={user}
          // Actions still available
          onFavorite={handleFavorite}
          onReadLater={handleReadLater}
          onDelete={''}
          onShare={handleShare}
          onMessage={handleMessage}
        />
      )}
    </div>
  );
};

export default ReadLater;
