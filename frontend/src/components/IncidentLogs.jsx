import React from 'react';
import './IncidentLogs.css';

export default function IncidentLogs({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="incidents-container">
        <div className="empty-state">
          No incidents recorded in the current session.
        </div>
      </div>
    );
  }

  return (
    <div className="incidents-container">
      {incidents.map((incident, idx) => {
        const isMalicious = incident.prediction.predicted_label !== 0;
        
        return (
          <div className="incident-card" key={idx}>
            <div className={`incident-header ${isMalicious ? 'alert' : 'safe'}`}>
              <span>{isMalicious ? '[CRITICAL EVENT]' : '[ROUTINE EVENT]'} {incident.id}</span>
              <span>{new Date(incident.time).toLocaleString()}</span>
            </div>
            
            <div className="incident-body">
              <div className="incident-info">
                <div className="incident-title">
                  {incident.prediction.attack_type.toUpperCase()}
                </div>
                <div className="incident-meta">
                  <strong>Origin Node:</strong> {incident.server} Cluster
                  <br />
                  <strong>Matches Signature:</strong> {incident.prediction.confidence_score}%
                </div>
                <div className="incident-explanation">
                  {incident.prediction.explanation}
                </div>
              </div>
              
              {(incident.top_features || isMalicious) && (
                <div className="incident-features">
                  <div className="incident-features-title">Extracted Threat Indicators / Telemetry</div>
                  {incident.top_features ? Object.entries(incident.top_features).map(([key, val]) => (
                    <div className="feature-pill" key={key}>
                      <span className="feature-name">{key}</span>
                      <span className="feature-val">{val}</span>
                    </div>
                  )) : (
                    <div style={{ color: '#a1a1aa', fontSize: '0.8rem', fontStyle: 'italic' }}>Standard traffic metrics recorded.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
