// src/pages/EditProfile.jsx

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1.5px solid #ccc",
  borderRadius: "0",
  padding: "8px 4px",
  fontSize: "15px",
  backgroundColor: "transparent",
  outline: "none",
};

const labelStyle = {
  fontSize: "13px",
  color: "#666",
  marginBottom: "6px",
  display: "block",
};

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    photoURL: "",
    email: "",
    dob: "",
    currentReading: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFormData({ ...formData, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL: formData.photoURL,
        currentReading: formData.currentReading,
        dob: formData.dob,
        updatedAt: new Date(),
      });

      navigate(`/profile/`);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!user) return <p className="text-center mt-5">Please login</p>;
  if (loading) return <Loading />;

  return (
    <div className="container my-5" style={{ maxWidth: "520px" }}>
      <h3 className="text-center mb-4 fw-semibold">Edit Profile</h3>

      <form onSubmit={handleSave}>
        {/* Display Name */}
        <div className="mb-4">
          <label style={labelStyle}>Display Name</label>
          <input
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Email (read-only recommendation) */}
        <div className="mb-4">
          <label style={labelStyle}>Email</label>
          <input
            value={formData.email}
            style={{ ...inputStyle, color: "#999" }}
            disabled
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label style={labelStyle}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Photo URL */}
        <div className="mb-4">
          <label style={labelStyle}>Profile Photo URL</label>
          <input
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="https://"
            style={inputStyle}
          />
        </div>

        {/* Current Reading */}
        <div className="mb-5">
          <label style={labelStyle}>Currently Reading</label>
          <input
            name="currentReading"
            value={formData.currentReading}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <button className="btn btn-dark w-100 py-2">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
