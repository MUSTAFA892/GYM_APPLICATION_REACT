import csv
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv()

# Get the API key from the environment variable
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API key not found. Please set GEMINI_API_KEY in the .env file.")

# Configure the Gemini API with the key
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

MYSQL_HOST = os.getenv('MYSQL_HOST', 'db')
MYSQL_USER = os.getenv('MYSQL_USER', 'admin')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'mustafasMYSQL#123')
MYSQL_DB = os.getenv('MYSQL_DB', 'Gym_Application')


#Gemini Connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB
        )
        return connection
    except mysql.connector.Error as err:
        return None

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    print(data)
    required_fields = ['First_Name', 'Last_Name', 'Email', 'Password', 'New_password']

    # Ensure all required fields are present
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    # Check if the passwords match
    if data['Password'] != data['New_password']:
        return jsonify({"error": "Passwords do not match"}), 400
    
    # Hash the password before saving it
    hashed_password = generate_password_hash(data['Password'], method='pbkdf2:sha256')


    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO user_authentication (First_Name, Last_Name, Email, Password, New_password)
            VALUES (%s, %s, %s, %s, %s)
        """, (data['First_Name'], data['Last_Name'], data['Email'], hashed_password, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    required_fields = ['Email', 'Password']
    
    # Ensure the necessary fields are provided
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM user_authentication WHERE Email = %s", (data['Email'],))
        user = cursor.fetchone()

        if user and check_password_hash(user['Password'], data['Password']):
            return jsonify({"success": True, "message": "Login successful"}), 200
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user_authentication;")
        users = cursor.fetchall()
        return jsonify(users), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/register_google', methods=['POST'])
def register_google_user():
    data = request.json
    print(data)
    required_fields = ['First_Name', 'Last_Name', 'Email', 'Password', 'New_password']

    # Ensure all required fields are present
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    # Check if the passwords match
    if data['Password'] != data['New_password']:
        return jsonify({"error": "Passwords do not match"}), 400
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO user_authentication (First_Name, Last_Name, Email, Password, New_password)
            VALUES (%s, %s, %s, %s, %s)
        """, (data['First_Name'], data['Last_Name'], data['Email'], data['Password'],data['Password']))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/login_with_google', methods=['POST'])
def login_google_user():
    data = request.json

    required_fields = ['Email', 'New_password']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM user_authentication WHERE Email = %s", (data['Email'],))
        user = cursor.fetchone()

        # Ensure all results are consumed to prevent unread result errors
        cursor.fetchall()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Check if the UID matches the stored New_Password
        if user['New_Password'] == data['New_password']:
            return jsonify({"success": True, "message": "Login successful"}), 200
        else:
            print("Password mismatch:", user['New_Password'], "vs", data['New_password'])
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/generate-workout', methods=['POST'])
def generate_workout():
    try:
        data = request.get_json()
        number_of_workouts = data.get('numberOfWorkouts', 1)
        workouts_per_day = data.get('workoutsPerDay', {})

        workout_plan = {}

        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        for day, body_part in workouts_per_day.items():
            if body_part == "Rest":
                workout_plan[day] = []  # No exercises for rest day
                continue

            # Query exercises based on the body part for each day
            cursor.execute("""
                SELECT title, description, body_part, equipment, level, rating, rating_desc
                FROM exercises
                WHERE body_part = %s
                ORDER BY RAND()
                LIMIT %s
            """, (body_part, 5))  # Randomly fetch 5 exercises for each day
  # Limit to 5 exercises for each day

            exercises = cursor.fetchall()

            if exercises:  # If exercises are found for the day
                workout_plan[day] = []
                for exercise in exercises:
                    workout_plan[day].append({
                        "exercise": exercise[0],
                        "equipment" : exercise[3],
                        "bodypart" : exercise[2],    # title
                        "sets": 3,  # example number of sets
                        "reps": 10,  # example number of reps
                        "rest": "60s",  # example rest time
                    })
            else:
                workout_plan[day] = []  # If no exercises are found, mark as empty

        # Close the database connection
        cursor.close()
        connection.close()

        return jsonify({"plan": workout_plan}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# To add the data into the db from the excel
@app.route('/api/import-csv', methods=['POST'])
def import_csv():
    try:
        # Specify the path to your CSV file
        csv_file_path = 'megaGymDataset_m.csv'  # Update this to the actual path of your CSV file

        # Establish connection to MySQL
        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500

        cursor = connection.cursor()

        # Open the CSV file and read it
        with open(csv_file_path, 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row (if your CSV has headers)
            
            # Iterate over each row in the CSV and insert into MySQL
            for row in reader:
                cursor.execute(
                    """
                    INSERT INTO exercises (id,title, description, type, body_part, equipment, level, rating, rating_desc)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)
                    """,
                    row
                )
        
        # Commit changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"message": "CSV data imported successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
@app.route('/api/gemini-response', methods=['POST'])
def generate_response():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        user_prompt = data.get('prompt', '')  # Get the prompt from the request

        if not user_prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Initialize the model
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        # Generate content using the user's prompt
        response = model.generate_content(user_prompt)

        # If the response contains text, return it
        if response.text:
            return jsonify({"response": response.text}), 200
        else:
            return jsonify({"error": "No response from the model"}), 500

    except Exception as e:
        # Catch any exceptions and return a 500 error with the exception message
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
