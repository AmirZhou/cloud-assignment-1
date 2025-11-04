# Backend Developer Handover Guide

## 👋 Welcome Backend Developer!

This guide will help you convert the current Flask API to Azure Functions and deploy it to Azure.

---

## 📂 Current Architecture

```
Local Development:
┌─────────────────────┐      HTTP      ┌──────────────────┐      Reads      ┌─────────────┐
│  React Frontend     │───────────────▶│   Flask API      │────────────────▶│  CSV File   │
│  localhost:3000     │                │   localhost:5000 │                 │  data/      │
└─────────────────────┘                └──────────────────┘                 └─────────────┘
```

```
Production (Azure):
┌─────────────────────┐      HTTPS     ┌──────────────────┐      Reads      ┌─────────────────┐
│  Azure Static       │───────────────▶│  Azure Function  │────────────────▶│  Azure Blob     │
│  Web App            │                │  HTTP Trigger    │                 │  Storage        │
└─────────────────────┘                └──────────────────┘                 └─────────────────┘
```

---

## 📝 What You're Taking Over

### Current Files:
- **`api_server.py`** - Flask API with 3 endpoints
- **`data/All_Diets.csv`** - 7,806 recipes dataset
- **`requirements.txt`** - Python dependencies

### Your Mission:
1. Convert Flask API to Azure Functions
2. Upload dataset to Azure Blob Storage
3. Deploy to Azure
4. Provide URL to frontend team

---

## 🎯 Step-by-Step Conversion Guide

### Step 1: Install Azure Functions Core Tools

**Windows:**
```bash
npm install -g azure-functions-core-tools@4
```


### Step 2: Create Azure Function Project

```bash
# Create new directory for Azure Functions
mkdir azure-functions
cd azure-functions

# Initialize Azure Functions project
func init . --python --worker-runtime python

# Create HTTP trigger functions
func new --name GetInsights --template "HTTP trigger" --authlevel anonymous
func new --name GetRecipes --template "HTTP trigger" --authlevel anonymous
func new --name HealthCheck --template "HTTP trigger" --authlevel anonymous
```

### Step 3: Convert Flask Code to Azure Functions

#### Example: GetInsights Function

**File Structure:**
```
azure-functions/
├── GetInsights/
│   ├── __init__.py
│   └── function.json
├── GetRecipes/
│   ├── __init__.py
│   └── function.json
├── HealthCheck/
│   ├── __init__.py
│   └── function.json
├── host.json
├── local.settings.json
└── requirements.txt
```

#### `GetInsights/__init__.py`

```python
import logging
import json
import azure.functions as func
import pandas as pd
import numpy as np
from azure.storage.blob import BlobServiceClient

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing GetInsights request')

    try:
        # Load data from Azure Blob Storage
        df = load_data_from_blob()

        # Calculate insights (copy from api_server.py)
        response = {
            'total_recipes': int(len(df)),
            'diet_types': int(df['Diet_type'].nunique()),
            'average_macronutrients': calculate_macronutrient_averages(df),
            'diet_distribution': get_diet_distribution(df),
            'protein_carbs_scatter': get_protein_carbs_relationship(df),
            'correlation_heatmap': get_correlation_heatmap(df),
            'processing_status': 'success'
        }

        return func.HttpResponse(
            json.dumps(response),
            mimetype="application/json",
            status_code=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        )

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({'error': str(e)}),
            mimetype="application/json",
            status_code=500
        )

def load_data_from_blob():
    """Load CSV from Azure Blob Storage"""
    import os

    connection_string = os.environ["AzureWebJobsStorage"]
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    container_name = "datasets"
    blob_name = "All_Diets.csv"

    blob_client = blob_service_client.get_blob_client(
        container=container_name,
        blob=blob_name
    )

    stream = blob_client.download_blob().readall()
    df = pd.read_csv(io.BytesIO(stream), encoding="utf-8")
    df.fillna(df.mean(numeric_only=True), inplace=True)

    return df

# Copy helper functions from api_server.py:
# - calculate_macronutrient_averages()
# - get_diet_distribution()
# - get_protein_carbs_relationship()
# - get_correlation_heatmap()
```

#### `GetInsights/function.json`

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "insights"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

### Step 4: Update Requirements

**`requirements.txt`:**
```
azure-functions
pandas>=1.5.0
numpy>=1.21.0
azure-storage-blob>=12.14.0
```

### Step 5: Configure CORS

**`host.json`:**
```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "maxTelemetryItemsPerSecond": 20
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "extensions": {
    "http": {
      "routePrefix": "api"
    }
  },
  "cors": {
    "allowedOrigins": ["*"],
    "supportCredentials": false
  }
}
```

### Step 6: Test Locally

```bash
# Start Azure Functions locally
func start

# Test endpoints
curl http://localhost:7071/api/insights
curl http://localhost:7071/api/recipes
curl http://localhost:7071/api/health
```

---

## ☁️ Deploy to Azure

### Option 1: Azure Portal

1. **Create Function App:**
   - Go to Azure Portal → Create Resource
   - Search "Function App"
   - Runtime: Python 3.9+
   - Region: Choose closest to users
   - Plan: Consumption (serverless)

2. **Create Storage Account:**
   - Create storage account for blob storage
   - Create container named `datasets`
   - Upload `All_Diets.csv` to container

3. **Deploy Code:**
   ```bash
   # Login to Azure
   az login

   # Deploy to Function App
   func azure functionapp publish <YOUR-FUNCTION-APP-NAME>
   ```

4. **Set Environment Variables:**
   - Go to Function App → Configuration
   - Add connection string for Blob Storage

### Option 2: VS Code

1. Install Azure Functions extension
2. Right-click on project → "Deploy to Function App"
3. Select/create Function App
4. Wait for deployment

---

## 🔗 Get Your API URL

After deployment:

```
https://<your-function-app-name>.azurewebsites.net/api/insights
https://<your-function-app-name>.azurewebsites.net/api/recipes
https://<your-function-app-name>.azurewebsites.net/api/health
```

**Send this URL to the frontend team!**

---

## 📊 Upload Dataset to Blob Storage

### Using Azure Portal:
1. Go to Storage Account
2. Containers → Create container "datasets"
3. Upload `All_Diets.csv`

### Using Azure CLI:
```bash
# Upload CSV to blob storage
az storage blob upload \
  --account-name <storage-account-name> \
  --container-name datasets \
  --name All_Diets.csv \
  --file data/All_Diets.csv
```

### Using Python:
```python
from azure.storage.blob import BlobServiceClient

connection_string = "YOUR_CONNECTION_STRING"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

container_client = blob_service_client.get_container_client("datasets")
container_client.create_container()

with open("data/All_Diets.csv", "rb") as data:
    blob_client = container_client.get_blob_client("All_Diets.csv")
    blob_client.upload_blob(data, overwrite=True)
```

---

## 🧪 Testing Checklist

Before giving URL to frontend team:

- [ ] `/api/insights` returns 200 OK with correct JSON structure
- [ ] `/api/recipes` returns all 7,806 recipes
- [ ] `/api/health` returns healthy status
- [ ] CORS is enabled (test from browser)
- [ ] Dataset loads from Blob Storage (not local file)
- [ ] Function logs show no errors
- [ ] Performance is acceptable (< 3 seconds response time)

---

## 🔍 Debugging Tips

**Check Logs:**
```bash
# Stream logs
func azure functionapp logstream <YOUR-FUNCTION-APP-NAME>
```

**Common Issues:**

1. **CORS errors:** Check `host.json` CORS settings
2. **Blob not found:** Verify container and blob name
3. **Slow performance:** Consider caching or pre-processing data
4. **Memory errors:** Increase Function App plan if needed

---

## 📚 Reference Files

**You need these files from `api_server.py`:**

1. **`load_and_process_data()`** → Convert to `load_data_from_blob()`
2. **`calculate_macronutrient_averages()`** → Copy as-is
3. **`get_diet_distribution()`** → Copy as-is
4. **`get_protein_carbs_relationship()`** → Copy as-is
5. **`get_correlation_heatmap()`** → Copy as-is

**Key Changes:**
- Replace `pd.read_csv(DATA_PATH)` with blob storage read
- Add CORS headers to all responses
- Use Azure Functions HTTP response format
- Use environment variables for connection strings

---

## 📞 Handover to Frontend Team

Once deployed, provide:

1. **Azure Function Base URL:**
   ```
   https://<your-app>.azurewebsites.net
   ```

2. **Endpoints:**
   - `GET /api/insights` - Visualization data
   - `GET /api/recipes` - All recipes
   - `GET /api/health` - Health check

3. **Response Format:** See `API_DOCUMENTATION.md`

Frontend team will update their `.env` file:
```
VITE_API_URL=https://<your-app>.azurewebsites.net
```

---

## 💰 Cost Estimation

**Consumption Plan (Pay-per-use):**
- First 1M executions: FREE
- After: $0.20 per million executions
- Storage: ~$0.02/month for CSV file

**Expected costs:** < $5/month for development

---

## 📖 Additional Resources

- [Azure Functions Python Developer Guide](https://docs.microsoft.com/azure/azure-functions/functions-reference-python)
- [Azure Blob Storage Python SDK](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-python)
- [CORS Configuration](https://docs.microsoft.com/azure/azure-functions/functions-how-to-use-azure-function-app-settings)

---

## ✅ Quick Checklist

- [ ] Azure Functions Core Tools installed
- [ ] Azure account set up
- [ ] Function App created in Azure
- [ ] Storage Account created
- [ ] Dataset uploaded to Blob Storage
- [ ] Code converted from Flask to Azure Functions
- [ ] CORS configured
- [ ] Tested locally with `func start`
- [ ] Deployed to Azure
- [ ] All endpoints tested in production
- [ ] URL provided to frontend team

---

**Questions?** Check `API_DOCUMENTATION.md` for API specs or contact the frontend team!

Good luck! 🚀
