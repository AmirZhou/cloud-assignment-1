# Backend Handover - Quick Summary

## What You Built

**Flask API** with 3 endpoints serving nutritional data from 7,806 recipes.

---

## API Endpoints

### 1. GET /api/insights
Returns visualization data for charts.

**Example Request:**
```bash
curl http://localhost:5000/api/insights
```

**Response Summary:**
```json
{
  "total_recipes": 7806,
  "diet_types": 5,
  "average_macronutrients": [...],  // For bar chart
  "diet_distribution": {...},       // For pie chart
  "protein_carbs_scatter": [...],   // For scatter plot
  "correlation_heatmap": {...},     // For heatmap
  "processing_status": "success"
}
```

---

### 2. GET /api/recipes
Returns all recipes sorted by protein content.

**Example Request:**
```bash
curl http://localhost:5000/api/recipes
```

**Response Summary:**
```json
{
  "recipes": [
    {
      "Recipe_name": "Grilled Chicken Breast",
      "Diet_type": "paleo",
      "Cuisine_type": "American",
      "Protein(g)": 85.5,
      "Carbs(g)": 2.3,
      "Fat(g)": 15.2
    }
    // ... 7,805 more recipes
  ],
  "total": 7806
}
```

---

### 3. GET /api/health
Health check endpoint.

**Example Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

---

## How Frontend Calls It

**File:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

// API base URL (configured via environment variable)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch insights
export const fetchInsights = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/insights`);
  return response.data;
};

// Fetch recipes
export const fetchRecipes = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/recipes`);
  return response.data;
};
```

**Usage in React:**
```javascript
// Dashboard.jsx
const loadInsights = async () => {
  const data = await fetchInsights();  // Calls GET /api/insights
  setInsights(data);
};

const loadRecipes = async () => {
  const data = await fetchRecipes();   // Calls GET /api/recipes
  setRecipes(data.recipes);
};
```

---

## Test It

```bash
# Test health check
curl http://localhost:5000/api/health

# Test insights (returns ~50KB JSON)
curl http://localhost:5000/api/insights | python -m json.tool

# Test recipes (returns ~2MB JSON with all 7,806 recipes)
curl http://localhost:5000/api/recipes | python -m json.tool | head -50
```

---

## What Backend Dev Needs to Do

1. **Convert to Azure Functions**
   - Copy logic from `api_server.py`
   - Create 3 Azure Functions (one per endpoint)
   - See `BACKEND_HANDOVER.md` for step-by-step guide

2. **Upload Dataset to Blob Storage**
   - Upload `data/All_Diets.csv` to Azure Blob Storage
   - Update code to read from blob instead of local file

3. **Deploy to Azure**
   - Deploy Function App
   - Configure CORS
   - Test endpoints

4. **Give You the URL**
   - Format: `https://<function-app-name>.azurewebsites.net`
   - You'll update `frontend/.env` with this URL
   - Rebuild and deploy frontend

---

## File Structure

```
cloud-assignment-1/
├── api_server.py                    # Current Flask API (LOCAL)
├── data/
│   └── All_Diets.csv               # 7,806 recipes dataset
├── frontend/                        # Your React dashboard
│   ├── src/
│   │   └── services/
│   │       └── api.js              # API calls to backend
│   └── .env                        # API URL config
│
├── API_DOCUMENTATION.md            # Full API spec
├── BACKEND_HANDOVER.md             # Azure Functions migration guide
└── HANDOVER_SUMMARY.md             # This file
```

---

## Quick Test Commands

```bash
# Start backend (if not already running)
python api_server.py

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/insights
curl http://localhost:5000/api/recipes

# See response in browser
http://localhost:5000/api/insights
```

---

## When Azure is Deployed

**Backend dev will give you:**
```
https://nutritional-insights-func.azurewebsites.net
```

**You update:**
```bash
# frontend/.env
VITE_API_URL=https://nutritional-insights-func.azurewebsites.net
```

**Then rebuild:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Azure Static Web Apps
```

---

## Documentation Files

1. **`API_DOCUMENTATION.md`** - Complete API reference
2. **`BACKEND_HANDOVER.md`** - Azure Functions conversion guide
3. **`HANDOVER_SUMMARY.md`** - This quick reference
4. **`test_api.py`** - API test script

---

## Questions to Ask Backend Dev

1. "When will the Azure Function be deployed?"
2. "What's the Function App URL?"
3. "Is CORS configured for the frontend domain?"
4. "Are all 3 endpoints working?"

---

## Current Status

- [x] Flask API built and tested locally
- [x] Frontend integrated and working
- [x] Search and pagination implemented
- [x] All 7,806 recipes returned
- [ ] Converted to Azure Functions (Backend dev)
- [ ] Deployed to Azure (Backend dev)
- [ ] Frontend updated with Azure URL (You)
- [ ] Frontend deployed to Azure Static Web Apps (You)

---

**Summary:** Your part is done! Just waiting for backend dev to deploy to Azure and give you the URL!
