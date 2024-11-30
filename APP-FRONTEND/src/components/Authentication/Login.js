import React, { useState } from "react";
import { signInWithPopup, auth, googleProvider } from "../../firebase";
import { Box, Container, Link, Divider, Typography } from "@mui/material";
import { FaGoogle } from "react-icons/fa"; // For Google icon
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import gymimage from "../../assets/images/gym.jpg"

// Styled Components (similar to Register.js)
const RootStyle = styled("div")({
  height: "100vh", // Full screen height
  backgroundImage: `url(${gymimage})`, // Use the imported image for background
  backgroundSize: "cover",  // Make the image cover the entire area
  backgroundPosition: "center",  // Position the image at the center
  display: "grid",
  placeItems: "center",
});

const ContentStyle = styled(Box)({
  maxWidth: 480,
  padding: "25px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
  borderRadius: "12px", // Rounded corners
  backdropFilter: "blur(10px)", // Apply frosted-glass effect
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow around the form
  color: "#fff", // Text color to stand out on the transparent background
  padding: "30px", // Add padding to the form container
});

const GoogleButton = styled("button")({
  backgroundColor: "#db4437",
  color: "white",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  marginBottom: "20px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#c1351d",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
});

const inputStyles = {
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  background: "rgba(255, 255, 255, 0.2)",
  "&::placeholder": {
    color: "#fff"
    },
};

const errorStyles = {
  color: "red",
  fontSize: "12px",
  marginTop: "-8px",
};

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};
const HeadingStyle = styled(Box)({
  textAlign: "center",
});

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
        window.location.href = "/";
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
        window.location.href = "/";
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setMessage("Google Login failed. Please try again.");
    }
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...fadeInUp}>
            <Typography variant="h4" component="div" sx={{ color: "#333", textAlign: "center" }}>
              Login
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 5, textAlign: "center" }}>
              Enter your email and password below.
            </Typography>
          </HeadingStyle>

          {/* Google Login Button */}
          <Typography component={motion.div} {...fadeInUp}>
            <GoogleButton onClick={handleGoogleLogin}>
              <FaGoogle style={{ fontSize: "24px" }} />
            </GoogleButton>
          </Typography>

          <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              OR
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component={motion.div} {...fadeInUp}>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                style={inputStyles}
              />

              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={formData.Password}
                onChange={handleChange}
                required
                style={inputStyles}
              />

              <button
                type="submit"
                style={{
                  ...inputStyles,
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
              >
                Login
              </button>
            </form>
          </Box>

          {/* Display message */}
          {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

          {/* Link to Register Page */}
          <Typography variant="body2" align="center" sx={{ color: "text.secondary", mt: 2 }}>
            Don't have an account?{" "}
            <Link variant="subtitle2" component={RouterLink} to="/register">
              Register
            </Link>
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: "text.secondary", mt: 2 }}>
            Go To Home Page{" "}
            <Link variant="subtitle2" component={RouterLink} to="/">
              Home
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default Login;
