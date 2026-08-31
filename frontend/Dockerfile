# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# REACT_APP_API_URL is baked in at build time (Create React App requirement).
# Override at build time with: docker build --build-arg REACT_APP_API_URL=http://localhost:8000 .
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# --- Serve stage ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
