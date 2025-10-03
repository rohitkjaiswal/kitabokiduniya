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
    email:'',
    dob:'',
    currentReading:'',

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
        dob:new Date(),
        currentReading:formData.currentReading,
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
    <div className="container-fluid mt-6 px-4 p-5 my-5" style={{color:"pink"}}>
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Edit Profile</h2>
      <form className="max-w-lg mx-auto" onSubmit={handleSave}>
        <div className="mb-3 m-5">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-control p-1 "
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your name"
           style={{color:'gray'}} autoFocus/>
        </div>

        <div className="mb-3 m-5">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control p-3"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Change email"
           style={{color:'gray'}}  spellCheck='false'/>
        </div>

        <div className="mb-3 m-5">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control p-2"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            rows="3"
          style={{color:'gray'}}/>
        </div>

        <div className="mb-3 m-5">
          <label className="form-label">Date of birth</label>
          <input
            type="date"
            className="form-control p-2"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            
          style={{color:'gray'}}/>
        </div>

        <div className="mb-3 m-5">
          <label className="form-label">Profile Picture URL</label>
          <input
            type="text"
            className="form-control p-2"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Paste image link"
          style={{color:'gray'}}/>
        </div>

        <div className="mb-3 m-5">
          <label className="form-label">What are you reading currently?</label>
          <input
            type="text"
            className="form-control p-2"
            name="currentReading"
            value={formData.currentReading}
            onChange={handleChange}
            placeholder="Write your current read"
          style={{color:'gray'}}/>
        </div>



        <button type="submit" className="btn btn-outline-secondary m-1 w-100" >
          💾 Save Changes
        </button>
       
      </form>
    </div>
  );
};

export default EditProfile;
