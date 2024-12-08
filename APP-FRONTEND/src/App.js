// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import Exercises from "./components/Exercises/Exercises"
import Form from "./components/Exercises/WorkoutForm"
import MainPage from "./components/MainPage/MainPage"
import NutritionChecker from "./components/Nutrition/NutritionChecker";
import NutritionCalculator from "./components/Nutrition/NutritionCalculator";
import NutritionPlan from "./components/Nutrition/NutritionPlan";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sample" element={<Exercises/>}/>
        <Route path="/exercises" element={<Form/>}/>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/nutrition-checker" element={<NutritionChecker/>}/>
        <Route path="/nutrition-calculator" element={<NutritionCalculator/>}/>
        <Route path="/nutrition-plan" element={<NutritionPlan/>}/>
      </Routes>
    </Router>
  );
}

export default App;
