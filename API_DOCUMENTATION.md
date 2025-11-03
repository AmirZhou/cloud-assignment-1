# API Documentation - Nutritional Insights Backend

## 📋 Overview

The backend API provides nutritional data analysis from the `All_Diets.csv` dataset.

**Current Implementation:** Flask development server (Python)
**Production Target:** Azure Functions (HTTP Triggers)
**Base URL (Local):** `http://localhost:5000`
**Base URL (Azure):** `https://<your-function-app>.azurewebsites.net`

---

## 🔗 API Endpoints

### 1. Get All Insights
**Endpoint:** `GET /api/insights`

**Description:** Returns comprehensive nutritional insights including visualizations data.

**Request:**
```bash
curl http://localhost:5000/api/insights
```

**Response:** `200 OK`
```json
{
  "total_recipes": 7806,
  "diet_types": 5,
  "average_macronutrients": [
    {
      "Diet_type": "paleo",
      "Protein(g)": 45.23,
      "Carbs(g)": 32.15,
      "Fat(g)": 28.90
    },
    {
      "Diet_type": "vegan",
      "Protein(g)": 15.67,
      "Carbs(g)": 65.43,
      "Fat(g)": 18.22
    }
    // ... more diet types
  ],
  "diet_distribution": {
    "labels": ["paleo", "vegan", "keto", "vegetarian", "pescatarian"],
    "values": [1500, 2000, 1800, 1600, 906]
  },
  "protein_carbs_scatter": [
    {
      "diet_type": "paleo",
      "data": [
        { "x": 45.2, "y": 30.5 },
        { "x": 38.1, "y": 28.3 }
        // ... up to 100 sample points per diet
      ]
    }
    // ... more diet types
  ],
  "correlation_heatmap": {
    "labels": ["Protein(g)", "Carbs(g)", "Fat(g)"],
    "data": [
      [1.0, -0.23, 0.15],
      [-0.23, 1.0, -0.45],
      [0.15, -0.45, 1.0]
    ]
  },
  "processing_status": "success"
}
```

**Used By Frontend:**
- Bar Chart (average_macronutrients)
- Pie Chart (diet_distribution)
- Scatter Plot (protein_carbs_scatter)
- Heatmap (correlation_heatmap)
- Stats cards (total_recipes, diet_types)

---

### 2. Get All Recipes
**Endpoint:** `GET /api/recipes`

**Description:** Returns all recipes sorted by protein content (highest first).

**Request:**
```bash
curl http://localhost:5000/api/recipes
```

**Response:** `200 OK`
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
    },
    {
      "Recipe_name": "Salmon Fillet",
      "Diet_type": "pescatarian",
      "Cuisine_type": "Mediterranean",
      "Protein(g)": 78.3,
      "Carbs(g)": 0.5,
      "Fat(g)": 25.6
    }
    // ... 7,804 more recipes
  ],
  "total": 7806
}
```

**Used By Frontend:**
- Recipes table with pagination
- Search and filter functionality

---

### 3. Health Check
**Endpoint:** `GET /api/health`

**Description:** Simple health check endpoint for monitoring.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

---

### 4. Root
**Endpoint:** `GET /`

**Description:** API information and available endpoints.

**Request:**
```bash
curl http://localhost:5000/
```

**Response:** `200 OK`
```json
{
  "message": "Nutritional Insights API",
  "endpoints": {
    "/api/insights": "Get all nutritional insights and visualizations",
    "/api/recipes": "Get top recipes by protein",
    "/api/health": "Health check"
  }
}
```

---

## 🎨 How Frontend Calls the API

### Frontend Service Layer (`frontend/src/services/api.js`)

```javascript
import axios from 'axios';

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

// Health check
export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/health`);
  return response.data;
};
```

### Usage in React Component

```javascript
// Load insights on component mount
useEffect(() => {
  const loadInsights = async () => {
    const data = await fetchInsights();
    setInsights(data);
  };
  loadInsights();
}, []);

// Load recipes on button click
const loadRecipes = async () => {
  const data = await fetchRecipes();
  setRecipes(data.recipes);
};
```

---

## 📦 Dataset Information

**File:** `data/All_Diets.csv`
**Total Records:** 7,806 recipes

**Columns:**
- `Diet_type` - Type of diet (paleo, vegan, keto, vegetarian, pescatarian)
- `Recipe_name` - Name of the recipe
- `Cuisine_type` - Type of cuisine (American, Indian, Mediterranean, etc.)
- `Protein(g)` - Protein content in grams
- `Carbs(g)` - Carbohydrate content in grams
- `Fat(g)` - Fat content in grams
- `Extraction_day` - Day data was extracted
- `Extraction_time` - Time data was extracted

---

## 🔧 Dependencies

**Python Packages:**
```
pandas>=1.5.0
flask>=2.3.0
flask-cors>=4.0.0
python-dotenv>=1.0.0
numpy>=1.21.0
```

**Install:**
```bash
pip install -r requirements.txt
```

---

## 🚀 Running Locally

```bash
# Start the API server
python api_server.py

# Server starts on http://localhost:5000
# CORS enabled for http://localhost:3000 (React frontend)
```

---

## ⚠️ Error Handling

**Dataset Not Found:**
```json
{
  "error": "Failed to load dataset"
}
```
Status: `500 Internal Server Error`

**General Errors:**
All endpoints return error messages in this format:
```json
{
  "error": "Error message here"
}
```

---

## 🔄 CORS Configuration

The API enables CORS for all origins using `flask-cors`:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allows requests from any origin
```

For production, restrict to specific origins:
```python
CORS(app, origins=["https://your-frontend-app.azurewebsites.net"])
```

---

## 📝 Notes for Backend Developer

1. **Current State:** Flask development server (NOT production-ready)
2. **Target:** Azure Functions with HTTP triggers
3. **Data Processing:** All done in-memory (no database)
4. **Performance:** `/api/recipes` returns 7,806 records (~2MB JSON)
5. **CORS:** Currently allows all origins - restrict in production

---

## 🎯 Next Steps for Azure Deployment

See `BACKEND_HANDOVER.md` for detailed Azure Functions migration guide.
