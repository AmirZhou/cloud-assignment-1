# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cloud-native nutritional data analysis application processing the All_Diets.csv dataset. The project has evolved from a simple data analysis tool to a full-stack application with React frontend, Flask/Azure Functions backend, and Docker containerization.

## Architecture

### Dual Backend Architecture

The application supports **two backend modes**:

1. **Local Development**: Flask API (`api_server.py`)
   - Runs on port 5000
   - Direct CSV file access from `data/` folder
   - Fast iteration for local development

2. **Production/Azure**: Azure Functions (`backend/Api/__init__.py`)
   - Deployed to Azure Functions
   - Reads CSV from Azure Blob Storage
   - Serverless architecture with HTTP triggers
   - Production URL: `https://nutritionalinsights-f6fuebczajdjbkb7.westus-01.azurewebsites.net`

**Important**: Both backends implement identical API contracts. When making changes to endpoints, you **must update both** `api_server.py` and `backend/Api/__init__.py` to maintain parity.

### Frontend

- **Stack**: React 18 + Vite + Tailwind CSS
- **Location**: `frontend/` directory
- **Main Components**:
  - `Dashboard.jsx` - Standard dashboard view
  - `DashboardPremium.jsx` - Enhanced dashboard with premium features
  - Chart components: `BarChart.jsx`, `PieChart.jsx`, `ScatterChart.jsx`, `HeatmapChart.jsx`
- **Dev Server**: Port 3000 (configured in `vite.config.js`)
- **API Proxy**: Vite proxies `/api/*` requests to `http://localhost:5000` in dev mode

### Data Flow

```
Frontend (React) → API Endpoints → Data Processing → Response
                    ↓
            Local: api_server.py (port 5000)
            Azure: backend/Api/__init__.py
                    ↓
            Local: data/All_Diets.csv
            Azure: Blob Storage
```

## Development Commands

### Local Development (Recommended Workflow)

**Terminal 1 - Backend:**
```bash
# Install Python dependencies first
pip install -r requirements.txt

# Start Flask API server
python api_server.py
# Expected: API running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
# Expected: Local: http://localhost:3000/
```

### Azure Functions (Production)

**Local testing:**
```bash
cd backend
func start
# Expected: Functions running on http://localhost:7071
```

**Deploy:**
```bash
cd backend
func azure functionapp publish <function-app-name>
```

### Docker

**Build and run containerized data analysis:**
```bash
# Build image
docker build -t diet-analysis .

# Run with local data volume
docker run -v $(pwd)/data:/app/data -v $(pwd)/outputs:/app/outputs diet-analysis
```

**Docker Compose:**
```bash
docker-compose up --build
```

### Testing

**Backend API testing:**
```bash
python test_api.py
```

**Python tests:**
```bash
pytest tests/ -v
```

## Key API Endpoints

All endpoints follow the same contract in both Flask and Azure Functions:

| Endpoint | Method | Purpose | When Called |
|----------|--------|---------|-------------|
| `/api/insights` | GET | All nutritional insights and visualization data | Page load |
| `/api/recipes` | GET | Recipe data, optionally filtered by diet type | Display recipes table |
| `/api/health` | GET | Health check and service status | Monitoring |

**Azure Functions also supports** (legacy):
- `/api/get-charts` - Chart visualizations only
- `/api/get-insights` - Analysis insights only
- `/api/get-recipes?diet_type={type}` - Filtered recipes

**Response format**: All endpoints return JSON with this structure:
```javascript
{
  "status": "success",
  "data": { /* endpoint-specific data */ },
  "execution_time": "1.23s",
  "timestamp": "2025-11-03T23:21:05Z",
  "message": "Operation successful"
}
```

## Data Processing Architecture

### Shared Backend Logic

Both backends use these core functions (located in different places but identical logic):

**Flask (`api_server.py`):**
- `load_and_process_data()` - Loads CSV, handles missing data
- `calculate_macronutrient_averages(df)` - Averages by diet type
- `get_diet_distribution(df)` - Recipe counts for pie chart
- `get_protein_carbs_relationship(df)` - Scatter plot data (sampled 100 recipes)
- `get_correlation_heatmap(df)` - Correlation matrix for heatmap

**Azure Functions (`backend/shared/processing.py`):**
- Same functions with Azure Blob Storage integration
- Additional: `generate_insights_summary()`, chart generation via `shared/chart_generator.py`

### Dataset Requirements

- **File**: `All_Diets.csv`
- **Location (local)**: `data/All_Diets.csv`
- **Location (Azure)**: Blob Storage container `datasets`
- **Size**: ~7,806 recipes
- **Columns**: `Recipe_name`, `Diet_type`, `Cuisine_type`, `Protein(g)`, `Carbs(g)`, `Fat(g)`
- **Handling**: Missing values filled with column means

## Frontend-Backend Integration

### Environment Configuration

The frontend uses Vite's proxy in development but requires environment variable for production:

**Development**: Proxy configured in `vite.config.js` automatically routes `/api/*` to `localhost:5000`

**Production**: Set `VITE_API_URL` environment variable to Azure Functions URL

### CORS Configuration

- **Flask**: Uses `flask-cors` with `CORS(app)` for all origins
- **Azure Functions**: Configured in `backend/host.json` under `cors.allowedOrigins`

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
1. **Test job**: Python 3.9 setup, install dependencies, run pytest
2. **Build-and-push job**: Docker build, tag, push to Docker Hub
3. **Simulate-deployment job**: Verification and deployment simulation

**Required secrets**:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Important Patterns and Conventions

### When Adding New Features

1. **API Changes**: Always update both `api_server.py` AND `backend/Api/__init__.py`
2. **Data Processing**: Add shared logic that works with pandas DataFrames
3. **Frontend**: Update corresponding component in `frontend/src/components/`
4. **Testing**: Add tests in `test_api.py` for new endpoints
5. **Documentation**: Update `API_DOCUMENTATION.md` and `backend/README.md`

### Code Structure Patterns

**Backend endpoint pattern**:
```python
@app.route('/api/endpoint', methods=['GET'])
def endpoint():
    try:
        df = load_and_process_data()
        if df is None:
            return jsonify({'error': 'Failed to load dataset'}), 500

        result = calculate_something(df)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

**Azure Function pattern**:
```python
def handle_endpoint(req: func.HttpRequest, df) -> dict:
    """Handler function"""
    result = calculate_something(df)
    return {
        'status': 'success',
        'data': result,
        'execution_time': f"{elapsed:.2f}s",
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'message': 'Success message'
    }
```

### Performance Considerations

- Scatter plot data is **sampled to 100 recipes** for performance
- CSV is loaded on every request (no caching) - consider adding caching for production
- Azure Functions may cold start - first request slower

## Docker Multi-Stage Build

The Dockerfile uses a **two-stage build**:
1. **Builder stage**: Compiles dependencies with gcc/g++
2. **Runtime stage**: Minimal Python 3.9-slim with only runtime dependencies

**Key**: Data is NOT copied into image - mount via volume for flexibility

## Common Troubleshooting

### Backend Won't Start
- Verify `data/All_Diets.csv` exists
- Check `pip install -r requirements.txt` completed
- Ensure port 5000 is available

### Frontend Won't Connect
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Test backend directly: `curl http://localhost:5000/api/health`

### Azure Functions Issues
- Check blob storage connection string in environment
- Verify CSV uploaded to `datasets` container
- Stream logs: `func azure functionapp logstream <app-name>`

### Docker Build Fails
- Ensure `requirements-prod.txt` has correct dependencies
- Check that multi-stage build syntax is correct

## File Organization

```
├── api_server.py              # Flask API (local dev)
├── backend/
│   ├── Api/__init__.py        # Azure Function entry point
│   ├── shared/                # Shared processing logic
│   ├── host.json              # Azure Functions config (CORS)
│   └── requirements.txt       # Azure Functions dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   └── services/          # API service layer
│   ├── vite.config.js         # Vite config (proxy settings)
│   └── package.json           # Frontend dependencies
├── src/
│   ├── data_analysis.py       # Original data analysis script
│   └── serverless_function.py # Standalone serverless example
├── data/
│   └── All_Diets.csv          # Dataset (gitignored, mount as volume)
├── Dockerfile                 # Multi-stage container build
├── docker-compose.yml         # Local container orchestration
├── requirements.txt           # Python dependencies (dev)
├── requirements-prod.txt      # Production Python dependencies
└── test_api.py                # API integration tests
```

## Team Context

This project was developed as a team assignment with role divisions:
- **An-Ni**: Data analysis (original `src/data_analysis.py`)
- **Yue Zhou**: Docker, CI/CD pipeline
- **Chen Li**: Serverless functions, Azure Functions

Current state is Phase 2 with **production-ready React dashboard** and **deployed Azure Functions backend**.
