from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from Preprocessing import preprocess_data, load_processed_data

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("fraud_model.pkl")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # CSV load
        df = pd.read_csv(file.file)

        # Preprocess
        processed_df = preprocess_data(df)

        # Model prediction
        predictions = model.predict(processed_df)

        # Stats calculate
        total_transactions = len(predictions)
        fraud_count = int((predictions == 1).sum())  # assuming 1 = Fraud
        accuracy = round(((total_transactions - fraud_count) / total_transactions) * 100, 2) if total_transactions > 0 else 0

        return {
            "predictions": predictions.tolist(),
            "accuracy": accuracy,
            "total_transactions": total_transactions,
            "fraudulent_transactions": fraud_count
        }
    except Exception as e:
        return {"error": str(e)}

# ✅ API to get processed data (for dashboard table)
@app.get("/data")
async def get_data():
    try:
        df = load_processed_data()  
        if df is not None:
            return df.to_dict(orient="records")  # JSON table return
        else:
            return {"error": "No data found"}
    except Exception as e:
        return {"error": str(e)}
