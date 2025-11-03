# Phase 2 Quick Start Guide

## What's Been Set Up

You now have:
1. **Backend API** (`api_server.py`) - Flask server that returns JSON data
2. **React Frontend** (`frontend/`) - Dashboard with 4 visualizations

## Step-by-Step Local Development

### Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Start the Backend API

Make sure you have the dataset at `data/All_Diets.csv`, then:

```bash
python api_server.py
```

You should see:
```
🚀 Starting Flask API Server
📍 API running on http://localhost:5000
```

Test it in your browser: http://localhost:5000/api/insights

### Step 3: Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

This will install React, Chart.js, Tailwind CSS, and other dependencies.

### Step 4: Start the Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

Open http://localhost:3000 in your browser!

## What You'll See

The dashboard includes:
- ✅ **Bar Chart** - Average macronutrients by diet type
- ✅ **Pie Chart** - Recipe distribution
- ✅ **Scatter Plot** - Protein vs Carbs
- ✅ **Heatmap** - Nutrient correlations
- ✅ **Top Recipes Table** - Protein-rich recipes
- ✅ **Filters** - Filter by diet type
- ✅ **Interactive Buttons** - Refresh data

## Next Steps for Azure Deployment

### When Your Teammate Deploys the Azure Function

1. They'll give you a URL like: `https://your-app.azurewebsites.net`
2. Create `frontend/.env`:
   ```
   VITE_API_URL=https://your-app.azurewebsites.net
   ```
3. Rebuild: `npm run build`
4. Deploy the `frontend/dist` folder to Azure Static Web Apps

### If You Need to Deploy the Azure Function Yourself

The current `api_server.py` is a Flask app. To convert it to an Azure Function:

1. Create Azure Function project structure
2. Move logic into `__init__.py`
3. Add `function.json` with HTTP trigger
4. Deploy using Azure CLI or VS Code

See `frontend/README.md` for detailed deployment instructions.

## Troubleshooting

### Backend Won't Start
- Check if dataset exists: `data/All_Diets.csv`
- Install dependencies: `pip install -r requirements.txt`

### Frontend Shows CORS Error
- Make sure backend is running on port 5000
- Check that `flask-cors` is installed

### Charts Not Displaying
- Check browser console for errors
- Make sure API returns data (visit http://localhost:5000/api/insights)

### Port Already in Use
- Backend: Change port in `api_server.py` (line 161)
- Frontend: Change port in `frontend/vite.config.js`

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  React Frontend │  HTTP   │   Flask API      │  Reads  │  CSV File   │
│  (Port 3000)    │────────▶│  (Port 5000)     │────────▶│  data/      │
│                 │         │                  │         │             │
│  - Dashboard    │         │  - /api/insights │         │  All_Diets  │
│  - Charts       │         │  - /api/recipes  │         │  .csv       │
│  - Tables       │         │  - /api/health   │         │             │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

## Project Structure

```
cloud-assignment-1/
├── api_server.py              # Flask API (NEW)
├── frontend/                  # React app (NEW)
│   ├── src/
│   │   ├── components/        # Chart components
│   │   ├── services/api.js    # API client
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── CodeFiles/                 # Phase 1 code
├── data/
│   └── All_Diets.csv         # Dataset
└── requirements.txt           # Python deps (UPDATED)
```

## Key Files

- **api_server.py** - Backend API that processes the dataset
- **frontend/src/components/Dashboard.jsx** - Main UI component
- **frontend/src/services/api.js** - API calls to backend
- **frontend/vite.config.js** - Proxy configuration

## Need Help?

Check the detailed README files:
- `frontend/README.md` - Frontend documentation
- `README.md` - Project overview
