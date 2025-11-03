# 🚀 How to Run the Dashboard

## Prerequisites

- ✅ Python 3.9+ installed
- ✅ Node.js 16+ installed
- ✅ Dataset: `All_Diets.csv`

---

## 🎯 Quick Start (3 Steps)

### 1️⃣ Add the Dataset

**Place your `All_Diets.csv` file in the `data/` folder:**

```
cloud-assignment-1/
├── data/
│   └── All_Diets.csv  ← PUT FILE HERE
```

### 2️⃣ Start Backend (Terminal 1)

**Windows:**
```bash
start-backend.bat
```

**Mac/Linux:**
```bash
pip install -r requirements.txt
python api_server.py
```

✅ You should see: `API running on http://localhost:5000`

### 3️⃣ Start Frontend (Terminal 2)

**Windows:**
```bash
start-frontend.bat
```

**Mac/Linux:**
```bash
cd frontend
npm install
npm run dev
```

✅ You should see: `Local: http://localhost:3000/`

### 4️⃣ Open Browser

Go to: **http://localhost:3000**

🎉 **You should see the dashboard with charts!**

---

## 📸 What You'll See

- **Stats Cards** - Total recipes, diet types
- **Bar Chart** - Average macronutrients by diet
- **Pie Chart** - Recipe distribution
- **Scatter Plot** - Protein vs Carbs
- **Heatmap** - Nutrient correlations
- **Recipes Table** - Top protein-rich recipes

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** `FileNotFoundError: data/All_Diets.csv`
**Solution:** Make sure the CSV file is in the `data/` folder

**Problem:** `ModuleNotFoundError: No module named 'flask'`
**Solution:** Run `pip install -r requirements.txt`

### Frontend Won't Start

**Problem:** `npm: command not found`
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** Port 3000 already in use
**Solution:** Kill the process or change port in `frontend/vite.config.js`

### Dashboard Shows Error

**Problem:** "Failed to load nutritional insights"
**Solution:**
1. Check backend is running on port 5000
2. Check browser console (F12) for errors
3. Visit http://localhost:5000/api/insights directly

### CORS Errors

**Problem:** CORS policy error in browser
**Solution:** Make sure `flask-cors` is installed:
```bash
pip install flask-cors
```

---

## 🔍 Verify Everything is Working

### Test Backend API

Open in browser: http://localhost:5000/api/insights

You should see JSON data like:
```json
{
  "total_recipes": 1000,
  "diet_types": 5,
  "average_macronutrients": [...]
}
```

### Test Frontend

Open in browser: http://localhost:3000

You should see:
- Header: "Nutritional Insights Dashboard"
- 4 charts displaying data
- No error messages

---

## 📂 Folder Structure

```
cloud-assignment-1/
├── api_server.py          ← Backend API
├── frontend/              ← React app
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── package.json
├── data/
│   └── All_Diets.csv     ← PUT YOUR DATASET HERE
├── start-backend.bat      ← Windows: Start backend
├── start-frontend.bat     ← Windows: Start frontend
└── requirements.txt       ← Python dependencies
```

---

## 💡 Development Workflow

1. **Backend is running** → Terminal 1 on port 5000
2. **Frontend is running** → Terminal 2 on port 3000
3. **Make changes** → Both auto-reload
4. **View in browser** → http://localhost:3000

---

## 🎓 Next Steps

Once everything works locally:

1. **Deploy Backend** → Convert to Azure Function
2. **Deploy Frontend** → Azure Static Web Apps
3. **Update API URL** → Point to Azure endpoint

See `PHASE2_QUICKSTART.md` for deployment instructions.

---

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Make sure dataset exists: `ls data/All_Diets.csv`
3. Check ports are free: `netstat -an | findstr "5000\|3000"`
4. Try restarting both servers

**Common Issue:** If you see `Address already in use`, something is already running on that port. Stop it or change the port in the config files.
