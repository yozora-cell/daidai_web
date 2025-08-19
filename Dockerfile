# Base on offical Node.js Alpine image
FROM node:16

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
# RUN npm install --global yarn

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
# COPY ./package*.json ./

COPY ./*.* ./
COPY ./public ./public
COPY ./.next ./.next
COPY ./locale ./locale


# Copy all files
# COPY ./ ./


# Install dependencies
RUN yarn install --frozen-lockfile

# Build app
# RUN yarn build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "yarn", "start" ]
