import React, { useState, useEffect, useRef } from 'react';
import './ServerMonitor.css';

const MOCK_START_LOGS = [
  "[init] Booting cloud defense matrix v2.4",
  "[info] Establishing connection to core router...",
  "[success] Connected. Packet sniffer Active.",
  "[info] Awaiting network traffic events..."
];

export default function ServerMonitor({ serverName, onAttackDetected }) {
  const [status, setStatus] = useState('online'); // online, alert, offline
  const [logs, setLogs] = useState([...MOCK_START_LOGS]);
  const [prediction, setPrediction] = useState(null);
  const [topFeatures, setTopFeatures] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [activeTab, setActiveTab] = useState('Network');
  
  const terminalRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic normal logs
  useEffect(() => {
    let interval;
    if (status === 'online') {
      interval = setInterval(() => {
        setLogs(prev => [
          ...prev, 
          `[${new Date().toISOString().split('T')[1].slice(0,-1)}] Ping check: node healthy`
        ].slice(-50));
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, `[${type}] ${msg}`].slice(-50));
  };

  const handleAttack = async (attackType) => {
    if (status === 'offline') return;
    
    setIsAttacking(true);
    addLog(`INITIATING TRAFFIC INJECTION: ${attackType}`, 'trigger');
    
    try {
      const response = await fetch('http://localhost:8000/simulate_attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server: serverName, attack_label: attackType })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail);
      }

      // Stream all features sequentially to make the UI look busy
      const rawKeys = Object.keys(data.raw_logs);
      
      let delay = 0;
      rawKeys.forEach((key, idx) => {
        setTimeout(() => {
           setLogs(prev => [...prev, `<span class="log-key">${key}</span>: <span class="log-value">${data.raw_logs[key]}</span>`].slice(-100));
           
           // If it's the last one, resolve the prediction visually
           if (idx === rawKeys.length - 1) {
             finalizeAttack(data);
           }
        }, delay);
        delay += 30; // 30ms per log line streaming effect
      });
      
    } catch (error) {
      console.error(error);
      addLog(`ERR failed to communicate with backend: ${error.message}`, 'error');
      setIsAttacking(false);
    }
  };

  const finalizeAttack = (data) => {
    setPrediction(data.prediction);
    setTopFeatures(data.top_features);
    setIsAttacking(false);
    
    if (onAttackDetected) {
      onAttackDetected({ server: serverName, time: new Date().toISOString(), ...data });
    }
    
    const isNormal = data.prediction.predicted_label === 0;

    if (isNormal) {
      setLogs(prev => [...prev, `<span class="terminal-success">[RESULT] Traffic Classification: ${data.prediction.attack_type.toUpperCase()} (${data.prediction.confidence_score}% Match)</span>`].slice(-100));
      addLog("System secure. Monitoring resumed.", "success");
    } else {
      setLogs(prev => [...prev, `<span class="terminal-alert">[RESULT] MALICIOUS TRAFFIC DETECTED: ${data.prediction.attack_type.toUpperCase()} (${data.prediction.confidence_score}% Match)</span>`].slice(-100));
      setStatus('alert');
      
      // Offline transition
      setTimeout(() => {
        setStatus('offline');
        addLog("CRITICAL FAILURE: NODE TAKEN OFFLINE", "fatal");
      }, 3500);
    }
  };

  const handleRecover = () => {
    setStatus('online');
    setPrediction(null);
    setTopFeatures(null);
    setLogs(["[init] Recovery protocol initiated", "[info] Mem flush complete", "[success] Node ONLINE"]);
  };

  return (
    <div className={`server-card status-${status}`}>
      <div className="mac-header">
        <div className="mac-dot red"></div>
        <div className="mac-dot yellow"></div>
        <div className="mac-dot green"></div>
        <div className="server-title">{serverName}</div>
      </div>

      <div className="server-body">
        <div className="tabs-container">
          <div className={`tab ${activeTab === 'Network' ? 'active' : ''}`} onClick={() => setActiveTab('Network')}>Terminal</div>
          <div className={`tab ${activeTab === 'Metrics' ? 'active' : ''}`} onClick={() => setActiveTab('Metrics')}>Metrics</div>
        </div>

        <div className="log-terminal" ref={terminalRef}>
          {logs.map((L, i) => (
            <div key={i} className="log-line" dangerouslySetInnerHTML={{ __html: `<span class="log-prompt">➜</span> ${L}` }} />
          ))}
        </div>

        {status !== 'offline' ? (
          <div className="attack-controls">
            <div className="control-label">Injection Vectors (Payload Simulator)</div>
            <div className="button-group">
              <button className="attack-btn" onClick={() => handleAttack('Normal')} disabled={isAttacking}>
                Normal
              </button>
              <button className="attack-btn" onClick={() => handleAttack('HTTP Flood')} disabled={isAttacking}>
                HTTP Flood
              </button>
              <button className="attack-btn" onClick={() => handleAttack('Port Scan')} disabled={isAttacking}>
                Port Scan
              </button>
              <button className="attack-btn" onClick={() => handleAttack('DDoS')} disabled={isAttacking}>
                DDoS
              </button>
              <button className="attack-btn" onClick={() => handleAttack('Botnet')} disabled={isAttacking}>
                Botnet
              </button>
            </div>
          </div>
        ) : (
          <button className="recovery-btn" onClick={handleRecover}>
            &gt;_ EXECUTE RECOVERY_SCRIPT.sh
          </button>
        )}

        {prediction && (
           <div className={`prediction-panel ${prediction.predicted_label === 0 ? 'pred-normal' : ''}`}>
             <div className="pred-icon">
                {prediction.predicted_label === 0 ? '🛡️' : '⚠️'}
             </div>
             <div className="pred-content">
               <div className="pred-header-mini">
                 <div className="pred-attack-type">
                   {prediction.attack_type.toUpperCase()} DETECTED
                 </div>
                 <div className="pred-score">
                   CONFIDENCE: {prediction.confidence_score}%
                 </div>
               </div>
               
               <div className="pred-explanation">
                 {prediction.explanation}
               </div>

               {topFeatures && prediction.predicted_label !== 0 && (
                 <div className="pred-top-features">
                   <div className="pred-top-features-title">Primary Threat Indicators:</div>
                   {Object.entries(topFeatures).map(([k, v]) => (
                     <div className="feature-line" key={k}>
                       &gt; {k}: {v}
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
