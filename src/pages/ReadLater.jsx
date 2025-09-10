import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
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
          onFavorite={() => {}}
          onReadLater={() => {}}
          onDelete={() => {}}
          onShare={(book) => navigator.clipboard.writeText(book.link || window.location.href)}
          onMessage={(book) => alert(`💬 Message about: ${book.title}`)}
        />
      )}
    </div>
  );
};

export default ReadLater;
