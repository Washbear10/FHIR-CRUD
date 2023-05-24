# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine as develop
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Set the env to "production"
ENV NODE_ENV production
ENV REACT_APP_FHIRBASE="https://fhir-ui.misit-augsburg.de/fhir-server/api/v4"
ENV REACT_APP_FHIRBASE_DIRECT="https://fhir-ui.misit-augsburg.de/direct/"
ENV REACT_APP_MAX_ATTACHMENT_SIZE=10000000  
# Build the app
RUN npm run build




#remove node_modules
#RUN rm -rf node_modules
#RUN rm -rf src
# ==== RUN =======

#RUN serve -s build


# Start the app
# CMD [ "npm", "start"]



FROM node:16-alpine
WORKDIR /app
copy --from=develop /app/build /app/build

# Expose the port on which the app will be running (3000 is the default that `serve` uses)


EXPOSE 3000
RUN npm install -g serve
CMD ["serve", "-s", "build"]