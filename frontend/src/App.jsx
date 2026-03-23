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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        background: '#111827',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        color: 'white'
      }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          📊 Ticker Watchdog
        </h1>

        <form onSubmit={analyzeNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            rows="5"
            placeholder="Paste financial news snippet here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={{
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #374151',
              backgroundColor: '#1f2937',
              color: 'white',
              resize: 'none'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.8rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {loading ? 'Analyzing...' : 'Check Credibility'}
          </button>
        </form>

        {error && (
          <p style={{
            color: '#f87171',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </p>
        )}

        {result && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '10px',
            backgroundColor: result.prediction === 'Real' ? '#052e16' : '#3f1d1d',
            border: result.prediction === 'Real' ? '1px solid #22c55e' : '1px solid #ef4444'
          }}>
            <h2 style={{ marginTop: 0, textAlign: 'center' }}>Analysis Result</h2>

            <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
              <strong>Prediction: </strong>
              <span style={{
                color: result.prediction === 'Real' ? '#22c55e' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {result.prediction}
              </span>
            </p>

            <p style={{ textAlign: 'center' }}>
              <strong>Confidence:</strong> {result.confidence}
            </p>

            <p style={{
              marginTop: '1rem',
              fontStyle: 'italic',
              color: '#d1d5db'
            }}>
              "{result.text_analyzed}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;