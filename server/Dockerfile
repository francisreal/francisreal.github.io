FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install
COPY . .
RUN npm run prisma:generate --workspace server && npm run build --workspace server

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/server/package*.json ./server/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma
CMD ["sh", "-c", "cd server && npx prisma db push && node dist/index.js"]
