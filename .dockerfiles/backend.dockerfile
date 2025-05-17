FROM node:23-alpine AS builder

WORKDIR /app

COPY backend/package.json ./
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./

RUN ["npm", "install", "--legacy-peer-deps"]

COPY backend/src ./src

RUN npm run build


FROM node:23-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "start" ]