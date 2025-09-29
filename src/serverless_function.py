#!/usr/bin/env python3
"""
Task 3: Cloud-Native Data Processing with Serverless Functions
Serverless Lead: Start setup immediately!

This script simulates Azure Function processing with Azurite Blob Storage.
"""

from azure.storage.blob import BlobServiceClient
import pandas as pd
import json
import io
from pathlib import Path
import os

# Configuration
AZURITE_CONNECTION_STRING = (
    "DefaultEndpointsProtocol=http;"
    "AccountName=devstoreaccount1;"
    "AccountKey=Eby8vdM02xNOcqFlFeqCnrC4xF-vdQ2h-VJHcaE0Mq4k3a9t7C8qT4p6j7d2k6v4q9m3z6Q2r7s8u5w2x9y3g8c;"
    "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
)

CONTAINER_NAME = "datasets"
BLOB_NAME = "All_Diets.csv"
RESULTS_DIR = "../outputs/serverless"

def setup_azurite_environment():
    """
    Setup instructions for Azurite Blob Storage emulator
    """
    print("🔧 Setting up Azurite environment...")
    print("=" * 50)
    print("REQUIRED SETUP STEPS:")
    print()
    print("1. Install Azurite:")
    print("   npm install -g azurite")
    print("   OR")
    print("   docker run -p 10000:10000 -p 10001:10001 mcr.microsoft.com/azure-storage/azurite")
    print()
    print("2. Start Azurite:")
    print("   azurite --silent --location /tmp/azurite --debug /tmp/azurite/debug.log")
    print()
    print("3. Install Azure SDK:")
    print("   pip install azure-storage-blob")
    print()
    print("4. Use Azure Storage Explorer to upload All_Diets.csv:")
    print("   - Connect to: http://127.0.0.1:10000/devstoreaccount1")
    print("   - Create container: 'datasets'")
    print("   - Upload: All_Diets.csv")
    print()

def create_blob_container():
    """
    Create blob container if it doesn't exist
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        
        # Create container if it doesn't exist
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
    Upload All_Diets.csv to Azurite if not already uploaded
    """
    dataset_path = "../data/All_Diets.csv"
    
    if not os.path.exists(dataset_path):
        print(f"⚠️  Dataset not found at: {dataset_path}")
        print("💡 Please download All_Diets.csv to the data/ folder")
        return False
    
    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(
            container=CONTAINER_NAME, 
            blob=BLOB_NAME
        )
        
        # Upload file
        with open(dataset_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)
        
        print(f"✅ Uploaded {BLOB_NAME} to Azurite")
        return True
        
    except Exception as e:
        print(f"❌ Error uploading to Azurite: {e}")
        return False

def process_nutritional_data_from_azurite():
    """
    Main serverless function: Process data from Azurite Blob Storage
    """
    print("🔄 Processing nutritional data from Azurite...")
    
    try:
        # Connect to Azurite
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(
            container=CONTAINER_NAME,
            blob=BLOB_NAME
        )
        
        # Download blob content
        print(f"📥 Downloading {BLOB_NAME} from Azurite...")
        stream = blob_client.download_blob().readall()
        df = pd.read_csv(io.BytesIO(stream))
        
        print(f"✅ Loaded dataset: {len(df)} rows")
        
        # Process data - calculate averages
        print("🧮 Calculating macronutrient averages...")
        avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
        
        # Prepare results
        results = {
            "total_recipes": len(df),
            "diet_types": df['Diet_type'].nunique(),
            "average_macronutrients": avg_macros.reset_index().to_dict(orient='records'),
            "processing_status": "success"
        }
        
        # Save results (simulate NoSQL storage)
        Path(RESULTS_DIR).mkdir(parents=True, exist_ok=True)
        results_file = f"{RESULTS_DIR}/serverless_results.json"
        
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
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
    (Since Azurite doesn't support real triggers)
    """
    print("⚡ Simulating event-driven serverless execution...")
    print("💡 In real Azure: Blob upload would trigger this function automatically")
    
    # Simulate function trigger
    result = process_nutritional_data_from_azurite()
    
    print(f"\n📋 Function Result: {result}")

def test_azurite_connection():
    """
    Test connection to Azurite
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(AZURITE_CONNECTION_STRING)
        containers = blob_service_client.list_containers()
        print("✅ Successfully connected to Azurite")
        print("📦 Available containers:")
        for container in containers:
            print(f"   - {container.name}")
        return True
    except Exception as e:
        print(f"❌ Cannot connect to Azurite: {e}")
        print("💡 Make sure Azurite is running: azurite --silent --location /tmp/azurite")
        return False

def main():
    """
    Main execution function for Task 3
    """
    print("🚀 Starting Task 3: Serverless Data Processing")
    print("=" * 50)
    
    # Setup instructions
    setup_azurite_environment()
    
    # Test Azurite connection
    if not test_azurite_connection():
        print("\n❌ Please start Azurite first")
        return
    
    # Create container
    if not create_blob_container():
        return
    
    # Upload dataset (optional - can use Azure Storage Explorer)
    upload_success = upload_dataset_to_azurite()
    
    if upload_success:
        # Simulate serverless function execution
        simulate_event_trigger()
        
        print("\n✅ Task 3 completed successfully!")
        print("📋 Deliverables created:")
        print(f"   - Serverless function: {__file__}")
        print(f"   - Results: {RESULTS_DIR}/serverless_results.json")
    else:
        print("\n⚠️  Upload dataset first, then run again")
        print("💡 Alternative: Use Azure Storage Explorer to upload manually")

if __name__ == "__main__":
    main()