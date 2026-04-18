import React from 'react';
import './ModelReport.css';

export default function ModelReport() {
  const metricsData = [
    { class: '0 (Normal)', precision: '0.66', recall: '0.62', f1: '0.64', support: '393' },
    { class: '1 (HTTP Flood)', precision: '1.00', recall: '1.00', f1: '1.00', support: '25606' },
    { class: '2 (Port Scan)', precision: '0.99', recall: '1.00', f1: '1.00', support: '50532' },
    { class: '3 (DDoS)', precision: '1.00', recall: '1.00', f1: '1.00', support: '170871' },
    { class: '4 (Botnet)', precision: '1.00', recall: '1.00', f1: '1.00', support: '31786' },
  ];

  return (
    <div className="report-container">
      <div className="accuracy-banner">
        <div className="acc-title">Random Forest Classifier Final Accuracy (Test Set: 279,188 events)</div>
        <div className="acc-value">99.74%</div>
      </div>

      <div className="report-grid">
        {/* Metrics Box */}
        <div className="report-card">
          <div className="report-card-header">
            <span>📋</span> Classification Metrics
          </div>
          <div className="report-card-body metrics-terminal">
            <div className="metrics-row header-row">
              <span className="cell">Class</span>
              <span className="cell">Precision</span>
              <span className="cell">Recall</span>
              <span className="cell">F1-Score</span>
              <span className="cell">Support</span>
            </div>
            {metricsData.map((row, idx) => (
              <div className="metrics-row" key={idx}>
                 <span className="cell">{row.class}</span>
                 <span className="cell">{row.precision}</span>
                 <span className="cell">{row.recall}</span>
                 <span className="cell">{row.f1}</span>
                 <span className="cell">{row.support}</span>
              </div>
            ))}
            
            <div className="metrics-row total-row">
              <span className="cell">Macro Avg</span>
              <span className="cell">0.93</span>
              <span className="cell">0.92</span>
              <span className="cell">0.93</span>
              <span className="cell">279188</span>
            </div>
            <div className="metrics-row total-row" style={{ marginTop: 0, paddingTop: 5, borderTop: 'none' }}>
              <span className="cell">Weighted Avg</span>
              <span className="cell">1.00</span>
              <span className="cell">1.00</span>
              <span className="cell">1.00</span>
              <span className="cell">279188</span>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="report-card">
          <div className="report-card-header">
            <span>🎯</span> Confusion Matrix
          </div>
          <div className="report-card-body" style={{ textAlign: 'center' }}>
             <img src="/confusion_matrix.png" alt="Confusion Matrix" className="report-image" />
          </div>
        </div>
        
        {/* Top 10 Features */}
        <div className="report-card">
          <div className="report-card-header">
            <span>📊</span> Top 10 Important Features
          </div>
          <div className="report-card-body" style={{ textAlign: 'center' }}>
             <img src="/important features.png" alt="Important Features" className="report-image" />
          </div>
        </div>

        {/* Distribution */}
        <div className="report-card">
          <div className="report-card-header">
            <span>📈</span> Attack Class Distribution
          </div>
          <div className="report-card-body" style={{ textAlign: 'center' }}>
             <img src="/attack class distribution.png" alt="Attack Class Distribution" className="report-image" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
