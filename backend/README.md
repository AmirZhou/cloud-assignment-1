# 🍽️ Nutrition Dashboard Backend API

> Simple, Fast, Production Ready

---

## 📍 Base URL

**Local Development:**

```
http://localhost:7071/api
```

**Production:**

```
https://nutritionalinsights-f6fuebczajdjbkb7.westus-01.azurewebsites.net
```

---

## 🌐 API Endpoints

### 1. Get Charts

**When:** Page load

**Method:** `GET`

**Response:**

```json
{
  "status": "success",
  "data": {
    "bar_chart": "data:image/png;base64,...",
    "heatmap": "data:image/png;base64,...",
    "scatter_plot": "data:image/png;base64,..."
  },
  "execution_time": "1.23s",
  "timestamp": "2025-11-03T23:21:05Z",
  "message": "Charts generated successfully"
}
```

**Usage:**

```javascript
const res = await fetch("/api/get-charts");
const data = await res.json();

document.getElementById("barChart").src = data.data.bar_chart;
document.getElementById("heatmap").src = data.data.heatmap;
document.getElementById("scatterPlot").src = data.data.scatter_plot;

// Display execution time (important for Dashboard Requirements)
document.getElementById("executionTime").textContent = data.execution_time;
document.getElementById("timestamp").textContent = data.timestamp;
```

---

### 2. Get Insights

**When:** User clicks "Get Insights" button

**Method:** `GET`

**Response:**

```json
{
  "status": "success",
  "data": {
    "insights": {
      "summary": {
        "total_recipes_analyzed": 7806,
        "diet_types_count": 3,
        "cuisines_count": 5
      },
      "highest_protein_diet": "vegan",
      "average_macronutrients": {
        "vegan": { "Protein(g)": 15.75, "Carbs(g)": 44.75, "Fat(g)": 8.35 },
        "keto": { "Protein(g)": 25.2, "Carbs(g)": 15.8, "Fat(g)": 18.5 },
        "mediterranean": {
          "Protein(g)": 20.1,
          "Carbs(g)": 35.2,
          "Fat(g)": 12.3
        }
      },
      "top_5_protein_recipes": [
        {
          "recipe_name": "High Protein Dish",
          "diet_type": "keto",
          "protein_g": 35.5,
          "carbs_g": 10.2,
          "fat_g": 22.1
        }
      ],
      "most_common_cuisines": {
        "vegan": "Asian",
        "keto": "European",
        "mediterranean": "Mediterranean"
      }
    },
    "data_stats": {
      "total_recipes": 7806,
      "diet_types": 3,
      "cuisines": 5
    }
  },
  "execution_time": "0.45s",
  "timestamp": "2025-11-03T23:21:05Z",
  "message": "Insights generated successfully"
}
```

**Usage:**

```javascript
const res = await fetch("/api/get-insights");
const data = await res.json();

const insights = data.data.insights;
console.log("Highest protein diet:", insights.highest_protein_diet);
console.log("Execution time:", data.execution_time);
// Display insights...
```

---

### 3. Get Recipes

**When:** Display recipes or filter

**Method:** `GET`

**Query Parameters:**

- `diet_type` (optional): `vegan`, `keto`, `mediterranean` **(lowercase!)**

**Response (All Recipes):**

```json
{
  "status": "success",
  "data": {
    "recipes": [
      {
        "recipe_name": "Buddha Bowl",
        "diet_type": "vegan",
        "cuisine_type": "Asian",
        "protein_g": 15.5,
        "carbs_g": 45.2,
        "fat_g": 8.2
      }
    ],
    "total_count": 7806,
    "filtered_count": 7806,
    "filter_applied": null
  },
  "execution_time": "0.38s",
  "timestamp": "2025-11-03T23:21:05Z",
  "message": "Recipes fetched successfully"
}
```

**Response (Filtered Recipes):**

```json
{
  "status": "success",
  "data": {
    "recipes": [
      {
        "recipe_name": "Steak with Butter",
        "diet_type": "keto",
        "cuisine_type": "European",
        "protein_g": 25.3,
        "carbs_g": 15.8,
        "fat_g": 18.5
      }
    ],
    "total_count": 7806,
    "filtered_count": 2505,
    "filter_applied": "keto"
  },
  "execution_time": "0.38s",
  "timestamp": "2025-11-03T23:21:05Z",
  "message": "Recipes fetched successfully"
}
```

**Usage:**

```javascript
// All recipes
const res = await fetch("/api/get-recipes");

// Filtered by diet (use lowercase)
const res = await fetch("/api/get-recipes?diet_type=keto");

const data = await res.json();
// Use data.data.recipes to display
console.log("Execution time:", data.execution_time);
console.log("Filter applied:", data.data.filter_applied);
```

---

### 4. Health Check

**Method:** `GET`

**Response - Healthy:**

```json
{
  "status": "healthy",
  "service": "Nutritional Insights API",
  "version": "1.0.0",
  "timestamp": "2025-11-03T23:21:05Z",
  "checks": {
    "blob_storage": "connected",
    "data_available": "7806 rows, 6 columns"
  },
  "execution_time": "0.02s"
}
```

**Response - Unhealthy:**

```json
{
  "status": "unhealthy",
  "service": "Nutritional Insights API",
  "version": "1.0.0",
  "timestamp": "2025-11-03T23:21:05Z",
  "error": "..."
}
```

**HTTP Status:**

- `200` - Healthy
- `503` - Unhealthy

---

## ⚠️ Error Handling

**All errors return:**

```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2025-11-03T23:21:05Z"
}
```

**HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (e.g., invalid diet_type)
- `404` - Endpoint not found
- `500` - Server error
- `503` - Service unavailable

**Basic error handling:**

```javascript
try {
  const res = await fetch("/api/get-charts");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (data.status !== "success") throw new Error(data.message);

  // Use data...
} catch (error) {
  console.error("API Error:", error);
}
```

---

## 📱 Quick Integration Template

```javascript
const API_URL = "http://localhost:7071/api"; // Change for production

// 1. Load charts on page load
async function loadCharts() {
  const res = await fetch(`${API_URL}/get-charts`);
  const data = await res.json();

  document.getElementById("barChart").src = data.data.bar_chart;
  document.getElementById("heatmap").src = data.data.heatmap;
  document.getElementById("scatterPlot").src = data.data.scatter_plot;

  // Display execution time
  document.getElementById("executionTime").textContent = data.execution_time;
}

// 2. Load insights
async function getInsights() {
  const res = await fetch(`${API_URL}/get-insights`);
  const data = await res.json();

  const insights = data.data.insights;
  console.log("Highest protein diet:", insights.highest_protein_diet);
  // Display insights...
}

// 3. Load recipes
async function loadRecipes(dietType = null) {
  const url = dietType
    ? `${API_URL}/get-recipes?diet_type=${dietType.toLowerCase()}`
    : `${API_URL}/get-recipes`;

  const res = await fetch(url);
  const data = await res.json();

  console.log("Recipes:", data.data.recipes);
  console.log("Execution time:", data.execution_time);
  // Display recipes...
}

// 4. Check health (optional)
async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  const data = await res.json();

  if (data.status === "healthy") {
    console.log("✅ Backend online");
  } else {
    console.log("❌ Backend offline");
  }
}

// Initialize
window.addEventListener("load", () => {
  checkHealth();
  loadCharts();
  loadRecipes();
});

// Listen for button clicks and filters
document.getElementById("insightsBtn")?.addEventListener("click", getInsights);
document.getElementById("dietFilter")?.addEventListener("change", (e) => {
  loadRecipes(e.target.value || null);
});
```

---

## 🔐 CORS

**Production:**

- Configure CORS in Azure Portal under Function App settings
- Whitelist your frontend domain

---

## 🐛 Common Issues

| Issue                       | Solution                                                  |
| --------------------------- | --------------------------------------------------------- |
| **No recipes found**        | Use lowercase diet_type: `vegan`, `keto`, `mediterranean` |
| **404 Not Found**           | Check endpoint name is exact                              |
| **500 Error**               | Backend error - check logs                                |
| **503 Error**               | Backend offline - run `func start`                        |
| **CORS Error (production)** | Configure CORS in Azure Portal Function App               |

---

## 📝 API Response Fields

### Common fields in all responses:

- `status`: "success" or "error"
- `execution_time`: Function execution duration (e.g., "1.23s")
- `timestamp`: ISO 8601 timestamp
- `message`: Human-readable message

### Data-specific fields:

- `/get-charts`: `bar_chart`, `heatmap`, `scatter_plot` (all base64)
- `/get-recipes`: `recipes[]`, `total_count`, `filtered_count`, `filter_applied`
- `/get-insights`: `insights{}`, `data_stats{}`
- `/health`: `checks{}`

---

**Version:** 1.0.0 | **Status:** ✅ Production Ready
