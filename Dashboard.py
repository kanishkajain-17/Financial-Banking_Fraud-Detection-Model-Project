### Import Libraries
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os
import seaborn as sns
import matplotlib.pyplot as plt

# ---  Paths ---
BASE_PATH = r"your project base path"
DATA_PATH = os.path.join(BASE_PATH, "data", "Feature_Engineering_Data.csv")
MODEL_PATH = os.path.join(BASE_PATH, "Notebook", "Trained_Models", "Supervised", "RandomForest", "RandomForest.joblib")

# ---  Page Config ---
st.set_page_config("Fraud Detection Dashboard", layout="wide")
st.title("💳 Real-Time Fraud Detection Dashboard")

# ---  Load Data Efficiently ---
@st.cache_data
def load_data(path, chunk_size=500, max_rows=5000):
    chunks, total = [], 0
    for chunk in pd.read_csv(path, chunksize=chunk_size, low_memory=False, on_bad_lines='skip'):
        chunks.append(chunk)
        total += len(chunk)
        if total >= max_rows:
            break
    return pd.concat(chunks, ignore_index=True)

df = load_data(DATA_PATH)

# --- 🧹 Clean & Rename Columns ---
df["Class"] = df["isfraud"]
df["location_code"] = "Location_A"  

st.subheader("📋 Sample Data Preview")
st.dataframe(df.head())

# --- Predict Sample Transaction ---
st.subheader("🔍 Predict Sample Transaction")
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)

        # Manually specify features used during training
        trained_features = [
            "amount", "oldbalanceorg", "newbalanceorig",
            "oldbalancedest", "newbalancedest", "isflaggedfraud",
            "orig_balance_diff", "dest_balance_diff",
            "type_CASH_OUT", "suspicious_zero_balance"
        ]

        sample = df.sample(1, random_state=42)
        sample_input = sample[trained_features]
        prediction = model.predict(sample_input)[0]
        result = "❗ Fraudulent" if prediction == 1 else "✅ Legitimate"

        st.success(f"Random Forest Prediction: {result}")
        st.write("🔎 Sample Used for Prediction:")
        st.dataframe(sample)
    except Exception as e:
        st.error(f"❌ Prediction Error: {e}")
else:
    st.warning("⚠️ Random Forest model file not found.")

# ---  Fraud Frequency by Location ---
st.subheader("📊 Fraud Frequency by Location")
fraud_locations = df[df["Class"] == 1]["location_code"].value_counts()
st.bar_chart(fraud_locations)

# --- Fraud Feature Correlation Heatmap ---
st.subheader("🔥 Fraud Feature Correlation Heatmap")
try:
    fraud_df = df[df["Class"] == 1]
    corr_matrix = fraud_df.select_dtypes(include=[np.number]).corr()
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap="Reds", ax=ax)
    st.pyplot(fig)
except Exception as e:
    st.error(f" Heatmap Error: {e}")
