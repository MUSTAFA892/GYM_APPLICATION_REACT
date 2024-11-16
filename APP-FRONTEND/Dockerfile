# Use an official Node.js image as the base image
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Node.js image to serve the build folder
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install a lightweight HTTP server for serving the React app
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/build /app/build

# Expose the port that the server will run on (5000)
EXPOSE 5000

# Start the HTTP server to serve the React app on port 5000
CMD ["serve", "-s", "build", "-l", "5000"]
