from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

MYSQL_HOST = os.getenv('MYSQL_HOST', 'db')
MYSQL_USER = os.getenv('MYSQL_USER', 'admin')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'mustafasMYSQL#123')
MYSQL_DB = os.getenv('MYSQL_DB', 'Gym_Application')

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




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
