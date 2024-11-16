# Use a lightweight Python image
FROM python:3.10-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Flask app
COPY . .

# Expose the port that Flask will run on
EXPOSE 8000

# Start the Flask app
CMD ["python", "app.py"]
