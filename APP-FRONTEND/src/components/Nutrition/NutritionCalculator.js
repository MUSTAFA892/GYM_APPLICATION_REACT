import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/NutritionCalculator.css";

const NutritionCalculator = () => {
  const [dish, setDish] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [calories, setCalories] = useState("");
  const [dailySummary, setDailySummary] = useState([]);
  const [total, setTotal] = useState({ carbs: 0, protein: 0, fat: 0, calories: 0 });
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  console.log(GEMINI_API_KEY)
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

  const handleFetchNutrition = async () => {
    if (!dish) {
      alert("Please enter a dish name!");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativeai.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText",
        {
          instances: [{ prompt: `Give me the nutritional values for ${dish}` }],
        },
        {
          headers: {
            Authorization: `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const generatedText = data.candidates[0]?.text || "";

      // Parse nutritional information from the response
      const nutritionInfo = parseNutritionInfo(generatedText);
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

  const parseNutritionInfo = (text) => {
    // Implement a parser for AI-generated text if needed
    return { carbs: "", protein: "", fat: "", calories: "" };
  };

  const handleReset = () => {
    setDailySummary([]);
    setTotal({ carbs: 0, protein: 0, fat: 0, calories: 0 });
  };

  return (
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
    </div>
  );
};

export default NutritionCalculator;
