import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/NutritionCalculator.css";

const NutritionCalculator = () => {
  const [dish, setDish] = useState("");  // Dish name entered by the user
  const [carbs, setCarbs] = useState("");  // Carbs fetched from backend
  const [protein, setProtein] = useState("");  // Protein fetched from backend
  const [fat, setFat] = useState("");  // Fat fetched from backend
  const [calories, setCalories] = useState("");  // Calories fetched from backend
  const [dailySummary, setDailySummary] = useState([]);  // Summary of meals added by the user
  const [total, setTotal] = useState({ carbs: 0, protein: 0, fat: 0, calories: 0 });  // Total nutritional values
  const [loading, setLoading] = useState(false);  // Loading state for the API request

  // Function to add a meal with manually input nutritional values
  const handleAddMeal = () => {
    if (!dish || !carbs || !protein || !fat || !calories) {
      alert("Please fill all fields!");
      return;
    }

    const meal = {
      dish,
      carbs: parseFloat(carbs),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      calories: parseFloat(calories),
    };

    setDailySummary([...dailySummary, meal]);
    setTotal({
      carbs: total.carbs + meal.carbs,
      protein: total.protein + meal.protein,
      fat: total.fat + meal.fat,
      calories: total.calories + meal.calories,
    });

    setDish("");
    setCarbs("");
    setProtein("");
    setFat("");
    setCalories("");
  };

  // Function to fetch nutritional data based on the dish name
  const handleFetchNutrition = async () => {
    if (!dish) {
      alert("Please enter a dish name!");
      return;
    }
    setLoading(true);

    try {
      // Sending the dish name as a prompt to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/gemini-response",  // Flask API endpoint
        {
          prompt: `Can u give me the nutrition values of ${dish} like carbs , protein , fat, Calories Note = dont give me full senftence just example protein : 10g like this only give me this 4 values no other words or sentence, also dont give me the values as ex:- 20-30, like dont give me range values`,  // Sending dynamic prompt
        }
      );
 
      // Assuming the response contains the generated text from the AI
      const { response: generatedText } = response.data;

      // Automatically parse nutritional information from the response
      const nutritionInfo = parseNutritionInfo(generatedText);

      // Set state values for carbs, protein, fat, and calories from the parsed info
      setCarbs(nutritionInfo.carbs || "");
      setProtein(nutritionInfo.protein || "");
      setFat(nutritionInfo.fat || "");
      setCalories(nutritionInfo.calories || "");
    } catch (error) {
      console.error(error);
      alert("Failed to fetch nutritional data. Try again!");
    }

    setLoading(false);
  };

  // Function to parse the nutritional values from the AI's generated text
// Function to parse the nutritional values from the AI's generated text
const parseNutritionInfo = (text) => {
  const nutritionInfo = {
    carbs: "",
    protein: "",
    fat: "",
    calories: ""
  };

  // Updated regex for matching values with or without units (for calories)
  const carbsMatch = text.match(/Carbs\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
  const proteinMatch = text.match(/Protein\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
  const fatMatch = text.match(/Fat\s*[:\-\s]*(\d+(?:\.\d+)?)\s*(g|g\w*)/i);
  
  // Modify the regex to handle cases where the "Calories" value may not have units
  const caloriesMatch = text.match(/Calories\s*[:\-\s]*(\d+(?:\.\d+)?)(?:\s*(kcal|calories?))?/i);



  if (carbsMatch) nutritionInfo.carbs = carbsMatch[1];
  if (proteinMatch) nutritionInfo.protein = proteinMatch[1];
  if (fatMatch) nutritionInfo.fat = fatMatch[1];
  if (caloriesMatch) nutritionInfo.calories = caloriesMatch[1];

  return nutritionInfo;
};



  // Function to reset the daily summary and total values
  const handleReset = () => {
    setDailySummary([]);
    setTotal({ carbs: 0, protein: 0, fat: 0, calories: 0 });
  };

  return (
    <div className="nutrition-calculator-wrapper">
      <div className="nutrition-calculator">
        <h2>Nutrition Calculator</h2>
        <div className="input-section">
          <input
            type="text"
            placeholder="Dish/Food Name"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
          />
          <button onClick={handleFetchNutrition} disabled={loading}>
            {loading ? "Fetching..." : "Get Nutrition"}
          </button>
          <input
            type="number"
            placeholder="Carbs (g)"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <button onClick={handleAddMeal}>Add Meal</button>
        </div>
        <div className="summary-section">
          <h3>Daily Summary</h3>
          {dailySummary.length === 0 ? (
            <p>No meals added yet.</p>
          ) : (
            <ul>
              {dailySummary.map((meal, index) => (
                <li key={index}>
                  {meal.dish}: {meal.carbs}g Carbs, {meal.protein}g Protein, {meal.fat}g Fat, {meal.calories} Calories
                </li>
              ))}
            </ul>
          )}
          <h4>Total</h4>
          <p>
            Carbs: {total.carbs}g | Protein: {total.protein}g | Fat: {total.fat}g | Calories: {total.calories}
          </p>
          <button onClick={handleReset}>Reset</button>
        </div>
  
        {/* Display the fetched nutrition data automatically */}
        {carbs && (
          <div className="fetched-nutrition">
            <h3>Fetched Nutrition for {dish}</h3>
            <p>Carbs: {carbs}g</p>
            <p>Protein: {protein}g</p>
            <p>Fat: {fat}g</p>
            <p>Calories: {calories} kcal</p>
          </div>
        )}
      </div>
    </div>
  );
  };

export default NutritionCalculator;
