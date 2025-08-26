from datasets import load_dataset
import pandas as pd

# To Load the Hugging Face Link and to collect Dataset
def load_fraud_dataset():
    dataset = load_dataset("hugging face")
    df = dataset["train"].to_pandas()
    return df 

# Run the Function and shown DataFrame
if __name__ == "__main__":
  df = load_fraud_dataset()
  print("*** Dataset Loaded.shape:", df.shape)
  print(df.head())