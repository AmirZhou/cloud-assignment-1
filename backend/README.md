# 🍽️ Nutrition Dashboard Backend API

🚀 **Fast • Cached • Accurate (Phase 3 – Redis Optimization)**

This backend uses **Azure Functions**, **Blob Trigger**, and **Azure Redis Cache** to deliver a production‑ready nutritional analytics API. Unlike earlier phases, **all heavy computation happens inside the Blob Trigger**, not inside the HTTP APIs.

---

## 📍 Base URL

### **Local Development**

```
http://localhost:7071/api
```

### **Production**

Update in phase three:

```
https://nutritionalinsightssecondver-egfggebfbnameubc.westus-01.azurewebsites.net
```

---

# ⚙️ Phase 3 Architecture

## ✔ Blob Trigger Pipeline (runs only when **All_Diets.csv** is uploaded)

The Blob Trigger performs **all** computation required by the system **once per dataset upload**:

### **Step 1 — Load & Clean Data**

- Loads CSV directly from Blob binding
- Runs `load_and_clean_data()`
- Stores cleaned data in Redis → key: `cleaned_data`

### **Step 2 — Generate Charts**

Using `ChartGenerator`:

- Bar chart → `charts:bar_chart`
- Heatmap → `charts:heatmap`
- Scatter plot → `charts:scatter_plot`

Stored as Base64 strings (NOT data URIs — the API prepends `data:image/png;base64,` when returning).

### **Step 3 — Compute Insights**

Direct outputs from your processing code:

- Highest protein diet
- Average macronutrients
- Cuisine distribution
- Nutritional ratios
- Top 5 protein recipes

Stored under → `insights:summary`

### **Step 4 — Pre‑Cache Recipe Filters**

The trigger pre-computes recipe lists into Redis:

- All recipes → `recipes:all`
- `recipes:diet:{diet_type}`
- `recipes:cuisine:{cuisine}`

### **Step 5 — Metadata Storage**

Stored exactly as in the code (timings, counts, diet types, cuisines, etc.):
→ Redis key: `metadata`

APIs rely heavily on metadata when responding.

---

# 🌐 API Endpoints (Return Data EXACTLY as in Code)

Your backend only exposes one Azure Function with **action‑based routing**:

```
GET /api/{action}
```

Where `{action}` is:

- `health`
- `get-charts`
- `get-insights`
- `get-recipes`

Each endpoint returns:

- `status`
- `data`
- `api_performance`
- `blob_trigger_performance`
- `performance_comparison`

These fields were missing or incorrect in the earlier README — now 100% aligned with your code.

---

# 1️⃣ `/api/get-charts`

### 📊 Returns Base64 charts + performance + metadata

**Data returned directly from Redis** using keys:

- `charts:bar_chart`
- `charts:heatmap`
- `charts:scatter_plot`

### **Exact Response Structure (Matches Code)**

```json
{
  "status": "success",
  "data": {
    "bar_chart": "data:image/png;base64,...",
    "heatmap": "data:image/png;base64,...",
    "scatter_plot": "data:image/png;base64,..."
  },
  "api_performance": {
    "api_response_time_sec": 0.03,
    "timestamp": "2025-11-03T23:21:05Z",
    "cached": true,
    "operations": "Read from Redis cache only"
  },
  "blob_trigger_performance": {
    "last_processed": "2025-11-03 23:00:00 UTC",
    "step_times": {
      "data_cleaning_sec": 2.14,
      "chart_generation_sec": 1.87,
      "insights_calculation_sec": 0.45,
      "recipe_caching_sec": 1.22,
      "total_processing_sec": 5.68
    },
    "total_recipes_processed": 7806
  },
  "performance_comparison": {
    "api_vs_blob_speedup": "189x faster",
    "note": "API reads pre-computed results from cache, BlobTrigger handles heavy work"
  },
  "message": "Charts retrieved from cache (NO re-processing!)"
}
```

This is **EXACTLY** your function output, including performance breakdown.

---

# 2️⃣ `/api/get-insights`

### 📈 Returns analysis summary + stats

Reads two Redis keys:

- `insights:summary`
- `metadata`

### Exact Response Structure

```json
{
  "status": "success",
  "data": {
    "insights": { /* full insights summary */ },
    "data_stats": {
      "total_recipes": 7806,
      "diet_types": 3,
      "cuisines": 5
    }
  },
  "api_performance": { ... },
  "blob_trigger_performance": { ... },
  "performance_comparison": { ... },
  "message": "Insights retrieved from cache (NO re-processing!)"
}
```

---

# 3️⃣ `/api/get-recipes`

### 🍱 Recipes + filters + keyword search + pagination

Your code supports:

- `diet_type`
- `cuisine_type`
- `keyword`
- `page`
- `page_size`

### Redis keys used:

- `recipes:all`
- `recipes:diet:{value}`
- `recipes:cuisine:{value}`

### Exact Response Structure

```json
{
  "status": "success",
  "data": {
    "recipes": [ /* paginated items */ ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_count": 2505,
      "total_pages": 126,
      "has_next": true,
      "has_prev": false
    },
    "filter_applied": {
      "diet_type": "keto",
      "cuisine_type": null,
      "keyword": "chicken"
    }
  },
  "api_performance": { ... },
  "blob_trigger_performance": { ... },
  "message": "Recipes retrieved from cache for diet_type=keto, keyword='chicken'"
}
```

This matches your real logic — including keyword matching and cache‑miss behavior.

---

# 4️⃣ `/api/health`

### ❤️ Full system health check (Redis + metadata)

Uses Redis keys:

- `metadata`
- connectivity test (`PING`)

### Exact Output

```json
{
  "status": "healthy",
  "service": "Nutritional Insights API",
  "version": "2.0.0-redis",
  "timestamp": "2025-11-03T23:21:05Z",
  "checks": {
    "redis_cache": "connected",
    "cache_data": {
      "last_processed": "2025-11-03 23:00:00 UTC",
      "total_recipes": 7806,
      "diet_types": 3
    }
  },
  "execution_time": "0.02s"
}
```

If Redis fails: status becomes **"degraded"** and HTTP code = 503.

---

# ⚠️ Error Handling (Exact Format)

```json
{
  "status": "error",
  "message": "...",
  "timestamp": "2025-11-03T23:21:05Z"
}
```

---

# 🗄 Redis Keys Summary (Actual Values From Code)

| Key                      | Description                   |
| ------------------------ | ----------------------------- |
| `charts:bar_chart`       | Base64 bar chart              |
| `charts:heatmap`         | Base64 heatmap                |
| `charts:scatter_plot`    | Base64 scatter plot           |
| `insights:summary`       | Full insights dict            |
| `recipes:all`            | All recipes list              |
| `recipes:diet:{type}`    | Filtered recipes              |
| `recipes:cuisine:{type}` | Filtered recipes              |
| `metadata`               | Processing stats + timestamps |
| `cleaned_data`           | Cleaned data JSON             |

---
