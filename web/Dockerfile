FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install
COPY . .
RUN npm run build --workspace web

FROM nginx:1.27-alpine
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
