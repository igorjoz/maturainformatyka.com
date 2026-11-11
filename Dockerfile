FROM node:22-alpine AS build

RUN apk add --no-cache python3

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY astro.config.mjs tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY images/ ./images/
COPY scripts/exam_archive.py ./scripts/exam_archive.py
COPY scripts/task_catalog.py ./scripts/task_catalog.py
COPY scripts/task_grading.py ./scripts/task_grading.py
COPY scripts/task_practice.py ./scripts/task_practice.py
COPY docs/task-grading-inventory/ ./docs/task-grading-inventory/
COPY docs/task-inventory/ ./docs/task-inventory/
COPY docs/exam-import-report.json ./docs/exam-import-report.json
RUN npm run check && npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
