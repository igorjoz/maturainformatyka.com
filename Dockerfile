FROM node:22-alpine AS build

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY astro.config.mjs tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY images/ ./images/
RUN npm run check && npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
