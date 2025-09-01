import { useState } from "react";
import axios from "axios";
import {
  Bell, CreditCard, AlertTriangle, XCircle,
  Upload, RefreshCw
} from "lucide-react";

export default function FraudDetectionDashboard() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fraudCount, setFraudCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file select
 const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    } else {
      setFile(null);
      console.warn("No file selected!");
    }
  };

  // Handle upload and prediction
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (res.data) {
      alert();
      debugger;
  const preds = res.data.predictions || [];

  const flaggedPreds = preds.map((t, index) => {
    debugger;
    const isFraud = t === 1;
    const amount = Number(t.amount); // Convert to number
    return {
      id: t.id || index + 1,
      amount: isNaN(amount) ? 0 : amount,
      prediction: isFraud ? "Fraud" : "Safe",
      flag: isFraud ? "⚠️ Fraud" : "✅ Safe"
    };
  });

  setTransactions(flaggedPreds);

  // Debugger logic based on Class
  const frauds = flaggedPreds.filter(t => t.prediction === "Fraud");
  const safes = flaggedPreds.filter(t => t.prediction === "Safe");

  console.log("Fraud count:", frauds.length);
  console.log("Safe count:", safes.length);
  debugger;

  setAccuracy(res.data.accuracy || null);
  setTotalTransactions(res.data.total_transactions || flaggedPreds.length);
  setFraudCount(res.data.fraudulent_transactions || frauds.length);
}
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please check backend logs.");
    }
    setIsLoading(false);
  };

  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-4 shadow-md border flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value !== null ? value : "--"}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Fraud Detection Dashboard</h1>
      <button
        onClick={handleUpload}
        disabled={isLoading}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 mr-2" />
        )}
        Upload & Predict
      </button>
    </div>

    {/* File Input */}
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <KPICard title="Accuracy" value={accuracy ? `${(accuracy * 100).toFixed(2)}%` : "--"} icon={Bell} color="bg-purple-500" />
      <KPICard title="Total Transactions" value={totalTransactions} icon={CreditCard} color="bg-blue-500" />
      <KPICard title="Fraudulent Transactions" value={fraudCount} icon={AlertTriangle} color="bg-red-500" />
      <KPICard title="Safe Transactions" value={totalTransactions - fraudCount} icon={XCircle} color="bg-green-500" />
    </div>

    {/* Predictions Table */}
<div className="bg-white p-4 rounded-xl shadow-md mt-6">
  <h2 className="text-lg font-bold mb-4">Prediction Results</h2>

  {transactions.length === 0 ? (
    <p className="text-gray-500">No predictions yet. Upload a file to see results.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Prediction</th>
            <th className="p-2 border">Flag</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => {
           const isFraud = t.prediction === "Fraud";
  const flagColor = isFraud ? "bg-red-600" : "bg-green-600";
  const textColor = isFraud ? "text-red-600" : "text-green-600";
  

            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{t.id}</td>
                <td className={`p-2 border font-semibold ${textColor}`}>{t.prediction}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white text-sm ${flagColor}`}>
                    {t.flag}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

  </div>
);
}