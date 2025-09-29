# Troubleshooting Guide

## Common Issues and Solutions

### 🐍 Python Environment Issues

**Problem**: `ModuleNotFoundError` when running scripts
```bash
# Solution: Install dependencies
pip install -r requirements.txt

# Or create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Problem**: Permission denied errors
```bash
# Solution: Use pip with --user flag
pip install --user -r requirements.txt
```

### 🐳 Docker Issues

**Problem**: Docker build fails
```bash
# Check Docker is running
docker --version

# Build with verbose output
docker build -t diet-analysis . --no-cache

# Check Dockerfile syntax
docker build -t diet-analysis . --dry-run
```

**Problem**: Container exits immediately
```bash
# Run with interactive mode to see errors
docker run -it diet-analysis /bin/bash

# Check container logs
docker logs [container-id]
```

### ☁️ Azurite Issues

**Problem**: Cannot connect to Azurite
```bash
# Check if Azurite is running
curl http://127.0.0.1:10000/devstoreaccount1

# Start Azurite manually
azurite --silent --location /tmp/azurite --debug /tmp/azurite/debug.log

# Or with Docker
docker run -p 10000:10000 -p 10001:10001 mcr.microsoft.com/azure-storage/azurite
```

**Problem**: Azurite installation fails
```bash
# Install via npm
npm install -g azurite

# If npm not available, install Node.js first
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: Download from nodejs.org
```

### 🔧 GitHub Actions Issues

**Problem**: Docker Hub push fails
- Check GitHub Secrets are set correctly:
  - `DOCKER_USERNAME`: Your Docker Hub username
  - `DOCKER_PASSWORD`: Docker Hub password or access token

**Problem**: Workflow doesn't trigger
- Check `.github/workflows/deploy.yml` is in correct location
- Verify YAML syntax with online validator
- Check branch names match workflow triggers

### 📊 Data Analysis Issues

**Problem**: All_Diets.csv not found
```bash
# Download from Kaggle manually
# Place in data/ folder
mkdir -p data
# Copy All_Diets.csv to data/All_Diets.csv
```

**Problem**: Visualization not showing
```bash
# Install GUI backend for matplotlib
pip install matplotlib
# For headless servers, use Agg backend
import matplotlib
matplotlib.use('Agg')
```

### 🔄 CI/CD Pipeline Issues

**Problem**: Tests failing
```bash
# Run tests locally first
python -m pytest tests/ -v

# If no tests exist, create basic test
mkdir -p tests
echo "def test_placeholder(): assert True" > tests/test_basic.py
```

**Problem**: Docker image too large
```bash
# Use multi-stage build
# Check current image size
docker images diet-analysis

# Optimize Dockerfile with smaller base image
FROM python:3.9-alpine  # Instead of python:3.9-slim
```

## 🆘 Emergency Contacts

### If Completely Stuck:
1. **Create GitHub Issue** with label `urgent`
2. **Document exact error** (copy/paste full error message)
3. **Include environment details** (OS, Python version, Docker version)
4. **Tag teammates** for immediate help

### Resource Links:
- **Docker Documentation**: https://docs.docker.com/
- **Azure SDK Python**: https://docs.microsoft.com/en-us/azure/developer/python/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Pandas Documentation**: https://pandas.pydata.org/docs/

## 📝 Report Template

When reporting issues, include:

```
**Problem**: Brief description
**Environment**: 
- OS: [Windows/macOS/Linux]
- Python: [version]
- Docker: [version]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Error occurs

**Error Message**:
```
[Paste exact error here]
```

**What I've Tried**:
- [Solution attempt 1]
- [Solution attempt 2]
```

## ✅ Quick Health Checks

Run these commands to verify your setup:

```bash
# Python environment
python --version
pip list | grep -E "(pandas|matplotlib|azure)"

# Docker
docker --version
docker info

# Azurite connection
curl -s http://127.0.0.1:10000/devstoreaccount1 || echo "Azurite not running"

# Git repository
git status
git remote -v
```

Expected output should show no errors and confirm all tools are properly installed.