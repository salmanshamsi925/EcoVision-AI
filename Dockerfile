# ==============================================================================
# EcoVision-AI: Multi-Stage Production Dockerfile for Render Deployment
# ==============================================================================

# Stage 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend + Static Files
FROM python:3.11-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source, data, and compiled frontend assets
COPY backend/ ./backend/
COPY data/ ./data/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Default port for Render is 10000 or defined by $PORT
ENV PORT=10000
EXPOSE 10000

# Start Unified FastAPI Server (serves both API & Frontend SPA)
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
