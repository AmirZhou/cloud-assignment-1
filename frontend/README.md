# Nutritional Insights Dashboard - Frontend

A React-based dashboard for visualizing nutritional data from the Azure Function API.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualizations
- **Axios** - HTTP client

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Backend API (in a separate terminal)

Make sure you have the dataset at `data/All_Diets.csv`, then:

```bash
# From the root directory
pip install -r requirements.txt
python api_server.py
```

The API will run on `http://localhost:5000`

### 3. Start the Frontend

```bash
npm run dev
```

The dashboard will open at `http://localhost:3000`

## Features

### Visualizations

1. **Bar Chart** - Average macronutrients by diet type
2. **Pie Chart** - Recipe distribution by diet type
3. **Scatter Plot** - Protein vs Carbs relationship
4. **Heatmap** - Nutrient correlation matrix

### Interactive Features

- Refresh insights button
- Load top recipes
- Diet type filter
- Responsive design

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard component
│   │   ├── BarChart.jsx        # Bar chart visualization
│   │   ├── PieChart.jsx        # Pie chart visualization
│   │   ├── ScatterChart.jsx    # Scatter plot visualization
│   │   └── HeatmapChart.jsx    # Correlation heatmap
│   ├── services/
│   │   └── api.js              # API client
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind configuration
```

## Deployment to Azure

### Option 1: Azure Static Web Apps

1. Build the app:
```bash
npm run build
```

2. Deploy using Azure CLI:
```bash
az staticwebapp create \
  --name nutritional-insights \
  --resource-group your-resource-group \
  --source dist
```

### Option 2: Azure App Service

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to Azure App Service

### Update API URL for Production

Create a `.env` file (copy from `.env.example`):

```bash
# For Azure deployment
VITE_API_URL=https://your-azure-function.azurewebsites.net
```

Then rebuild:
```bash
npm run build
```

## API Endpoints Used

- `GET /api/insights` - Get all nutritional insights
- `GET /api/recipes` - Get top protein-rich recipes
- `GET /api/health` - Health check

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure:
1. The backend API (`api_server.py`) is running
2. Flask-CORS is installed: `pip install flask-cors`

### Charts Not Displaying

Make sure all dependencies are installed:
```bash
npm install chart.js react-chartjs-2
```

### Dataset Not Found

Ensure `data/All_Diets.csv` exists in the root directory of the project.
