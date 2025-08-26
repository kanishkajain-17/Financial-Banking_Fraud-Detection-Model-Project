### Import Libraries
import pandas as pd

### Create Balance Change Features
def create_balance_change_features(df):
    df['orig_balance_diff'] = df['oldbalanceorg'] - df['newbalanceorig']
    df['dest_balance_diff'] = df['newbalancedest'] - df['oldbalancedest']
    return df

### Encode Transaction Type with One-Hot Encoding
def encode_transaction_type(df):
    if 'type' in df.columns:
        df = pd.get_dummies(df, columns=['type'], drop_first=True)
    return df

### Flag Suspicious Zero-Balance Transactions
def flag_zero_balance_anomalies(df):
    df['suspicious_zero_balance'] = ((df['oldbalanceorg'] == 0) & (df['amount'] > 0)).astype(int)
    return df

### Feature Engineering PipeLine
def engineer_features(df):
    df = create_balance_change_features(df)
    df = encode_transaction_type(df)
    df = flag_zero_balance_anomalies(df)
    return df

### Test To Run
if __name__ == "__main__":
    try:
        folder_path = r"Processed Data csv"
        df = pd.read_csv(folder_path)
        print("@@@**** Preprocessed data loaded.")

        # Apply Feature Engineering
        engineering_df = engineer_features(df)
        print("*** Feature Engineering Applied.")

        # Engineering dataframe
        print("\n ** Preview of Engineered data:\n")
        print(engineering_df.head())

        ### To Save the Feature Engineering Data
        output_path = r"Feature Engineering Data csv"
        engineering_df.to_csv(output_path, index=False)
        print(f"\n&&&*** Feature Engineering data successfully saved to:\n📍 {output_path}")
    except Exception as e:
        print(f"An error occurred: {e}")
