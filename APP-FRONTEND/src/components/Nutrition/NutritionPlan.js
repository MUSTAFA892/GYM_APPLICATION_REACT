import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/NutritionPlan.css"; // You can create your own styles or use existing ones

const NutritionPlan = () => {
  // State variables for the inputs
  const [goal, setGoal] = useState(""); // Bulking or Cutting
  const [timeRange, setTimeRange] = useState(""); // Week or Month
  const [budget, setBudget] = useState(""); // Expensive, Normal, or Mid
  const [nutritionPlan, setNutritionPlan] = useState(null); // Fetched nutrition plan
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(""); // For any potential errors

  // Function to fetch the nutrition plan from the backend
  const handleFetchNutritionPlan = async () => {
    if (!goal || !timeRange || !budget) {
      alert("Please fill out all fields!");
      return;
    }
    setLoading(true);
    setError(""); // Reset error state

    try {
      // Constructing the dynamic prompt for fetching nutrition data
      const prompt = `Can you give me a nutrition plan for a ${goal} user with a ${budget} budget for ${timeRange}? Please provide the meal's carbs, protein, fat, and calories like this format: protein: 10g, carbs: 30g, fat: 10g, calories: 250.`;

      // Sending the request with the user inputs as part of the prompt
      const response = await axios.post("http://127.0.0.1:8000/api/gemini-response", {
        prompt,
      });

      // Assuming the response contains the generated nutrition plan text
      const { response: generatedText } = response.data;

      // Parse the nutrition info from the generated response
      const nutritionPlanData = parseNutritionInfoForPlan(generatedText);

      // If the data is correctly fetched, set it to the state
      setNutritionPlan(nutritionPlanData);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch nutrition plan. Please try again!"); // Handle errors
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Helper function to parse the nutrition data for each meal
  const parseNutritionInfoForPlan = (text) => {
    const meals = text.split("\n"); // Split by each meal if they are provided line by line

    return meals.map((meal) => {
      const nutritionInfo = {
        dish: meal.split(":")[0], // Assuming the first part of the line is the dish name
        carbs: "",
        protein: "",
        fat: "",
        calories: "",
      };

      // Parse nutrition values using regex
      const carbsMatch = meal.match(/carbs\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
      const proteinMatch = meal.match(/protein\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
      const fatMatch = meal.match(/fat\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
      const caloriesMatch = meal.match(/calories\s*[:\-\s]*(\d+(?:\.\d+)?)(?:\s*(kcal|calories?))?/i);

      if (carbsMatch) nutritionInfo.carbs = carbsMatch[1];
      if (proteinMatch) nutritionInfo.protein = proteinMatch[1];
      if (fatMatch) nutritionInfo.fat = fatMatch[1];
      if (caloriesMatch) nutritionInfo.calories = caloriesMatch[1];

      return nutritionInfo;
    });
  };

  return (
    <div className="nutrition-plan-wrapper">
      <div className="nutrition-plan">
        <h2>Nutrition Plan</h2>

        <div className="input-section">
          {/* Select Goal (Bulking or Cutting) */}
          <select onChange={(e) => setGoal(e.target.value)} value={goal}>
            <option value="">Select Goal</option>
            <option value="bulking">Bulking</option>
            <option value="cutting">Cutting</option>
          </select>

          {/* Select Time Range (Week or Month) */}
          <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
            <option value="">Select Time Range</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>

          {/* Select Budget (Expensive, Normal, Mid) */}
          <select onChange={(e) => setBudget(e.target.value)} value={budget}>
            <option value="">Select Budget</option>
            <option value="expensive">Expensive</option>
            <option value="normal">Normal</option>
            <option value="mid">Mid</option>
          </select>

          {/* Button to fetch the nutrition plan */}
          <button onClick={handleFetchNutritionPlan} disabled={loading}>
            {loading ? "Fetching..." : "Get Nutrition Plan"}
          </button>
        </div>

        {/* Display error if any */}
        {error && <p className="error">{error}</p>}

        {/* Display the nutrition plan in a table if it exists */}
        {nutritionPlan && !loading && (
          <div className="nutrition-plan-table">
            <h3>Nutrition Plan for {goal} ({timeRange}) - Budget: {budget}</h3>
            <table>
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Carbs (g)</th>
                  <th>Protein (g)</th>
                  <th>Fat (g)</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {nutritionPlan.map((meal, index) => (
                  <tr key={index}>
                    <td>{meal.dish}</td>
                    <td>{meal.carbs}</td>
                    <td>{meal.protein}</td>
                    <td>{meal.fat}</td>
                    <td>{meal.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPlan;
