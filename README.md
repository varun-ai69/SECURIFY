# Multi-Cloud Intrusion Detection System (MVP)

An AI-powered real-time intrusion detection and prevention system designed for multi-cloud environments. This project analyzes incoming network traffic before it reaches cloud servers, detects malicious behavior using machine learning, blocks suspicious requests, and generates explainable security alerts.

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" height="28"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" height="28"/>
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" height="28"/>
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" height="28"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" height="28"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" height="28"/>
</p>

---
## Overview

Modern cloud servers continuously receive thousands of requests. Among legitimate traffic, malicious requests such as DDoS floods, botnet communication, HTTP floods, and reconnaissance scans can hide easily.

Most systems detect attacks only after damage begins.

This MVP introduces an intelligent security layer that sits in front of servers and automatically inspects traffic in real time.

Every incoming request is analyzed by a trained machine learning model. If the request appears malicious, the system blocks it and explains why it was flagged.

---

## Problem We Solve

Cloud environments often suffer from:

* Delayed detection of attacks
* Manual log monitoring
* No centralized protection across multiple clouds
* Lack of explainable alerts
* Reactive rather than proactive security

This project solves that by bringing:

* Real-time detection
* Automated blocking
* Attack classification
* Explainable AI alerts
* Multi-cloud ready architecture

---

## Key Features

* Real-time intrusion detection
* Detects multiple attack categories
* Automated malicious request blocking
* Explainable attack reasoning
* Live monitoring dashboard
* Multi-cloud ready design
* FastAPI backend integration
* Machine learning powered decisions

---

## Attack Types Currently Detected

The current MVP model detects:

* Normal Traffic
* HTTP Flood
* DDoS
* Botnet Activity
* Port Scan

Future expansion can include:

* Brute Force Attacks
* SYN Flood
* SQL Injection
* SSH Abuse
* Data Exfiltration
* Insider Threat Patterns

---

## How It Works

```text
Incoming Request
      ↓
Traffic Feature Extraction
      ↓
ML Model Prediction
      ↓
Normal or Attack?
   ↙         ↘
Allow       Block
             ↓
     Generate Alert + Reason
```

---

## Machine Learning Model

Current MVP uses:

* Random Forest Classifier

Why Random Forest:

* High accuracy on tabular traffic data
* Strong performance on intrusion datasets
* Feature importance support
* Stable and fast for MVP deployment

---

## Dataset Used

This MVP is trained on traffic-flow based intrusion detection data inspired by CICIDS2017 style network datasets.

The model learns traffic behavior patterns using network flow features instead of packet payload inspection.

---

## Input Features Used by Model

The model currently uses the following behavioral features:

* Destination Port
* Flow Duration
* Total Fwd Packets
* Total Backward Packets
* Total Length of Fwd Packets
* Total Length of Bwd Packets
* Flow Bytes/s
* Flow Packets/s
* Fwd Packets/s
* Bwd Packets/s
* Packet Length Mean
* Packet Length Std
* Average Packet Size
* Min Packet Length
* Max Packet Length
* SYN Flag Count
* RST Flag Count
* PSH Flag Count
* ACK Flag Count
* Down/Up Ratio
* Flow IAT Mean
* Flow IAT Std
* Idle Mean
* Active Mean
* Subflow Fwd Bytes
* Subflow Bwd Bytes

These features help detect:

* Volumetric floods
* Reconnaissance scans
* Suspicious timing patterns
* TCP abuse behavior
* Asymmetric traffic flows

---

## Backend Stack

* Python
* FastAPI
* Pandas
* Scikit-learn
* Joblib
* CORS Middleware

---

## Frontend MVP

Current UI supports:

* Multiple cloud server panels
* Attack simulation buttons
* Live log stream
* Threat detection alerts
* Confidence score display
* Explanation panel
* Recovery mode simulation

---

## Project Structure

```text
project/
│── backend/
│   ├── main.py
│   ├── rf_intrusion_model.pkl
│   ├── label_encoder.pkl
│   └── test_dataset_predictions.csv
│
│── frontend/
│   ├── src/
│   └── components/
│
└── README.md
```

---

## API Endpoints

### Health Check

```http
GET /
```

Returns backend running status.

### Simulate Attack

```http
POST /simulate_attack
```

### Example Request

```json
{
  "server": "AWS",
  "attack_label": 3
}
```

### Example Response

```json
{
  "server": "AWS",
  "prediction": {
    "predicted_label": 3,
    "attack_type": "DDoS",
    "confidence_score": 98.7,
    "explanation": "Massive distributed traffic flow attempting to overwhelm the network stack."
  }
}
```

---

## Installation

### Backend

```bash
pip install fastapi uvicorn pandas scikit-learn joblib
```

Run server:

```bash
uvicorn main:app --reload
```

---

## Why This Project Matters

Instead of waiting for incidents and then reading logs manually, this system enables:

* Detect before damage
* Block before compromise
* Explain before confusion
* Scale across clouds

---

## Future Roadmap

* Real cloud log ingestion from AWS / Azure / GCP
* Kafka / streaming traffic pipeline
* Auto firewall rule generation
* Threat intelligence integration
* SHAP explainability engine
* Zero-day anomaly detection
* SIEM integrations
* Kubernetes protection layer

---

## Current MVP Status

Completed:

* Model training
* Threat classification
* Backend API
* Frontend simulation UI
* Real-time alerts
* Explainable responses

---

## Vision

Build a unified AI security agent that protects modern multi-cloud infrastructure through autonomous real-time threat detection and response.

---

## Author

Built as an MVP for hackathon innovation in AI + Cybersecurity + Cloud Security.
