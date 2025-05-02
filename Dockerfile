# Use the official Node.js image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Accept build args
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_API_DOMAIN
ARG NEXT_PUBLIC_WEBSITE_DOMAIN

# Export them into the environment so Next.js picks them up at build time
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_API_DOMAIN=${NEXT_PUBLIC_API_DOMAIN}
ENV NEXT_PUBLIC_WEBSITE_DOMAIN=${NEXT_PUBLIC_WEBSITE_DOMAIN}


# Copy the rest of the project files
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port (3000 is default for Next.js)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
