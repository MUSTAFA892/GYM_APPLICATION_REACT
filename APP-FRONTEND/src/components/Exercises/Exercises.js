import React, { useState } from "react";
import axios from "axios";

const ExerciseComponent = () => {
  const [muscle, setMuscle] = useState("biceps"); // Default muscle group
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false); // Track if speech is ongoing

  const fetchExercises = async () => {
    try {
      setError(null); // Reset error state
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
        {
          headers: { "X-Api-Key": "kgzMIpe5dCoCz6ZlWh6bTA==MiALObsZrVwDfvvW" }, // Replace with your API key
        }
      );
      setExercises(response.data);
    } catch (err) {
      setError(
        err.response
          ? `Error: ${err.response.status} - ${err.response.data}`
          : "An unexpected error occurred"
      );
      setExercises([]);
    }
  };

  const formatInstructions = (instructions) => {
    return instructions
      ? instructions
          .split(".")
          .filter((step) => step.trim().length > 0) // Filter out empty steps
          .map((step, index) => `Step ${index + 1} : ${step.trim()}`) // Add numbering
      : [];
  };

  const speakInstructions = (instructions) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = instructions;
    speech.lang = "en-US";
    speech.rate = 1; // Speed of speech
    speech.pitch = 1; // Pitch of speech
    speech.volume = 1; // Volume of speech
    speechSynthesis.speak(speech);
    setSpeaking(true); // Set speaking state to true
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel(); // Stop any ongoing speech
    setSpeaking(false); // Set speaking state to false
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Exercise Finder</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <label
          htmlFor="muscle"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
            fontSize: "16px",
          }}
        >
          Select Muscle Group:
        </label>
        <input
          type="text"
          id="muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
          placeholder="e.g., biceps, triceps, legs"
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            flex: 1,
          }}
        />
        <button
          onClick={fetchExercises}
          style={{
            padding: "8px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Fetch Exercises
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          <strong>{error}</strong>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Exercises:</h3>
        {exercises.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Responsive grid
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {exercises.map((exercise, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                }}
              >
                <h4 style={{ color: "#007BFF", marginBottom: "10px" }}>
                  {exercise.name}
                </h4>
                {exercise.gif_url && (
                  <div style={{ marginBottom: "10px" }}>
                    <img
                      src={exercise.gif_url}
                      alt={exercise.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
                <p>
                  <strong>Type:</strong> {exercise.type}
                </p>
                <p>
                  <strong>Equipment:</strong> {exercise.equipment}
                </p>
                <p>
                  <strong>Difficulty:</strong> {exercise.difficulty}
                </p>
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  {formatInstructions(exercise.instructions).map((step, i) => (
                    <li key={i} style={{ marginBottom: "5px" }}>
                      {step}
                    </li>
                  ))}
                </ul>
                <div>
                  {speaking ? (
                    <button
                      onClick={stopSpeaking}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#dc3545", // Red button for stop
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px",
                        width: "100%",
                      }}
                    >
                      Stop Speaking
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        speakInstructions(exercise.instructions)
                      }
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px",
                        width: "100%",
                      }}
                    >
                      Read Instructions Aloud
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>
            No exercises found. Try a different muscle group!
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciseComponent;
