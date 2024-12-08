import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";  // Import js-cookie to handle cookies
import "../../assets/css/WorkoutForm.css";

const WorkoutForm = () => {
  const [formData, setFormData] = useState({
    numberOfWorkouts: 1,
    numberOfSets: 3,
    workoutsPerDay: {
      Monday: "Chest",
      Tuesday: "Lats",
      Wednesday: "Shoulders",
      Thursday: "Hamstrings",
      Friday: "Arms",
      Saturday: "Core",
      Sunday: "Rest",
    },
  });

  const [workoutPlan, setWorkoutPlan] = useState(null); // State to store the workout plan
  const [isLoading, setIsLoading] = useState(false); // Loading spinner
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Check if there is a saved workout plan in cookies and load it
    const savedWorkoutPlan = Cookies.get("workoutPlan");
    if (savedWorkoutPlan) {
      setWorkoutPlan(JSON.parse(savedWorkoutPlan)); // Parse the saved JSON data
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("workoutsPerDay")) {
      const day = name.split("-")[1];
      setFormData({
        ...formData,
        workoutsPerDay: {
          ...formData.workoutsPerDay,
          [day]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    const requestData = {
      numberOfWorkouts: formData.numberOfWorkouts,
      numberOfSets: formData.numberOfSets,
      workoutsPerDay: formData.workoutsPerDay, // Include the workouts per day selection
    };

    try {
      // Send request to your backend API
      const response = await axios.post("http://localhost:8000/api/generate-workout", requestData);
      const generatedPlan = response.data.plan; // Get the workout plan from the API

      setWorkoutPlan(generatedPlan); // Set the workout plan state

      // Save the workout plan to a cookie
      Cookies.set("workoutPlan", JSON.stringify(generatedPlan), { expires: 7 }); // Save for 7 days
    } catch (error) {
      setError("Failed to generate workout plan. Please try again.");
      console.error("Error fetching workout plan:", error);
    } finally {
      setIsLoading(false); // Turn off loading spinner
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      numberOfWorkouts: 1,
      numberOfSets: 3,
      workoutsPerDay: {
        Monday: "Chest",
        Tuesday: "Lats",
        Wednesday: "Shoulders",
        Thursday: "Hamstrings",
        Friday: "Arms",
        Saturday: "Core",
        Sunday: "Rest",
      },
    });
    setWorkoutPlan(null); // Clear the workout plan
    setError(null); // Clear error message

    // Remove the workout plan from the cookie
    Cookies.remove("workoutPlan");
  };

  // Render workout plan dynamically
  const renderWorkoutPlan = (plan) => {
    return Object.keys(plan).map((day, index) => {
      const workouts = plan[day];
      return (
        <div key={index} className="day-container">
          <h3>{day}</h3>
          {workouts.length > 0 ? (
            <table className="workout-table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Equipment</th>
                  <th>Body Part</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Rest Time</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={index}>
                    <td>{workout.exercise}</td>
                    <td>{workout.equipment}</td>
                    <td>{workout.bodypart}</td>
                    <td>{workout.sets}</td>
                    <td>{workout.reps}</td>
                    <td>{workout.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No exercises for today (Rest day)</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="full-screen-container">
      <div className="form-container">
        <h1>AI Workout Planner</h1>
        <p>Get personalized exercise plans tailored to your needs. Start your fitness journey today!</p>

        <form onSubmit={handleSubmit} className="workout-form">
          <div className="form-group">
            <label htmlFor="numberOfSets">Number of Sets</label>
            <input
              type="number"
              id="numberOfSets"
              name="numberOfSets"
              value={formData.numberOfSets}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
              className="input-field"
            />
          </div>

          {/* Add dropdowns for each day of the week */}
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day} className="form-group">
              <label htmlFor={`workoutsPerDay-${day}`}>{day}</label>
              <select
                id={`workoutsPerDay-${day}`}
                name={`workoutsPerDay-${day}`}
                value={formData.workoutsPerDay[day]}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Chest">Chest</option>
                <option value="Adductors">Adductors</option>
                <option value="Calves">Calves</option>
                <option value="Biceps">Biceps</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Abdominals">Abdominals</option>
                <option value="Forearms">Forearms</option>
                <option value="Hamstrings">Hamstrings</option>
                <option value="Lats">Lats</option>
                <option value="Lower Back">Lower Back</option>
                <option value="Middle Back">Middle Back</option>
                <option value="Traps">Traps</option>
                <option value="Neck">Neck</option>
                <option value="Quadriceps">Quadriceps</option>
                <option value="Triceps">Triceps</option>
                <option value="Rest">Rest</option>
              </select>
            </div>
          ))}

          <div className="form-buttons">
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? "Generating..." : "Generate Workout Plan"}
            </button>
            <button type="button" onClick={handleReset} className="reset-button">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Render workout plan dynamically */}
      {workoutPlan && (
        <div className="workout-plan-container">
          <h2>Your Workout Plan</h2>
          {renderWorkoutPlan(workoutPlan)}
        </div>
      )}
    </div>
  );
};

export default WorkoutForm;
