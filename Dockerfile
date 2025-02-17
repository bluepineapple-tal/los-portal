# Use the official Node.js image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port (3000 is default for Next.js)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
