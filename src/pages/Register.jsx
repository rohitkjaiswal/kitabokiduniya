import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import cover from "../assets/cover.webp";

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    gender: "",
    dob: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- CREATE USER DOC (COMMON) ---------- */
  const createUserProfile = async (user, provider) => {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName:
        form.displayName || user.displayName || user.email.split("@")[0],
      photoURL: user.photoURL || "",
      gender: form.gender || "",
      dob: form.dob || "",
      bio: "",
      currentReading: "",
      authProvider: provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  /* ---------- EMAIL REGISTER ---------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await register(form.email, form.password);
      await createUserProfile(cred.user, "password");
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GOOGLE REGISTER ---------- */
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const cred = await googleLogin();
      await createUserProfile(cred.user, "google");
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <img src={cover} alt="logo" className="auth-logo" />

      <h4 className="text-center mb-3">
        {step === 1 ? "Create account" : "Complete profile"}
      </h4>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            className="input-underline"
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
            required
          />

          <input
            className="input-underline mt-3"
            placeholder="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-dark w-100 mt-4"
            onClick={() => setStep(2)}
          >
            Continue
          </button>

          <div className="divider">or</div>

          <button
            className="btn btn-outline-dark w-100"
            onClick={handleGoogle}
            disabled={loading}
          >
            Continue with Google
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleRegister}>
          <input
            className="input-underline"
            placeholder="Display name"
            name="displayName"
            onChange={handleChange}
          />

          <select
            className="input-underline mt-3"
            name="gender"
            onChange={handleChange}
          >
            <option value="">Gender (optional)</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            className="input-underline mt-3"
            name="dob"
            onChange={handleChange}
          />

          <button
            className="btn btn-dark w-100 mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating…" : "Finish"}
          </button>
        </form>
      )}

      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>

      {/* STYLES */}
      <style>{`
        .auth-card {
          max-width: 420px;
          margin: 80px auto;
          padding: 30px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .auth-logo {
          width: 70px;
          display: block;
          margin: 0 auto 10px;
        }

        .input-underline {
          width: 100%;
          border: none;
          border-bottom: 2px solid #ddd;
          padding: 10px 4px;
          font-size: 15px;
        }

        .input-underline:focus {
          outline: none;
          border-bottom-color: #000;
        }

        .divider {
          text-align: center;
          margin: 15px 0;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default Register;
