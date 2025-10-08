#!/usr/bin/env python3
"""
Task 3: Cloud-Native Data Processing with Serverless Functions
Serverless Lead: Start setup immediately!

This script simulates Azure Function processing with Azurite Blob Storage.
(HTTP trigger is not required here; we simulate the invocation via main()).
"""

from azure.storage.blob import BlobServiceClient
import pandas as pd
import json
import io
from pathlib import Path
import os

from dotenv import load_dotenv
load_dotenv()

AZURITE_CONNECTION_STRING = (os.getenv("AZURITE_CONNECTION_STRING") or "UseDevelopmentStorage=true").strip()
CONTAINER_NAME = os.getenv("CONTAINER_NAME", "datasets")
BLOB_NAME = os.getenv("BLOB_NAME", "All_Diets.csv")


# --------------------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------------------

# Prefer env var; fall back to Azurite built-in shorthand.
AZURITE_CONNECTION_STRING = "AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
CONTAINER_NAME = "datasets"
BLOB_NAME = "All_Diets.csv"

# Resolve paths relative to project root:
# <project_root>/
#   data/All_Diets.csv
#   outputs/serverless/results/serverless_results.json
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs" / "serverless"
RESULTS_DIR = OUTPUT_DIR / "results"

# --------------------------------------------------------------------------------------
# Helper / Setup
# --------------------------------------------------------------------------------------

# def setup_azurite_environment():
#     """
#     Setup instructions for Azurite Blob Storage emulator
#     (kept for report/screenshot guidance; not executed automatically).
#     """
#     print("🔧 Setting up Azurite environment...")
#     print("=" * 50)
#     print("REQUIRED SETUP STEPS:")
#     print()
#     print("1. Install Azurite:")
#     print("   npm install -g azurite")
#     print("   OR")
#     print("   docker run -p 10000:10000 -p 10001:10001 mcr.microsoft.com/azure-storage/azurite")
#     print()
#     print("2. Start Azurite:")
#     print("   azurite --silent --location /tmp/azurite --debug /tmp/azurite/debug.log")
#     print()
#     print("3. Install Azure SDK:")
#     print("   pip install azure-storage-blob")
#     print()
#     print("4. Use Azure Storage Explorer to upload All_Diets.csv:")
#     print("   - Connect to: http://127.0.0.1:10000/devstoreaccount1")
#     print("   - Create container: 'datasets'")
#     print("   - Upload: All_Diets.csv")
#     print()

def test_azurite_connection():
    """
    Test connection to Azurite.
    Note: constructing the client does not validate the key; a real request will.
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        # Listing containers triggers an authenticated request.
        containers = blob_service_client.list_containers()
        print("✅ Successfully connected to Azurite")
        print("📦 Available containers:")
        for c in containers:
            print(f"   - {c.name}")
        return True
    except Exception as e:
        print(f"❌ Cannot connect to Azurite: {e}")
        print("💡 Make sure Azurite is running: azurite --silent --location /tmp/azurite")
        return False

def create_blob_container():
    """
    Create blob container if it doesn't exist.
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)

        # Create container if it doesn't exist (exists() sends a HEAD request).
        if not container_client.exists():
            container_client.create_container()
            print(f"✅ Created container: {CONTAINER_NAME}")
        else:
            print(f"✅ Container already exists: {CONTAINER_NAME}")

        return True
    except Exception as e:
        print(f"❌ Error creating container: {e}")
        print("💡 Make sure Azurite is running on http://127.0.0.1:10000")
        return False

def upload_dataset_to_azurite():
    """
    Upload All_Diets.csv to Azurite if the local file is present.
    This is optional because we often upload via Storage Explorer for screenshots.
    """
    dataset_path = DATA_DIR / BLOB_NAME

    if not dataset_path.exists():
        print(f"⚠️  Dataset not found at: {dataset_path}")
        print("💡 You can upload All_Diets.csv via Azure Storage Explorer instead.")
        return False

    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=BLOB_NAME)

        with open(dataset_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)

        print(f"✅ Uploaded {BLOB_NAME} to Azurite from local data folder")
        return True

    except Exception as e:
        print(f"❌ Error uploading to Azurite: {e}")
        return False

def blob_exists(container: str = CONTAINER_NAME, blob: str = BLOB_NAME) -> bool:
    """
    Check if the blob already exists in Azurite.
    This enables the 'manual upload via Storage Explorer' workflow.
    """
    try:
        bsc = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        bc = bsc.get_blob_client(container=container, blob=blob)
        return bc.exists()
    except Exception as e:
        print(f"❌ Error checking blob existence: {e}")
        return False

# --------------------------------------------------------------------------------------
# Core Processing
# --------------------------------------------------------------------------------------

def process_nutritional_data_from_azurite():
    """
    Main serverless function: Process data from Azurite Blob Storage.
    - Downloads CSV from Azurite.
    - Calculates macronutrient averages by Diet_type.
    - Saves results to local JSON (simulate NoSQL storage).
    """
    print("🔄 Processing nutritional data from Azurite...")

    try:
        # Connect to Azurite and get blob client
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=BLOB_NAME)

        # Download blob content
        print(f"📥 Downloading {BLOB_NAME} from Azurite...")
        stream = blob_client.download_blob().readall()

        # Read CSV from bytes; explicitly set UTF-8 to be robust.
        df = pd.read_csv(io.BytesIO(stream), encoding="utf-8")

        print(f"✅ Loaded dataset: {len(df)} rows")

        # Process data - calculate averages (columns must exist)
        print("🧮 Calculating macronutrient averages...")
        required_cols = ["Diet_type", "Protein(g)", "Carbs(g)", "Fat(g)"]
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"CSV is missing required column: {col}")

        avg_macros = (
            df.groupby("Diet_type")[["Protein(g)", "Carbs(g)", "Fat(g)"]]
              .mean()
              .round(2)
              .reset_index()
        )

        # Prepare results payload
        results = {
            "total_recipes": int(len(df)),
            "diet_types": int(df["Diet_type"].nunique()),
            "average_macronutrients": avg_macros.to_dict(orient="records"),
            "processing_status": "success"
        }

        # Save results (simulate NoSQL storage)
        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        results_file = RESULTS_DIR / "serverless_results.json"

        with results_file.open("w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        print(f"✅ Results saved to: {results_file}")
        print(f"📊 Processed {results['total_recipes']} recipes across {results['diet_types']} diet types")

        return "Data processed and stored successfully"

    except Exception as e:
        error_msg = f"Error processing data: {e}"
        print(f"❌ {error_msg}")
        return error_msg

def simulate_event_trigger():
    """
    Simulate event-driven function execution
    (Since Azurite doesn't support real triggers).
    In real Azure, a blob upload or an HTTP trigger would invoke this.
    """
    print("⚡ Simulating event-driven serverless execution...")
    print("💡 In real Azure: an HTTP trigger or Blob trigger would call this function automatically.")

    # Simulate function trigger
    result = process_nutritional_data_from_azurite()
    print(f"\n📋 Function Result: {result}")

# --------------------------------------------------------------------------------------
# Entry Point
# --------------------------------------------------------------------------------------

def main():
    """
    Main execution function for Task 3.
    Keeps the original guidance output for your report/screenshots.
    Now also supports the 'manually uploaded via Storage Explorer' path.
    """
    print("🚀 Starting Task 3: Serverless Data Processing")
    print("=" * 50)

    # Setup guidance (for report / reproducibility)
    # setup_azurite_environment()

    # Test Azurite connection (sends a real request)
    if not test_azurite_connection():
        print("\n❌ Please start Azurite first")
        return

    # Ensure container exists
    if not create_blob_container():
        return

    # Optional upload from local data/ (useful if you want code-managed upload)
    upload_success = upload_dataset_to_azurite()

    # If local upload failed but the blob already exists in Azurite
    # (because you uploaded it via Storage Explorer), we still proceed.
    if upload_success or blob_exists():
        simulate_event_trigger()

        print("\n✅ Task 3 completed successfully!")
        print("📋 Deliverables created:")
        print(f"   - Serverless function: {__file__}")
        print(f"   - Results: {RESULTS_DIR / 'serverless_results.json'}")
    else:
        print("\n  All_Diets.csv not found in Azurite or local data folder.")
        print("💡 Upload via Azure Storage Explorer (container 'datasets', blob 'All_Diets.csv') and run again.")

if __name__ == "__main__":
    main()
