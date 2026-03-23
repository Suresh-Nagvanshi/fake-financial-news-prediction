import { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the backend. Is FastAPI running?");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Ticker Watchdog Dashboard</h1>
      <form onSubmit={analyzeNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          rows="6"
          placeholder="Paste financial news snippet here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '0.75rem', 
            fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            backgroundColor: loading ? '#a0c4ff' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          {loading ? 'Analyzing...' : 'Check Credibility'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ marginTop: 0 }}>Analysis Result</h2>
          <p><strong>Prediction:</strong> <span style={{ color: result.prediction === 'Real' ? 'green' : 'red', fontWeight: 'bold' }}>{result.prediction}</span></p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Snippet:</strong> {result.text_analyzed}</p>
        </div>
      )}
    </div>
  );
}

export default App;