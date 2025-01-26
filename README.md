
---

# Gym Application

This project is a **Gym Application** that helps users manage their workout plans, nutrition, and recipes. It includes AI-powered features like a **Workout Planner**, **Nutrition Tracker**, and **Recipe Maker**. The application is built using **React** for the frontend, **Flask** for the backend, and **SQL** for database management. The entire application is containerized using **Docker** for easy deployment.

---

## Features

- **Workout Planner**: AI-driven feature that suggests personalized workout plans based on user preferences and goals.
- **Nutrition Tracker**: Track your daily intake of calories, macronutrients, and more, with suggestions for meeting your nutrition goals.
- **Recipe Maker**: Suggests recipes based on available ingredients or dietary preferences, helping users create healthy meals.
- **User Authentication**: Users can sign up, log in, and maintain their profile information.
- **Data Storage**: SQL database to store user profiles, workout plans, nutrition logs, and recipes.
- **Dockerized**: The entire application is packaged in Docker containers for easy setup and deployment.

---

## Technologies Used

- **Frontend**: React.js, JavaScript (ES6+), CSS (with Material-UI or Bootstrap)
- **Backend**: Flask (Python)
- **Database**: SQL (PostgreSQL or MySQL)
- **Containerization**: Docker
- **AI Features**: AI models for workout recommendations, nutrition tracking, and recipe suggestions.
- **Other Libraries**: Axios for API requests, Flask-SQLAlchemy for database interaction, and more.

---

## Setup Instructions

### Prerequisites

- Python 3.x
- Node.js & npm
- Docker (for containerization)
- Database: PostgreSQL or MySQL (depending on your choice)

### Steps to Set Up:

#### 1. Clone the repository:
```bash
git clone https://github.com/your-username/gym-application.git
cd gym-application
```

#### 2. **Backend Setup (Flask)**

- Navigate to the `backend` directory:
  ```bash
  cd backend
  ```

- Create a virtual environment (optional but recommended):
  ```bash
  python3 -m venv venv
  source venv/bin/activate  # On Windows, use venv\Scripts\activate
  ```

- Install the required backend dependencies:
  ```bash
  pip install -r requirements.txt
  ```

- Set up the database:
  - Modify the database connection string in the `config.py` or `.env` file, depending on your setup.
  - Example for PostgreSQL:
    ```env
    DATABASE_URI=postgresql://username:password@localhost:5432/gym_app_db
    ```
  - Run database migrations (if using Flask-Migrate):
    ```bash
    flask db upgrade
    ```

- Run the Flask backend:
  ```bash
  flask run
  ```

The backend will be available at [http://localhost:5000](http://localhost:5000).

#### 3. **Frontend Setup (React)**

- Navigate to the `frontend` directory:
  ```bash
  cd ../frontend
  ```

- Install the required frontend dependencies:
  ```bash
  npm install
  ```

- Start the React development server:
  ```bash
  npm run dev
  ```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

#### 4. **Dockerized Setup**

- To run the entire application using Docker, navigate to the root of the project and build the Docker images:
  ```bash
  docker-compose build
  ```

- Once the images are built, you can run the containers:
  ```bash
  docker-compose up
  ```

This will start both the frontend and backend services in their respective containers, along with the SQL database.

---

## API Endpoints (Backend)

- **POST /login**: User login endpoint.
- **POST /register**: User registration endpoint.
- **GET /workout-plan**: Fetch the AI-generated workout plan based on user preferences.
- **POST /nutrition-track**: Track user’s daily nutrition intake.
- **GET /recipes**: Fetch recipe suggestions based on user preferences or available ingredients.

---

## License

MIT License

---
