# Import Libraries
import pandas as pd
import os
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Set Project Paths
project_root = os.path.dirname(os.path.abspath(__file__))
data_folder = os.path.join(project_root, 'data')
print("📁 Project root initialized as:", project_root)

# Handle Missing Values
def handle_missing_values(df, method='mean'):
    if method == 'zero':
        df = df.fillna(0)
    elif method == 'mean':
        df = df.fillna(df.mean(numeric_only=True))
    elif method == 'median':
        df = df.fillna(df.median(numeric_only=True))
    else:
        raise ValueError("Unsupported Missing Value Handling Method")
    return df

# Normalize Features
def normalize_features(df, method='minmax'):
    numeric_cols = df.select_dtypes(include='number').columns
    if method == 'minmax':
        scaler = MinMaxScaler()
    elif method == 'standard':
        scaler = StandardScaler()
    else:
        raise ValueError("Unsupported Normalization Method")
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    return df

# Preprocessing Pipeline
def preprocess_data(df):
    # Drop label column if present
    df = df.drop(columns=["Class"], errors="ignore")

    # Example preprocessing
    df = df.fillna(0)
    numeric_cols = df.select_dtypes(include='number').columns
    df[numeric_cols] = (df[numeric_cols] - df[numeric_cols].mean()) / df[numeric_cols].std()

    return df

# Load All Processed CSVs
def load_processed_data():
    files = [f for f in os.listdir(data_folder) if f.startswith('processed_') and f.endswith('.csv')]
    if not files:
        print("⚠ No processed CSV files found.")
        return None

    df_list = []
    for f in files:
        file_path = os.path.join(data_folder, f)
        try:
            df = pd.read_csv(file_path)
            df_list.append(df)
            print(f"✅ Loaded processed file: {f} — shape: {df.shape}")
        except Exception as e:
            print(f"❌ Error loading '{f}': {e}")

    combined_df = pd.concat(df_list, ignore_index=True)
    print(f"\n📊 Combined processed dataset shape: {combined_df.shape}")
    return combined_df

# Batch Preprocessing of Raw CSVs
csv_files = [f for f in os.listdir(data_folder) if f.lower().endswith('.csv')]
if not csv_files:
    print("⚠ No CSV files found in the data folder.")
else:
    print(f"📦 Found {len(csv_files)} CSV files.")

for file_name in csv_files:
    file_path = os.path.join(data_folder, file_name)
    try:
        df = pd.read_csv(file_path)
        print(f"\n✅ Loaded '{file_name}' — shape: {df.shape}")
        processed_df = preprocess_data(df)

        # Strip repeated 'processed_' prefixes
        base_name = file_name
        while base_name.startswith("processed_"):
            base_name = base_name[len("processed_"):]
        output_name = f"processed_{base_name}"

        output_path = os.path.join(data_folder, output_name)
        processed_df.to_csv(output_path, index=False)
        print(f"💾 Saved processed data to: {output_path}")

    except Exception as e:
        print(f"❌ Error processing '{file_name}': {e}")

# Model Training & Saving
if __name__ == "__main__":
    df = load_processed_data()
    if df is not None:
        print("📋 Columns in combined dataset:", df.columns.tolist())

        target_column = 'Class'
        if target_column in df.columns:
            from sklearn.model_selection import train_test_split
            X = df.drop(target_column, axis=1)
            y = df[target_column]

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            print(f"✅ Training set shape: {X_train.shape}")
            print(f"✅ Test set shape: {X_test.shape}")

            from sklearn.ensemble import RandomForestClassifier
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            print("✅ Model training complete.")

            from sklearn.metrics import classification_report, confusion_matrix
            y_pred = model.predict(X_test)
            print("📉 Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
            print("📋 Classification Report:\n", classification_report(y_test, y_pred))

            import joblib
            model_path = os.path.join(project_root, 'fraud_model.pkl')
            joblib.dump(model, model_path)
            print(f"💾 Model saved to: {model_path}")

