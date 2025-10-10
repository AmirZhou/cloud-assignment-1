#!/usr/bin/env python3
"""
Task 3 (Enhanced): Cloud-Native Data Processing with Optimized Serverless Function
Enhancement applied:
- Lazy-loading heavy dependencies
- Global client reuse
- Lightweight image ready
- Optional /healthz endpoint for CI/CD warmup
"""

import os
import json
import io
from pathlib import Path
from dotenv import load_dotenv

# Lazy imports moved inside functions when possible
from flask import Flask

# --------------------------------------------------------------------------------------
# Global setup
# --------------------------------------------------------------------------------------

load_dotenv()
AZURITE_CONNECTION_STRING = (
    os.getenv("AZURITE_CONNECTION_STRING")
    or "AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
).strip()

CONTAINER_NAME = os.getenv("CONTAINER_NAME", "datasets")
BLOB_NAME = os.getenv("BLOB_NAME", "All_Diets.csv")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs" / "serverless"
RESULTS_DIR = OUTPUT_DIR / "results"

# Initialize reusable blob client once at cold start
try:
    from azure.storage.blob import BlobServiceClient
    blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)
except Exception as e:
    blob_service_client = None
    container_client = None
    print(f"⚠️ Blob client not initialized at import time: {e}")

# --------------------------------------------------------------------------------------
# Core Function
# --------------------------------------------------------------------------------------

def process_nutritional_data_from_azurite():
    """Download CSV from Azurite, calculate averages, and store results."""
    print("🔄 Processing nutritional data (optimized)...")

    # Lazy import heavy libs only when needed
    import pandas as pd

    try:
        if not container_client:
            raise RuntimeError("Azurite container client not available")

        blob_client = container_client.get_blob_client(BLOB_NAME)
        print(f"📥 Downloading {BLOB_NAME} from Azurite...")
        stream = blob_client.download_blob().readall()

        df = pd.read_csv(io.BytesIO(stream), encoding="utf-8")
        print(f"✅ Loaded dataset: {len(df)} rows")

        print("🧮 Calculating macronutrient averages...")
        required_cols = ["Diet_type", "Protein(g)", "Carbs(g)", "Fat(g)"]
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"Missing required column: {col}")

        avg_macros = (
            df.groupby("Diet_type")[["Protein(g)", "Carbs(g)", "Fat(g)"]]
            .mean().round(2).reset_index()
        )

        results = {
            "total_recipes": int(len(df)),
            "diet_types": int(df["Diet_type"].nunique()),
            "average_macronutrients": avg_macros.to_dict(orient="records"),
            "processing_status": "success"
        }

        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        with open(RESULTS_DIR / "serverless_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        print("✅ Results saved successfully")
        return "Data processed successfully"

    except Exception as e:
        print(f"❌ Error during processing: {e}")
        return str(e)

# --------------------------------------------------------------------------------------
# Health Check Endpoint (for CI/CD warm-up)
# --------------------------------------------------------------------------------------

app = Flask(__name__)

@app.route("/healthz")
def health_check():
    """Lightweight warm-up endpoint."""
    return "OK", 200

# --------------------------------------------------------------------------------------
# Entry Point
# --------------------------------------------------------------------------------------

def main():
    print("🚀 Starting optimized serverless simulation")
    print("=" * 50)
    result = process_nutritional_data_from_azurite()
    print(f"📋 Function result: {result}")

if __name__ == "__main__":
    # Run Flask server only if explicitly requested
    if os.getenv("RUN_SERVER", "false").lower() == "true":
        app.run(host="0.0.0.0", port=7071)
    else:
        main()
