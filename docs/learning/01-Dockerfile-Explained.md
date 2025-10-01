# Dockerfile Explained - Complete Guide

## What is a Dockerfile?

A Dockerfile is a text file containing instructions to build a Docker image. It's like a recipe that tells Docker how to create a container with your application and all its dependencies.

## Our Dockerfile Line-by-Line

```dockerfile
# Task 2: Dockerizing the Data Processing Application
# Docker Lead: Customize this after data_analysis.py is ready

FROM python:3.9-slim
```

**Explanation:**
- `FROM` specifies the base image to build upon
- `python:3.9-slim` is a lightweight Python 3.9 image (~50MB vs ~900MB for full Python)
- Every Dockerfile must start with a `FROM` instruction
- We use "slim" to reduce image size while keeping essential Python functionality

---

```dockerfile
# Set working directory
WORKDIR /app
```

**Explanation:**
- `WORKDIR` sets the working directory inside the container
- All subsequent commands will execute from `/app`
- If the directory doesn't exist, Docker creates it
- Similar to running `cd /app` on your terminal

---

```dockerfile
# Copy requirements first (for better caching)
COPY requirements.txt .
```

**Explanation:**
- `COPY` copies files from your local machine into the container
- `requirements.txt` is copied to `/app/requirements.txt` (the `.` means current WORKDIR)
- **Why copy requirements first?** Docker caches layers - if requirements.txt doesn't change, Docker reuses the cached layer, making rebuilds faster

---

```dockerfile
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
```

**Explanation:**
- `RUN` executes commands during the image build process
- `pip install` installs Python packages listed in requirements.txt
- `--no-cache-dir` prevents pip from caching downloaded packages, reducing image size
- `-r requirements.txt` tells pip to read packages from the file

---

```dockerfile
# Copy application code
COPY src/ ./src/
```

**Explanation:**
- Copies the entire `src/` directory from your local machine to `/app/src/` in the container
- We copy this AFTER installing dependencies so code changes don't invalidate the dependency cache
- The `./` means relative to WORKDIR (`/app`)

---

```dockerfile
# Note: data/ is not copied - mount via volume or use cloud storage
# For local testing: docker run -v $(pwd)/data:/app/data
```

**Explanation:**
- Comments explaining why we DON'T copy the data folder
- Large datasets shouldn't be baked into images (makes them huge and inflexible)
- Instead, we use volume mounts at runtime to provide data
- This separation follows the "12-factor app" principle of separating code from data

---

```dockerfile
# Create output directories
RUN mkdir -p outputs/visualizations outputs/results
```

**Explanation:**
- `mkdir -p` creates directories (the `-p` flag creates parent directories if needed and doesn't error if they exist)
- Creates directories where the application will save its output
- Done at build time to ensure directories always exist

---

```dockerfile
# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
```

**Explanation:**
- `ENV` sets environment variables inside the container
- `PYTHONPATH=/app` tells Python where to find modules (allows imports to work correctly)
- `PYTHONUNBUFFERED=1` forces Python to print output immediately (useful for logging in Docker)
- Without unbuffered mode, you might not see print statements in real-time

---

```dockerfile
CMD ["python", "src/data_analysis.py"]
```

**Explanation:**
- `CMD` specifies the default command to run when the container starts
- Uses JSON array format: `["executable", "arg1", "arg2"]`
- Can be overridden at runtime: `docker run my-image python other_script.py`
- Only the last `CMD` in a Dockerfile takes effect

---

## Key Docker Concepts

### 1. **Layers and Caching**
- Each instruction (`FROM`, `RUN`, `COPY`, etc.) creates a new layer
- Docker caches layers that haven't changed
- Order matters! Put things that change less frequently earlier in the file

### 2. **Image vs Container**
- **Image**: Read-only template (like a class in OOP)
- **Container**: Running instance of an image (like an object in OOP)
- One image can spawn many containers

### 3. **Build Context**
- When you run `docker build .`, the `.` is the build context
- Docker sends all files in this directory to the Docker daemon
- Use `.dockerignore` to exclude files you don't need

### 4. **Multi-stage Builds** (Not used here, but good to know)
- Use multiple `FROM` statements to create smaller final images
- Example: Build in one stage, copy only the compiled artifacts to final stage

---

## Common Docker Commands

```bash
# Build an image
docker build -t diet-analysis .

# Run a container
docker run -it diet-analysis

# Run with volume mounts
docker run -v $(pwd)/data:/app/data -v $(pwd)/outputs:/app/outputs diet-analysis

# List images
docker images

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Remove an image
docker rmi diet-analysis

# Remove a container
docker rm container-name

# View logs
docker logs container-name

# Execute command in running container
docker exec -it container-name bash
```

---

## Best Practices Used in Our Dockerfile

1. ✅ **Use slim base images** - Reduces attack surface and image size
2. ✅ **Copy dependencies file first** - Leverages layer caching
3. ✅ **Use .dockerignore** - Excludes unnecessary files
4. ✅ **Don't store data in images** - Use volumes instead
5. ✅ **Set PYTHONUNBUFFERED** - Better logging experience
6. ✅ **Create directories at build time** - Ensures they always exist
7. ✅ **Use specific Python version** - Reproducible builds

---

## Interview Questions (10)

### Question 1: What's the difference between `RUN`, `CMD`, and `ENTRYPOINT`?

**Answer:**
- `RUN`: Executes commands during **build time** and creates a new layer (e.g., installing packages)
- `CMD`: Specifies the default command to run at **container startup** (can be overridden)
- `ENTRYPOINT`: Also runs at startup but is **harder to override** (main container process)

Example:
```dockerfile
RUN pip install pandas        # Build time
CMD ["python", "app.py"]      # Runtime (default)
ENTRYPOINT ["python"]         # Runtime (fixed)
CMD ["app.py"]                # Runtime (can override this part)
```

---

### Question 2: Why do we copy `requirements.txt` before copying the application code?

**Answer:**
Docker builds images in layers and caches each layer. If we copy all code first, any code change would invalidate the cache and force reinstallation of dependencies. By copying requirements.txt separately, we only reinstall dependencies when requirements.txt actually changes, making builds much faster.

---

### Question 3: What is the purpose of the `.dockerignore` file?

**Answer:**
`.dockerignore` works like `.gitignore` but for Docker builds. It excludes files from the build context, which:
- Reduces build time (less data to send to Docker daemon)
- Reduces image size (excludes unnecessary files)
- Prevents sensitive files from being accidentally included
- Common exclusions: `node_modules/`, `*.log`, `.git/`, `__pycache__/`

---

### Question 4: What does `python:3.9-slim` mean and why use it instead of `python:3.9`?

**Answer:**
- `python:3.9-slim` is a minimal Debian-based image with only essential packages (~50MB)
- `python:3.9` (full image) includes compilers, headers, and other tools (~900MB)
- **Slim is better for production**: smaller size, faster downloads, reduced attack surface
- **Full image is better for**: development or if you need to compile packages with C extensions

---

### Question 5: How do Docker layers work and why do they matter?

**Answer:**
Each Dockerfile instruction creates a read-only layer. Docker uses a union filesystem to stack these layers. This matters because:
- **Caching**: Unchanged layers are reused, speeding up builds
- **Storage efficiency**: Multiple containers share the same base layers
- **Debugging**: You can inspect each layer
- **Order matters**: Put less frequently changing instructions first

Example:
```
Layer 5: CMD ["python", "app.py"]      ← Changes often
Layer 4: COPY src/ ./src/               ← Changes often
Layer 3: RUN pip install -r req.txt     ← Changes rarely
Layer 2: COPY requirements.txt .        ← Changes rarely
Layer 1: FROM python:3.9-slim           ← Never changes
```

---

### Question 6: What's the difference between `COPY` and `ADD`?

**Answer:**
- `COPY`: Simply copies files/directories from build context to image
- `ADD`: Does the same BUT also:
  - Auto-extracts compressed files (tar, gzip, etc.)
  - Can download files from URLs

**Best practice**: Use `COPY` unless you specifically need ADD's features. COPY is more explicit and predictable.

---

### Question 7: Why do we use volume mounts instead of copying data into the image?

**Answer:**
1. **Size**: Large datasets would make images massive
2. **Flexibility**: Different data can be used without rebuilding the image
3. **Performance**: No need to rebuild/redeploy when data changes
4. **Security**: Sensitive data doesn't get baked into the image
5. **Best practice**: Follows 12-factor app principle of separating code from config/data

---

### Question 8: What does `ENV PYTHONUNBUFFERED=1` do and why is it important?

**Answer:**
Python normally buffers stdout/stderr (stores output before printing). Setting `PYTHONUNBUFFERED=1` disables buffering, meaning:
- Print statements appear immediately in logs
- Crucial for debugging in Docker where you can't see the process directly
- Prevents losing logs if a container crashes before flushing the buffer
- Essential for real-time log monitoring

---

### Question 9: How would you make this Docker image smaller?

**Answer:**
Multiple strategies:
1. ✅ Already using slim base image
2. Use multi-stage builds (build dependencies in one stage, copy only needed files to final stage)
3. Combine RUN commands to reduce layers: `RUN apt-get update && apt-get install -y pkg && rm -rf /var/lib/apt/lists/*`
4. Use `--no-cache-dir` with pip (we already do this)
5. Remove unnecessary files in the same layer they're created
6. Use alpine base images (even smaller than slim, but may have compatibility issues)

---

### Question 10: How do you debug a failed Docker build?

**Answer:**
1. **Read the error message**: Usually tells you which layer failed
2. **Build to the failing layer**: Use the layer ID from the error to create a container: `docker run -it <layer-id> sh`
3. **Run commands interactively**: Test the failing command manually in the container
4. **Check build context**: Ensure required files exist: `docker build -t test . --no-cache`
5. **Use `--progress=plain`**: Get verbose output: `docker build --progress=plain -t test .`
6. **Inspect the last successful layer**: `docker run -it <last-good-layer> sh`

Example workflow:
```bash
# Build fails at layer abc123
docker run -it abc123 sh
# Now inside container, test commands
pip install -r requirements.txt  # Test if this works
```

---

## Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Build Cache](https://docs.docker.com/build/cache/)
