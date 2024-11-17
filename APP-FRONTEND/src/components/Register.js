// src/pages/Register.js
import React, { useState } from "react";
import { signInWithPopup, auth, googleProvider } from "../firebase";


const Register = () => {
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Password: "",
    New_password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepare user data for MySQL
      const userData = {
        First_Name: user.displayName,
        Last_Name: user.displayName, // Using the same name for Last_Name
        Email: user.email,
        Password: user.uid,
        New_password: user.uid // Using UID instead of password
      };
      // Send user data to your Flask backend
      const response = await fetch("http://localhost:8000/api/register_google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log(response)
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="First_Name"
          placeholder="First Name"
          value={formData.First_Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Last_Name"
          placeholder="Last Name"
          value={formData.Last_Name}
          onChange={handleChange}
          required
        />
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
        <input
          type="password"
          name="New_password"
          placeholder="Confirm Password"
          value={formData.New_password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}

      <button onClick={handleGoogleRegister}>Register with Google</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
