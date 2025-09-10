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

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
  if (!user || !user.uid) return;

  console.log("📡 Listening for favorites of:", user.uid);

  const q = query(
    collection(db, "users", user.uid, "favorites"),
    orderBy("savedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log("🔥 Favorites snapshot:", snapshot.docs.map((d) => d.data()));
    setFavorites(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });

  return () => unsubscribe();
}, [user]);


  if (!user) {
    return <p className="text-center mt-6">🛑 Please login to see your favorites.</p>;
  }

  return (
    <div className="container mt-6 px-4 m-2">
      <h2 className="text-2xl font-bold mb-4 text-center">⭐ My Favorite Books</h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorites yet. Add some 📚</p>
      ) : (
        <BookList
          books={favorites}
          currentUser={user}
          // In favorites list, user can still manage actions
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

export default Favorites;
