# Docker Compose Explained - Complete Guide

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. Instead of running long `docker run` commands with many flags, you define everything in a YAML file and run `docker-compose up`.

**Key Benefits:**
- Define entire application stack in one file
- Manage multiple containers as a single unit
- Easy to share and reproduce environments
- Automatic networking between containers
- Volume management simplified

## Our docker-compose.yml Line-by-Line

```yaml
# Task 2: Docker Compose for local development and testing
# Simulates container deployment for diet analysis application

version: '3.8'
```

**Explanation:**
- `version` specifies the Docker Compose file format version
- `3.8` is a stable, widely-supported version (released 2019)
- Different versions support different features
- Always use a specific version (not just `3` or `latest`)

---

```yaml
services:
```

**Explanation:**
- `services` section defines the containers that make up your application
- Each service is a container that will be created
- Services can communicate with each other by name (automatic DNS)
- Think of each service as one component of your application

---

```yaml
  # Main data analysis application
  diet-analysis:
```

**Explanation:**
- `diet-analysis` is the service name (you choose this)
- This will become the container name and DNS hostname
- Other containers can reach this service at `http://diet-analysis:port`
- Indentation matters in YAML! (2 spaces per level)

---

```yaml
    build: .
```

**Explanation:**
- `build: .` tells Docker Compose to build an image from the Dockerfile in the current directory (`.`)
- Alternative: `build: ./path/to/dockerfile` for different location
- Could also use `image: existing-image-name` to use a pre-built image
- When you run `docker-compose up --build`, it rebuilds the image

---

```yaml
    container_name: diet-analysis
```

**Explanation:**
- Sets a custom name for the container
- Without this, Docker Compose auto-generates names like `cloud-assignment1_diet-analysis_1`
- Custom names are easier to identify and reference
- Must be unique across all containers on the system

---

```yaml
    volumes:
      - ./data:/app/data
      - ./outputs:/app/outputs
```

**Explanation:**
- `volumes` mounts directories from your host machine into the container
- Format: `host-path:container-path`
- `./data:/app/data` means:
  - `./data` on your Mac → `/app/data` inside container
  - Files are synced in real-time (bi-directional)
  - Changes persist even after container stops
- **Why we need this:**
  - Input: Container reads CSV from `./data` on your Mac
  - Output: Container writes visualizations to `./outputs` on your Mac
  - You can see outputs without entering the container

---

```yaml
    environment:
      - PYTHONUNBUFFERED=1
```

**Explanation:**
- `environment` sets environment variables inside the container
- Format: `- KEY=value` or `- KEY` (uses host environment value)
- `PYTHONUNBUFFERED=1` makes Python output appear immediately in logs
- Could also use:
  ```yaml
  environment:
    PYTHONUNBUFFERED: "1"
    DEBUG: "true"
  ```

---

```yaml
# Usage:
# docker-compose up --build    # Build and start the service
# docker-compose down          # Stop the service
# docker-compose logs          # View logs
```

**Explanation:**
- Comments documenting common commands
- `up --build`: Builds images and starts containers
- `down`: Stops and removes containers (but preserves volumes)
- `logs`: Shows output from all services

---

## Complete Example with Multiple Services

Here's what a more complex docker-compose.yml might look like (not in our current file):

```yaml
version: '3.8'

services:
  # Data analysis app
  diet-analysis:
    build: .
    container_name: diet-analysis
    volumes:
      - ./data:/app/data
      - ./outputs:/app/outputs
    environment:
      - PYTHONUNBUFFERED=1
    depends_on:
      - azurite
      - mongodb
    networks:
      - app-network

  # Azure Blob Storage emulator (Task 3)
  azurite:
    image: mcr.microsoft.com/azure-storage/azurite
    container_name: azurite
    ports:
      - "10000:10000"  # Blob service
      - "10001:10001"  # Queue service
      - "10002:10002"  # Table service
    volumes:
      - azurite-data:/workspace
    networks:
      - app-network

  # NoSQL database (Task 3)
  mongodb:
    image: mongo:5.0
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: diet_analysis
    volumes:
      - mongodb-data:/data/db
    networks:
      - app-network

volumes:
  azurite-data:
  mongodb-data:

networks:
  app-network:
    driver: bridge
```

---

## Key Docker Compose Concepts

### 1. **Services**
- Each service = one container
- Services can depend on each other
- Automatically get DNS names for inter-service communication

### 2. **Volumes**
Three types:
- **Bind mounts**: `./host/path:/container/path` (what we use)
- **Named volumes**: `volume-name:/container/path` (Docker-managed)
- **Anonymous volumes**: `/container/path` (temporary)

### 3. **Networks**
- Docker Compose creates a default network for all services
- Services can reach each other by service name
- Can define custom networks for isolation

### 4. **Dependencies**
```yaml
depends_on:
  - database
  - cache
```
- Controls startup order
- **Note**: Only waits for container to start, NOT for the service to be ready
- For readiness, use health checks or wait scripts

---

## Common Docker Compose Commands

```bash
# Start services (creates containers)
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Rebuild images and start
docker-compose up --build

# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes + images
docker-compose down -v --rmi all

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs diet-analysis

# List running services
docker-compose ps

# Execute command in running service
docker-compose exec diet-analysis bash

# Run one-off command
docker-compose run diet-analysis python test.py

# Scale services (create multiple instances)
docker-compose up --scale diet-analysis=3

# View resource usage
docker-compose top

# Validate compose file
docker-compose config

# Pull latest images
docker-compose pull
```

---

## Volume Mounts vs Named Volumes

### Bind Mounts (what we use)
```yaml
volumes:
  - ./data:/app/data  # Bind mount
```
**Use cases:**
- ✅ Development (see code changes immediately)
- ✅ Accessing files on host machine
- ✅ When you need to directly edit files

### Named Volumes
```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:  # Define the volume
```
**Use cases:**
- ✅ Production data persistence
- ✅ Better performance (especially on Mac/Windows)
- ✅ Docker-managed (backups, migrations)

---

## Best Practices Used in Our Compose File

1. ✅ **Version specified** - Ensures compatibility
2. ✅ **Custom container names** - Easy to identify
3. ✅ **Volume mounts for data** - Separates code from data
4. ✅ **Environment variables** - Configuration externalized
5. ✅ **Comments** - Documents usage
6. ✅ **Minimal services** - Only what's needed for Task 2

---

## Interview Questions (10)

### Question 1: What's the difference between `docker-compose up` and `docker-compose up --build`?

**Answer:**
- `docker-compose up`: Starts containers using existing images. If images don't exist, it builds them.
- `docker-compose up --build`: Forces a rebuild of images before starting containers, even if they already exist.

**When to use `--build`:**
- After changing Dockerfile
- After updating dependencies
- After pulling new code changes
- When you want to ensure you're using the latest code

**Example:**
```bash
# First time - builds images
docker-compose up

# Made changes to code
docker-compose up --build  # Rebuild with changes
```

---

### Question 2: What's the difference between `docker-compose down` and `docker-compose stop`?

**Answer:**
- `docker-compose stop`: Stops containers but keeps them (can restart quickly with `docker-compose start`)
- `docker-compose down`: Stops AND removes containers, networks (but keeps volumes by default)

**Comparison:**
```bash
# Stop containers (preserves everything)
docker-compose stop
docker-compose start  # Quick restart

# Remove containers (but keep volumes)
docker-compose down
docker-compose up  # Recreates containers

# Remove everything including volumes
docker-compose down -v
```

**Use `stop` when:** Temporarily pausing, need quick restart
**Use `down` when:** Done for the day, want clean state

---

### Question 3: How do volume mounts work and what's the difference between `./data:/app/data` and `data:/app/data`?

**Answer:**
- `./data:/app/data` (starts with `.` or `/`) - **Bind mount**
  - Points to a directory on your host machine
  - Changes sync in real-time
  - Exact location: `./data` relative to docker-compose.yml

- `data:/app/data` (no path prefix) - **Named volume**
  - Docker-managed storage (location: `/var/lib/docker/volumes/`)
  - Persists independently of host directories
  - Better performance on Mac/Windows

**Example:**
```yaml
volumes:
  # Bind mount - see files on your Mac
  - ./outputs:/app/outputs

  # Named volume - Docker manages it
  - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:  # Define named volume
```

---

### Question 4: What does `depends_on` do and what are its limitations?

**Answer:**
`depends_on` controls startup order of containers.

**What it DOES:**
- Starts dependencies before dependent services
- Example: Start database before app

**What it DOES NOT do:**
- ❌ Wait for service to be "ready" (just started)
- ❌ Guarantee database is accepting connections
- ❌ Handle startup failures

**Example of the problem:**
```yaml
services:
  app:
    depends_on:
      - database  # App starts AFTER database container starts
                  # BUT database might not be ready to accept connections!
  database:
    image: postgres
```

**Solution:** Use health checks or wait scripts
```yaml
database:
  healthcheck:
    test: ["CMD", "pg_isready"]
    interval: 5s
    timeout: 5s
    retries: 5

app:
  depends_on:
    database:
      condition: service_healthy  # Wait for health check to pass
```

---

### Question 5: How do services communicate with each other in Docker Compose?

**Answer:**
Docker Compose creates a default network where services can reach each other by service name.

**Example:**
```yaml
services:
  web:
    image: nginx
  api:
    image: my-api
  database:
    image: postgres
```

**From the `api` container:**
```python
# Connect to database using service name as hostname
db_connection = connect("postgresql://database:5432/mydb")

# Call web service
response = requests.get("http://web:80/")
```

**Behind the scenes:**
- Docker Compose creates a bridge network
- Each service gets a DNS entry (service name → container IP)
- Only containers in the same network can communicate
- Ports don't need to be published for inter-service communication

---

### Question 6: What's the purpose of the `ports` mapping and when is it needed?

**Answer:**
`ports` maps container ports to host machine ports, making services accessible from outside Docker.

**Format:** `"host-port:container-port"`

**Example:**
```yaml
services:
  web:
    ports:
      - "8080:80"  # Access container's port 80 via localhost:8080
```

**When you NEED it:**
- ✅ Accessing service from your browser/Postman
- ✅ External clients connecting to service
- ✅ Development/debugging

**When you DON'T need it:**
- ❌ Service only used by other containers (use service name)
- ❌ Production (use reverse proxy/load balancer)

**Our compose file doesn't use ports** because:
- We only run the script once (not a web service)
- Output goes to volume mounts (accessible on host)
- No need for external access

---

### Question 7: What happens to data when you run `docker-compose down`?

**Answer:**
Depends on where data is stored:

**Named volumes** (preserved):
```yaml
volumes:
  - db-data:/var/lib/postgresql/data
```
✅ Data survives `docker-compose down`
❌ Data deleted with `docker-compose down -v`

**Bind mounts** (always preserved):
```yaml
volumes:
  - ./data:/app/data
```
✅ Data survives `docker-compose down`
✅ Data survives `docker-compose down -v` (it's on your host machine)

**Container filesystem** (lost):
```yaml
# No volumes defined
```
❌ Data lost with `docker-compose down`

**Summary:**
- `down`: Removes containers, keeps volumes
- `down -v`: Removes containers AND named volumes
- Bind mounts: Always safe

---

### Question 8: How would you override settings in docker-compose.yml for different environments (dev vs prod)?

**Answer:**
Multiple approaches:

**1. Multiple compose files (best practice):**
```bash
# Base configuration
docker-compose.yml

# Development overrides
docker-compose.override.yml  # Automatically loaded in dev

# Production overrides
docker-compose.prod.yml

# Run with specific file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

**2. Environment variables:**
```yaml
# docker-compose.yml
services:
  app:
    image: myapp:${VERSION:-latest}
    environment:
      - DEBUG=${DEBUG:-false}
```

```bash
# .env file
VERSION=1.2.3
DEBUG=true
```

**3. Profiles (Docker Compose 1.28+):**
```yaml
services:
  debug-tool:
    profiles: ["debug"]
    image: debugger
```

```bash
docker-compose --profile debug up  # Only starts debug-tool
```

---

### Question 9: What's the difference between `docker-compose run` and `docker-compose exec`?

**Answer:**

**`docker-compose exec`:**
- Runs command in an **already running** container
- Like SSHing into a running server
- Doesn't create a new container

```bash
# Service must be running
docker-compose up -d
docker-compose exec diet-analysis bash
docker-compose exec diet-analysis python test.py
```

**`docker-compose run`:**
- Creates a **new container** to run the command
- Useful for one-off tasks
- Container is removed after command completes (unless `--rm` is omitted)

```bash
# Creates new container
docker-compose run diet-analysis python migrate.py
docker-compose run diet-analysis pytest tests/
```

**Key differences:**
| Feature | exec | run |
|---------|------|-----|
| Requires running service | Yes | No |
| Creates new container | No | Yes |
| Uses service config | Yes | Yes |
| Port mappings | Active | Not active (unless `--service-ports`) |
| Use case | Interactive debugging | One-off commands |

---

### Question 10: How do you debug issues with Docker Compose?

**Answer:**

**Step 1: Check if services are running**
```bash
docker-compose ps
# Look for "Exit 1" or other error states
```

**Step 2: View logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs diet-analysis

# Follow logs in real-time
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

**Step 3: Validate compose file**
```bash
docker-compose config
# Shows parsed configuration and catches YAML errors
```

**Step 4: Inspect the container**
```bash
# Get shell access
docker-compose exec diet-analysis sh

# Check environment variables
docker-compose exec diet-analysis env

# Check file system
docker-compose exec diet-analysis ls -la /app
```

**Step 5: Check networks**
```bash
# List networks
docker network ls

# Inspect network
docker network inspect cloud-assignment1_default
```

**Step 6: Check volumes**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect cloud-assignment1_data
```

**Common issues:**
1. **YAML indentation** → Run `docker-compose config`
2. **Port conflicts** → Change port mapping or stop conflicting service
3. **Volume permissions** → Check file ownership and permissions
4. **Network issues** → Ensure services are on same network
5. **Image not found** → Run `docker-compose build`

---

## Additional Resources

- [Docker Compose Official Documentation](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)
- [Compose File Samples](https://github.com/docker/awesome-compose)
