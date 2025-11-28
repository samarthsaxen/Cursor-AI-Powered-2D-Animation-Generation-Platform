import { useEffect, useRef, useState } from 'react'
import api from './api'

export default function App() {
  const [prompt, setPrompt] = useState('Client-Server-Database flow')
  const [labels, setLabels] = useState({
    left: 'Client',
    mid: 'Server',
    topRight: 'Cache',
    bottomRight: 'Database',
  })
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | queued | rendering | done | error
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  const handleChange = (key) => (e) =>
    setLabels((prev) => ({ ...prev, [key]: e.target.value }))

  async function submitJob() {
    setError(null)
    setVideoUrl(null)
    setJobId(null)
    setStatus('submitting')

    try {
      const res = await api.post('/api/render/submit', {
        prompt,
        sceneOptions: labels,
      })
      const { id } = res.data
      setJobId(id)
      setStatus('queued')

      // start polling
      pollRef.current = setInterval(() => checkStatus(id), 1500)
    } catch (e) {
      setError(e?.response?.data?.error || e.message)
      setStatus('error')
    }
  }

  async function checkStatus(id) {
    try {
      const res = await api.get(`/api/render/status/${id}`)
      // { id, done: bool, url: '/renders/<id>.mp4' | null }
      if (res.data.done && res.data.url) {
        // Stop polling
        clearInterval(pollRef.current)
        pollRef.current = null
        setStatus('done')

        // Important: use the proxied path so the browser can load it
        setVideoUrl(res.data.url)
      } else {
        setStatus('rendering')
      }
    } catch (e) {
      // keep polling but surface an error message
      setError(e?.response?.data?.error || e.message)
    }
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Cursor — Manim Video Generator</h1>
        <p style={styles.sub}>Type a prompt + labels, generate, then watch the video.</p>

        <label style={styles.label}>Prompt</label>
        <textarea
          style={styles.textarea}
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the scene you want…"
        />

        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Left</label>
            <input style={styles.input} value={labels.left} onChange={handleChange('left')} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Middle</label>
            <input style={styles.input} value={labels.mid} onChange={handleChange('mid')} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Top Right</label>
            <input style={styles.input} value={labels.topRight} onChange={handleChange('topRight')} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Bottom Right</label>
            <input style={styles.input} value={labels.bottomRight} onChange={handleChange('bottomRight')} />
          </div>
        </div>

        <button style={styles.button} onClick={submitJob} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Generate Video'}
        </button>

        {jobId && (
          <div style={styles.statusBox}>
            <div><b>Job:</b> {jobId}</div>
            <div><b>Status:</b> {status}</div>
            {status !== 'done' && status !== 'error' && <div style={styles.spinner}>Rendering…</div>}
          </div>
        )}

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {videoUrl && (
          <div style={{ marginTop: 16 }}>
            <video
              key={videoUrl}
              style={styles.video}
              src={videoUrl}
              controls
            />
          </div>
        )}
      </div>
      <footer style={styles.footer}>
        <small>Backend: <code>http://localhost:4000</code> • Dev server: <code>http://localhost:5173</code></small>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0b0f14',
    color: '#e7eef7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: 'min(900px, 100%)',
    background: '#121826',
    border: '1px solid #1f2937',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  },
  h1: { margin: 0, fontSize: 28, marginBottom: 8 },
  sub: { opacity: 0.75, marginTop: 0, marginBottom: 16 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  field: {},
  label: { fontSize: 12, opacity: 0.9, marginBottom: 6, display: 'block' },
  input: {
    width: '100%',
    background: '#0b1220',
    color: '#e7eef7',
    border: '1px solid #1f2937',
    borderRadius: 10,
    padding: '10px 12px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    background: '#0b1220',
    color: '#e7eef7',
    border: '1px solid #1f2937',
    borderRadius: 10,
    padding: 12,
    outline: 'none',
  },
  button: {
    marginTop: 8,
    width: '100%',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '12px 14px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  statusBox: {
    marginTop: 14,
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 12,
  },
  spinner: { marginTop: 8, opacity: 0.8 },
  error: {
    marginTop: 12,
    background: '#2a0e12',
    border: '1px solid #7f1d1d',
    color: '#fecaca',
    borderRadius: 12,
    padding: 12,
  },
  video: {
    width: '100%',
    borderRadius: 12,
    border: '1px solid #1f2937',
    background: 'black',
  },
  footer: { marginTop: 20, opacity: 0.65 },
}
