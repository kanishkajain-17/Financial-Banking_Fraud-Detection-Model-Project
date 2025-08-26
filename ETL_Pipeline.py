import pandas as pd
from datasets import load_dataset
import os

# Save Raw Data
def save_raw_data(df, path="raw data csv"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"*** Raw dataset saved to {path}")

# Extract----
def extract(df):
    df.columns = [col.lower().strip().replace(" ", "_") for col in df.columns]
    return df.drop_duplicates()

# Transform----
def transform(df):
    df["step"] = df["step"].astype(int)
    return df

# Load------
def load(df, path="Cleaned Data csv"):
    os.makedirs(os.path.dirname(path), exist_ok=True) 
    df.to_csv(path, index=False)
    print(f"***&&& Cleaned dataset saved to {path}")

#  Run ETL
def run_etl():
    print("$$$ Loading dataset from Hugging Face...")
    dataset = load_dataset("hugging face id")
    df = dataset["train"].to_pandas()
    print(f"!!!*** Dataset Loaded. Shape: {df.shape}")
    print(df.head())

     # Save the raw dataset
    save_raw_data(df)

    # Run ETL steps
    df = extract(df)
    df = transform(df)
    load(df)


if __name__ == "__main__":
    run_etl()
