# Use Node.js 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

# Copy the rest of the source code

EXPOSE 4173

# Run the migration script
CMD ["npm", "run", "preview"]

