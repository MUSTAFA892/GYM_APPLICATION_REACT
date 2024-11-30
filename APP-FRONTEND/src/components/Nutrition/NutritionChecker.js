import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/NutritionChecker.css';

const NutritionChecker = () => {
  const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    setRecipes([]);
    try {
      const options = {
        method: 'GET',
        url: 'https://myfitnesspal2.p.rapidapi.com/searchByKeyword',
        params: { keyword, page: '1' },
        headers: {
          'x-rapidapi-key': 'cdb738cfdemsh0e73ab99eafa4a0p1e14bfjsnc767eb470c88',
          'x-rapidapi-host': 'myfitnesspal2.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      setRecipes(response.data || []); // Ensure the response is correctly formatted
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nutrition-checker">
      <h3 style={{
        marginBottom: '20px',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#4c6ef5',
        textAlign: 'center',
        fontFamily: "'Roboto', sans-serif"
        }}>Nutrition Recipe Checker</h3>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a keyword (e.g., Oreo)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={fetchRecipes} disabled={loading || !keyword.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Table Display for Recipes */}
      <div className="table-container">
        {recipes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Brand</th>
                <th>Serving Size</th>
                <th>Calories</th>
                <th>Fat (g)</th>
                <th>Carbs (g)</th>
                <th>Protein (g)</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                <tr key={index}>
                  <td>{recipe.name}</td>
                  <td>{recipe.brand}</td>
                  <td>{recipe.nutrition['Serving Size']}</td>
                  <td>{recipe.nutrition['Calories']}</td>
                  <td>{recipe.nutrition['Fat']}</td>
                  <td>{recipe.nutrition['Carbs']}</td>
                  <td>{recipe.nutrition['Protein']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recipes found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
};

export default NutritionChecker;
