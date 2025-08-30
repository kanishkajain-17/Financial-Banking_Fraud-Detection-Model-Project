# 💳 Financial Fraud Detection Model with Dashboard

## 📌 Project Overview

This project leverages Machine Learning (ML), Data Analytics, and Real-Time Monitoring to detect fraudulent financial transactions. It is designed for banks, fintech companies, and financial institutions to mitigate risk and prevent fraud. The system includes supervised and unsupervised models, anomaly detection, and an interactive dashboard for real-time insights.

---

## ✨ Key Features

### 1️⃣ Data Acquisition & Preprocessing
- Collect transactional data from:
  - Banking systems
  - Payment gateways
  - Hugging Face datasets (`hugging_id`)
- Perform ETL operations
- Handle missing values and apply normalization
- Apply feature engineering to capture behavioral patterns and anomalies

### 2️⃣ Fraud Detection Algorithms

#### 🔹 Supervised Models
- Logistic Regression
- Decision Trees & Random Forest
- Gradient Boosting (XGBoost, LightGBM)

#### 🔹 Unsupervised Models
- Isolation Forest
- One-Class SVM
- Autoencoders (deep learning anomaly detection)

#### 🔹 Graph-Based Analysis *(planned)*
- Detect fraudulent networks and relationships between entities

### 3️⃣ Real-Time Fraud Monitoring *(planned)*
- Stream transaction data using Apache Kafka / Spark Streaming
- Implement alerting system for high-risk transactions

### 4️⃣ Interactive Dashboard & Reporting
- Real-time fraud visualization with heatmaps, bar charts, anomaly scores
- Built with Streamlit

---

## ✅ Expected Deliverables
- 📂 Cleaned dataset & preprocessing scripts
- 🤖 Fraud detection model implementations (supervised, unsupervised, deep learning)
- 📊 Evaluation metrics (Precision, Recall, F1-Score, AUC)
- 📉 Interactive fraud detection dashboard
- 📁 GitHub repository with documentation
- 🎥 Final presentation or video demo *(optional)*

---

## 🔧 Core Modules

| Module | Description |
|--------|-------------|
| [`Preprocessing.py`](./Preprocessing.py) | Cleans and normalizes data, trains and saves fraud detection model |
| [`predict.py`](./predict.py) | Loads saved model and runs predictions on new data |
| [`Feature_Engineering.py`](./Feature_Engineering.py) | Creates new features to improve model performance |
| [`ETL_Pipeline.py`](./ETL_Pipeline.py) | Handles data extraction, transformation, and loading |
| [`Dashboard.py`](./Dashboard.py) | Streamlit-based dashboard for fraud visualization |
| [`Supervised_Models.ipynb`](./Supervised_Models.ipynb) | Experiments with classification models |
| [`Unsupervised_Models.ipynb`](./Unsupervised_Models.ipynb) | Experiments with anomaly detection models |

---

## 🎯 Learning Outcomes
- Strong understanding of fraud detection techniques
- Hands-on experience with real-world financial transaction data
- Implementation of supervised, unsupervised, and graph-based models
- Real-time data streaming and anomaly detection
- Dashboard development for fraud monitoring

---

## 🔮 Future Enhancements
- AI-driven risk scoring for customer creditworthiness
- Blockchain-based fraud prevention
- Mobile app integration for instant fraud alerts

---

## 📥 How to Run

### 🔹 Preprocessing & Model Training
```bash
python Preprocessing.py