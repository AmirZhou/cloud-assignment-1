# modified from src/serverless_functions.py
import logging
import time
import os
import io
import pandas as pd
from azure.storage.blob import BlobServiceClient

# Blob Storage settings
CONTAINER = os.environ.get("BLOB_CONTAINER", "datasets")
BLOB = os.environ.get("BLOB_NAME", "All_Diets.csv")

_blob_cache = {"etag": None, "df": None, "loaded_at": None}
logger = logging.getLogger("blob_cache")

def read_csv_from_blob() -> pd.DataFrame:
    conn = os.environ["AzureWebJobsStorage"]
    bsc = BlobServiceClient.from_connection_string(conn)
    bc = bsc.get_container_client(CONTAINER).get_blob_client(BLOB)
    
    props = bc.get_blob_properties()
    etag = props.etag
    
    # check cache first, if cache is valid return cached DataFrame
    if _blob_cache["etag"] == etag and _blob_cache["df"] is not None:
        logger.info(f"Cache hit for {BLOB} (ETag: {etag})")
        return _blob_cache["df"].copy()
    
    # if not cached, download
    logger.warning(f"Cache miss for {BLOB} - downloading (ETag: {etag})")
    start = time.time()
    data = bc.download_blob().readall()
    df = pd.read_csv(io.BytesIO(data), encoding="utf-8")
    elapsed = time.time() - start
    
    _blob_cache["etag"] = etag
    _blob_cache["df"] = df
    _blob_cache["loaded_at"] = time.time()
    
    logger.info(f"Loaded {len(df)} rows in {elapsed:.2f}s")
    return df.copy()  # return a copy to avoid external modification