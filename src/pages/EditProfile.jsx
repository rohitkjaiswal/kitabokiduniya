// src/pages/EditProfile.jsx

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch current profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setFormData((prev) => ({
            ...prev,
            ...snap.data(),
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL: formData.photoURL,
        updatedAt: new Date(),
      });
      alert("✅ Profile updated successfully!");
      navigate(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile.");
    }
  };

  if (!user) {
    return <p className="text-center mt-6">🛑 Please login to edit your profile.</p>;
  }

  if (loading) {
    return <p className="text-center mt-6">⏳ Loading profile...</p>;
  }

  return (
    <div className="container mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Edit Profile</h2>
      <form className="max-w-lg mx-auto" onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-control"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Picture URL</label>
          <input
            type="text"
            className="form-control"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Paste image link"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
