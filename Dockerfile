# Task 2: Dockerizing the Data Processing Application
# Task 5: Multi-stage build for optimized image size

# Stage 1: Builder stage - compile and build dependencies
FROM python:3.9-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy production requirements
COPY requirements-prod.txt .

# Install dependencies and build wheels
RUN pip install --no-cache-dir --user -r requirements-prod.txt

# Stage 2: Runtime stage - minimal production image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /root/.local /root/.local

# Update PATH to use user-installed packages
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY src/ ./src/
# Note: data/ is not copied - mount via volume or use cloud storage
# For local testing: docker run -v $(pwd)/data:/app/data

# Create output directories
RUN mkdir -p outputs/visualizations outputs/results

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "src/data_analysis.py"]

# Build instructions:
# docker build -t diet-analysis .
# docker run -it -v $(pwd)/data:/app/data -v $(pwd)/outputs:/app/outputs diet-analysis