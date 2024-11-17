// src/pages/Login.js
import React, { useState } from "react";
import { signInWithPopup, auth, googleProvider } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Redirect to the dashboard or home page on successful login
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepare user data for MySQL
      const userData = {
        Email: user.email,
        New_password: user.uid,
      };
      // Send user data to your Flask backend
      const response = await fetch("http://localhost:8000/api/login_with_google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Google Registration Error:", error);
      setMessage("Google Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="Password"
          placeholder="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
