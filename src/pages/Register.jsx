import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/"); // Redirect after registration
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", boxShadow: "10px 10px 20px rgba(0,0,0,0.1)", backgroundColor: "#f9f9f9", borderRadius: "10px" ,alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
     
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Register Icon"
          style={{ width: "70px", height: "70px", filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.1))" }}
        />
        
      <h2 style={{ textAlign: "center" }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required  style={{ width: "95%", padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}/>

        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{ width: "95%", padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}/>
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}>Register</button>
      </form>
      <p style={{ marginTop: "10px" }}>Already have an account? <a href="/login">Login</a></p>
    </div></>
  );
};

export default Register;
