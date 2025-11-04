# Task 2: Dockerizing the Data Processing Application
# Docker Lead: Customize this after data_analysis.py is ready

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
# Note: data/ is not copied - mount via volume or use cloud storage
# For local testing: docker run -v $(pwd)/data:/app/data

# Create output directories
RUN mkdir -p outputs/visualizations outputs/results

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# TODO: Update this command after data_analysis.py is implemented
CMD ["python", "src/data_analysis.py"]

# Build instructions:
# docker build -t diet-analysis .
# docker run -it diet-analysis

# For development with volume mounting:
# docker run -it -v $(pwd)/outputs:/app/outputs diet-analysis