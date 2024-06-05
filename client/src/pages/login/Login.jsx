import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { usePopup } from "../../components/popupcontext/PopupContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { handleClosePopup } = usePopup();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      const { token, ...user } = res.data;
      localStorage.setItem("currentUser", JSON.stringify({ ...user, token }));
      handleClosePopup();
      navigate("/dashboard"); // Redirect to dashboard or any other page after login
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in to your account</h1>
        <p>Don't have an account? <Link to="/register">Join Here</Link></p>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p>Invalid Login Details</p>}
      </form>
      <div className="terms">
        <p>By joining, you agree to the USMTalent Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</p>
      </div>
    </div>
  );
}

export default Login;
