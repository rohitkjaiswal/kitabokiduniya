import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const { login, googleLogin, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await googleLogin();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    if (!resetEmail) {
      setError("Please enter your email to reset password.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(resetEmail);
      setMessage("Password reset email sent.");
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <center>
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", boxShadow: "10px 10px 20px rgba(0,0,0,0.1)", alignItems: "center",justifyContent: "center", backgroundColor: "#f9f9f9" , borderRadius: "10px" ,flexWrap: "wrap",alignSelf: "center"}}> 
        <center>
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Login Icon"
          style={{ width: "70px", height: "70px", filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.1))" }}
        />
        <h2>Login</h2></center>
        {/* <div id="form-section"> */}

        {error && <p style={{ color: "red", fontSize: "14px" ,transform: "translateY(-5px)" }}>{alert("Invalid email or password")}</p>}
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
            style={{ width: "95%", padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}
          /> <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          style={{ width: "95%", padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}
          /> <br />
          <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} disabled={isLoading} style={{ width: "100%", padding: "10px", backgroundColor: "#db4437", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)", marginTop: "10px" }}>
          {isLoading ? "Processing..." : "Login with Google"}
        </button>

        <p>
          Forgot your password?{" "}
          <button onClick={() => setShowReset(!showReset)} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}>
            Reset Password
          </button>
        </p>

        {showReset && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: "95%", padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)" }}
            />
            <button onClick={handleResetPassword} disabled={isLoading} style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", boxShadow: "5px 5px 20px rgba(47, 138, 196, 0.1)", marginTop: "10px" }}>
              {isLoading ? "Sending..." : "Send Reset Email"}
            </button>
          </div>
        )}
      </div>
      </center>
    </div>
  );
};

export default Login;
