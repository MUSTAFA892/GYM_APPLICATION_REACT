import React, { useState } from 'react';
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase'; // Import the necessary functions
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Register = () => {
  const [userData, setUserData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    New_Password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register', userData);
      console.log(response)
      if (response.data.success) {
        alert("Registration successful!");
        navigate('/login');
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userData = {
        First_Name: user.displayName.split(' ')[0],
        Last_Name: 'Tinwala',
        Email: user.email,
        Password: user.uid,
        New_Password : user.uid
        
      };
  
      // Send the user vto the Flask backend to insert it into the MySQL database
      try {
        const response = await axios.post('http://localhost:8000/api/register_google', userData);
        if (response.data.success) {
          console.log('User registered successfully');
        } else {
          console.log('User already exists');
        }
      } catch (error) {
        console.error('Error while registering user in backend:', error);
        alert('Failed to register user in the backend');
      }
  
      // Redirect to the main app/dashboard after successful login
      navigate('/main');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert("Google sign-in failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="First_Name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="Last_Name" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="Email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="Password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="New_Password" placeholder="New Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      <hr />

      <button onClick={handleGoogleSignIn}>Register with Google</button>
    </div>
  );
};

export default Register;
