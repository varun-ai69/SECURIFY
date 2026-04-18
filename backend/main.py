from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import sys

app = FastAPI(title="Cloud Threat Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
le = None
df = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FEATURES = [
    "Destination Port", "Flow Duration", "Total Fwd Packets", "Total Backward Packets",
    "Total Length of Fwd Packets", "Total Length of Bwd Packets", "Flow Bytes/s",
    "Flow Packets/s", "Fwd Packets/s", "Bwd Packets/s", "Packet Length Mean",
    "Packet Length Std", "Average Packet Size", "Min Packet Length", "Max Packet Length",
    "SYN Flag Count", "RST Flag Count", "PSH Flag Count", "ACK Flag Count",
    "Down/Up Ratio", "Flow IAT Mean", "Flow IAT Std", "Idle Mean", "Active Mean",
    "Subflow Fwd Bytes", "Subflow Bwd Bytes"
]

ATTACK_MAP = {
    "Normal": 0,
    "HTTP Flood": 1,
    "Port Scan": 2,
    "DDoS": 3,
    "Botnet": 4
}
INV_ATTACK_MAP = {v: k for k, v in ATTACK_MAP.items()}

@app.on_event("startup")
def load_assets():
    global model, le, df
    try:
        model_path = os.path.join(BASE_DIR, "rf_intrusion_model.pkl")
        le_path = os.path.join(BASE_DIR, "label_encoder.pkl")
        data_path = os.path.join(BASE_DIR, "test_dataset_predictions.csv")
        
        model = joblib.load(model_path)
        le = joblib.load(le_path)
        df = pd.read_csv(data_path)
        
        print("Successfully loaded ML models and dataset.")
    except Exception as e:
        print(f"CRITICAL ERROR loading assets: {e}")
        # Fail loud on startup to prevent silent errors
        sys.exit(1)

class AttackRequest(BaseModel):
    server: str
    attack_label: str  # Now accepts string like "DDoS"

EXPLANATIONS = {
    0: "Pattern recognized as Normal. Routine network traffic with no malicious indicators detected.",
    1: "Detected HTTP Flood. Abnormally high number of HTTP requests aiming to exhaust server application resources.",
    2: "Detected Port Scan. Sequential probes across multiple ports trying to identify open services and vulnerabilities.",
    3: "Detected DDoS. Massive distributed traffic flow attempting to overwhelm the network stack.",
    4: "Detected Botnet. Coordinated traffic patterns communicating with a suspected command and control (C2) server."
}

@app.post("/simulate_attack")
def simulate_attack(req: AttackRequest):
    if df is None or model is None:
        raise HTTPException(status_code=500, detail="Models or dataset not loaded.")
        
    attack_name = req.attack_label
    if attack_name not in ATTACK_MAP:
         raise HTTPException(status_code=400, detail=f"Unknown attack type: {attack_name}")
         
    target_idx = ATTACK_MAP[attack_name]
    
    # Check handling for both integers and strings in CSV
    subset = df[df['Actual_Label'] == target_idx]
    if len(subset) == 0:
        subset = df[df['Actual_Label'] == attack_name]
        
    if len(subset) == 0:
        raise HTTPException(status_code=404, detail=f"No data found for label {attack_name}")
        
    row = subset.sample(n=1).iloc[0]
    
    # Use explicit FEATURES list
    features_series = row[FEATURES]
    # Pass DataFrame directly to prevent warnings and feature mismatch
    features_df = pd.DataFrame([features_series], columns=FEATURES)
    
    try:
        pred = int(model.predict(features_df)[0])
        
        confidence = 1.0
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features_df)
            confidence = proba[0].max()
            
        decoded_attack_type = INV_ATTACK_MAP.get(pred, f"Unknown ({pred})")
        
        # Pick top 2 numerical features for the user explanation
        sorted_features = features_series.sort_values(ascending=False)
        top_features = sorted_features.head(2).to_dict()
        
        return {
            "server": req.server,
            "raw_logs": features_series.to_dict(),
            "top_features": top_features,
            "prediction": {
                "predicted_label": pred,
                "attack_type": decoded_attack_type,
                "confidence_score": round(confidence * 100, 2),
                "explanation": EXPLANATIONS.get(pred, "Unknown attack pattern.")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
