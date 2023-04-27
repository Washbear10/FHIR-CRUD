# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine 
# Set the working directory to /app inside the container
WORKDIR /fhir-app
# Copy app files
COPY . .
# Set the env to "production"
ENV NODE_ENV production
ENV REACT_APP_FHIRBASE="https://localhost:9443/fhir-server/api/v4"
ENV REACT_APP_MAX_ATTACHMENT_SIZE=10000000  
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build



# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
#remove node_modules
RUN rm -rf node_modules
RUN rm -rf src
# ==== RUN =======
RUN npm install -g serve
CMD ["serve", "-s", "build"]
#RUN serve -s build


# Start the app
# CMD [ "npm", "start"]