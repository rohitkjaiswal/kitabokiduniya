// src/components/UserSearch.jsx
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import dp from "../assets/cover.webp"

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const usersRef = collection(db, "users");

      // Firestore me query case-sensitive hoti hai
      // Isliye simple "startsWith" style query likh rahe hain
      const q = query(usersRef, where("displayName", ">=", searchTerm), where("displayName", "<=", searchTerm + "\uf8ff"));

      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(fetched);
    } catch (err) {
      console.error("❌ Error searching users:", err);
    }
    setLoading(false);
  };

  const handleOpenProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔍 Search Users</h2>

      <form onSubmit={handleSearch} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <p>⏳ Searching...</p>}

      <div className="row">
        {results.length > 0 ? (
          results.map((user) => (
            <div
              key={user.id}
              className="col-md-4 mb-3"
              onClick={() => handleOpenProfile(user.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card shadow-sm h-100 text-center">
                <img
                  src={user.photoURL || dp}
                  alt={user.displayName}
                  className="card-img-top rounded-circle mx-auto mt-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{user.displayName}</h5>
                  <p className="card-text text-muted">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
