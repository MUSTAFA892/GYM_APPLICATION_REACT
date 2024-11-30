import React, { useState } from "react";
import { signInWithPopup, auth, googleProvider,appleProvider } from "../../firebase";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Link, Divider } from "@mui/material";
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa"; // For icons
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Typography } from '@mui/material';
import gymimage from '../../assets/images/gym.jpg'
// Styled Components
const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
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
  padding: "30px"
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


const AppleButton = styled("button")({
  backgroundColor: "#000000", // Apple's signature black color
  color: "white", // White apple logo or text
  borderRadius: "50%", // Circular button
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  marginBottom: "20px",
  transition: "background-color 0.3s ease, transform 0.2s ease",
  "&:hover": {
    backgroundColor: "#333333", // Slightly lighter black for hover
  },
  "&:active": {
    transform: "scale(0.95)", // Button "press" effect
  },
});


const inputStyles = {
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  background: "rgba(255, 255, 255, 0.2)"
};

const errorStyles = {
  color: "red",
  fontSize: "12px",
  marginTop: "-8px",
};

// Animation settings for framer-motion
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

const Register = () => {
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Password: "",
    New_password: "",
  });
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Password: "",
    New_password: "",
  });

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
        Last_Name: user.displayName,
        Email: user.email,
        Password: user.uid,
        New_password: user.uid,
      };

      // Send user data to your Flask backend
      const response = await fetch("http://localhost:8000/api/register_google", {
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

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form before sending request
    const newErrors = {};
    if (!formData.First_Name) newErrors.First_Name = "First name is required";
    if (!formData.Last_Name) newErrors.Last_Name = "Last name is required";
    if (!formData.Email) newErrors.Email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.Email)) newErrors.Email = "Email is invalid";
    if (!formData.Password) newErrors.Password = "Password is required";
    if (formData.Password !== formData.New_password) newErrors.New_password = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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

  // const handleAppleRegister = async () => {
  //   try {
  //     // Trigger Apple Sign-In using the Firebase auth and appleProvider
  //     const result = await auth.signInWithPopup(appleProvider);
  //     const user = result.user;
  
  //     // Prepare the user data for your backend
  //     const userData = {
  //       First_Name: user.displayName || "Unknown",
  //       Last_Name: user.displayName || "Unknown",
  //       Email: user.email,
  //       UID: user.uid,
  //     };
  
  //     // Send user data to your backend for registration
  //     const response = await fetch("http://localhost:8000/api/register_with_apple", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData),
  //     });
  
  //     if (response.ok) {
  //       console.log("Apple Registration Successful");
  //     } else {
  //       console.error("Failed to register with Apple");
  //     }
  //   } catch (error) {
  //     console.error("Error with Apple Registration:", error);
  //   }
  // };
  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <RootStyle 
    style={{
      height: "100vh", // Full screen height
      backgroundImage: `url(${gymimage})`, // Use the imported image for background
      backgroundSize: "cover",  // Make the image cover the entire area
      backgroundPosition: "center",  // Position the image at the center
    }}>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...fadeInUp}>
            <Typography variant="h4" component="div" sx={{ color: "#333" }}>
              Register
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Enter your details below.
            </Typography>
          </HeadingStyle>

          {/* Google Registration Button */}
          <Typography component={motion.div} {...fadeInUp}>
            <GoogleButton onClick={handleGoogleRegister}>
              <FaGoogle style={{ fontSize: "24px" }} />
            </GoogleButton>
            {/* <AppleButton >
            <FaApple style={{ fontSize: "24px" }} />
          </AppleButton> */}
          </Typography>

          <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              OR
            </Typography>
          </Divider>

          <Box component={motion.div} {...fadeInUp}>
            {/* Registration Form */}
            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="First_Name"
                placeholder="First Name"
                value={formData.First_Name}
                onChange={handleChange}
                required
                style={inputStyles}
              />
              {errors.First_Name && <p style={errorStyles}>{errors.First_Name}</p>}

              <input
                type="text"
                name="Last_Name"
                placeholder="Last Name"
                value={formData.Last_Name}
                onChange={handleChange}
                required
                style={inputStyles}
              />
              {errors.Last_Name && <p style={errorStyles}>{errors.Last_Name}</p>}

              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                style={inputStyles}
              />
              {errors.Email && <p style={errorStyles}>{errors.Email}</p>}

              <div style={{ position: "relative" }}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="Password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                  style={inputStyles}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.Password && <p style={errorStyles}>{errors.Password}</p>}

              <div style={{ position: "relative" }}>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="New_password"
                  placeholder="Confirm Password"
                  value={formData.New_password}
                  onChange={handleChange}
                  required
                  style={inputStyles}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.New_password && <p style={errorStyles}>{errors.New_password}</p>}

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
                Register
              </button>
            </form>
          </Box>

          {message && <p style={{ color: "green",textAlign:'center' }}>{message}</p>}

          <Typography
            component={motion.p}
            {...fadeInUp}
            variant="body2"
            align="center"
            sx={{ color: "text.secondary", mt: 2 }}
          >
            Already have an account?{" "}
            <Link variant="subtitle2" component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
          <Typography
            component={motion.p}
            {...fadeInUp}
            variant="body2"
            align="center"
            sx={{ color: "text.secondary", mt: 2 }}
          >
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

export default Register;
