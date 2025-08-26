### Import Libraries
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler

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

# Data Normalization
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

# Preprocessing PipeLine
def preprocess_data(df, missing_method='mean', norm_method='minmax'):
    df = handle_missing_values(df, method=missing_method)
    print("***  Missing values handled using:", missing_method)
    df = normalize_features(df, method=norm_method)
    print("****  Features normalized using:", norm_method)
    print("@@@&& Preprocessing complete.")
    return df


### Test the Preprocessing
if __name__ == "__main__":
    path_folder = r"Cleaned Data csv"
    df = pd.read_csv(path_folder)

    processed_df = preprocess_data(df)
    print(processed_df.head())

    ### To Save the Preprocessing Data
    output_folder = r"Processed Data csv"
    processed_df.to_csv(output_folder, index=False)
    print(f"***@@@  Processed data saved to {output_folder}")

