import React, { useState } from 'react';
import ServerMonitor from './components/ServerMonitor';
import ModelReport from './components/ModelReport';
import IncidentLogs from './components/IncidentLogs';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'report', 'history'
  const [incidents, setIncidents] = useState([]);

  const handleAttackDetected = (incidentData) => {
    setIncidents(prev => [{ ...incidentData, id: 'INC-' + Math.floor(Math.random() * 1000000) }, ...prev]);
  };

  return (
    <div className="dashboard-container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Cloud Threat Intelligence</h1>
          <p>Real-time Intrusion Detection and Incident Response Network</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setView('dashboard')} 
            style={{ 
              padding: '10px 20px', 
              background: view === 'dashboard' ? '#34d399' : '#111', 
              color: view === 'dashboard' ? '#000' : '#fff',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('report')} 
            style={{ 
              padding: '10px 20px', 
              background: view === 'report' ? '#34d399' : '#111', 
              color: view === 'report' ? '#000' : '#fff',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Model Report
          </button>
          <button 
            onClick={() => setView('history')} 
            style={{ 
              padding: '10px 20px', 
              background: view === 'history' ? '#34d399' : '#111', 
              color: view === 'history' ? '#000' : '#fff',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Incident History
          </button>
        </div>
      </div>
      
      {view === 'dashboard' && (
        <div className="servers-grid">
          <ServerMonitor serverName="AWS (us-east-1)" onAttackDetected={handleAttackDetected} />
          <ServerMonitor serverName="Azure (westeurope)" onAttackDetected={handleAttackDetected} />
          <ServerMonitor serverName="GCP (us-central1)" onAttackDetected={handleAttackDetected} />
        </div>
      )}
      {view === 'report' && <ModelReport />}
      {view === 'history' && <IncidentLogs incidents={incidents} />}
    </div>
  );
}
