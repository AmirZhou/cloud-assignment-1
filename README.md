# Cloud Computing Assignment 1 - Nutritional Data Analysis

## Team Members

- **[An-Ni Huang]** - Data Analysis Lead
- **[Yue Zhou]** - Docker & CI/CD
- **[Chen Li]** - Serverless & Cloud Simulation Lead

## Project Overview

Cloud-native application processing All_Diets.csv dataset using Azure cloud services simulation. Focus on nutritional insights with serverless architecture, cloud storage simulation, and CI/CD automation.

## Quick Start

### Prerequisites

- Python 3.9+
- Docker
- Git
- VS Code (recommended)

### For An-Ni (No blockers, Can Start Immediately)

```bash
# 1. Download dataset to data/ folder
# 2. Install Python dependencies
pip install pandas matplotlib seaborn numpy jupyter

# 3. Start working on src/data_analysis.py
cd src
python data_analysis.py
```

### For Chen Li (No blockers, Can Start Immediately)

```bash
# 1. Install Azurite
npm install -g azurite
# OR
docker run -p 10000:10000 -p 10001:10001 mcr.microsoft.com/azure-storage/azurite

# 2. Install Azure SDK
pip install azure-storage-blob

# 3. Start working on src/serverless_function.py
```

### For Docker/CI/CD (Yue Zhou, No blocker, can start immediately)

```bash
# 1. Set up GitHub Actions (see .github/workflows/)
# 2. Create Docker Hub account
# 3. Build and test Docker container
docker build -t diet-analysis .
docker run -it diet-analysis
```

## Project Structure

```
├── src/                    # Main source code
│   ├── data_analysis.py    # Task 1: Data analysis (AI/ML Expert)
│   ├── serverless_function.py # Task 3: Serverless function (Serverless Lead)
│   └── utils/              # Shared utilities
├── tests/                  # Unit tests
├── data/                   # Dataset storage
│   └── All_Diets.csv      # Download from Kaggle
├── outputs/                # Generated files
│   ├── visualizations/     # Charts and plots
│   └── results/           # Analysis results
├── docs/                   # Documentation and reports
├── .github/workflows/      # CI/CD pipeline
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-container setup
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## Tasks Assignment

### ✅ Task 1: Data Analysis (An-Ni)

- File: `src/data_analysis.py`
- Generate: Visualizations in `outputs/visualizations/`
- Dependencies: None (start immediately)

### ✅ Task 2: Docker (Yue)

- Files: `Dockerfile`, `docker-compose.yml`
- Dependencies: Needs `data_analysis.py` completed

### ✅ Task 3: Serverless (Chen)

- File: `src/serverless_function.py`
- Dependencies: Minimal (can start setup immediately)

### ✅ Task 4: CI/CD (Yue)

- File: `.github/workflows/deploy.yml`
- Dependencies: Needs Dockerfile

### ✅ Task 5: Enhancements (All)

- Research and implement optimizations
- Document in `docs/enhancements.md`

## Communication

- **Status Updates**: Teams Group
- **File Handoffs**: Pull Requests

## Deliverables Checklist

- [ ] `data_analysis.py` with visualizations
- [ ] `Dockerfile` working locally
- [ ] `serverless_function.py` with Azurite
- [ ] `.github/workflows/deploy.yml` pipeline
- [ ] Enhancement report in `docs/`
- [ ] Team video presentation
- [ ] Individual contribution reports

## Getting Help

- Check `docs/troubleshooting.md`
- Post in GitHub Issues
- Reference: `plan/plan.md` for detailed project plan
