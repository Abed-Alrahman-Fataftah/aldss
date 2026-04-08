import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { contentAPI, eventAPI } from '../../services/api'

interface Quiz {
  id: string
  question: string
  options: string | string[]
}

interface ModuleData {
  id: string
  title: string
  content: string
  trackId: string
  track: { title: string }
  quizzes: Quiz[]
}

interface QuizResult {
  questionId: string
  question: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  explanation: string
}

interface QuizResults {
  score: number
  correct: number
  total: number
  results: QuizResult[]
}

// Always returns a proper string array regardless of how options arrived
function parseOptions(options: string | string[]): string[] {
  if (Array.isArray(options)) return options
  try {
    const parsed = JSON.parse(options)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [module, setModule] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'content' | 'quiz' | 'results'>('content')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [results, setResults] = useState<QuizResults | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const maxScrollRef = useRef(0)
  const enteredRef = useRef(Date.now())

  useEffect(() => {
    if (!moduleId) return
    contentAPI.getModule(moduleId)
      .then(res => setModule(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [moduleId])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handleScroll = () => {
      const scrolled = el.scrollTop + el.clientHeight
      const total = el.scrollHeight
      const depth = scrolled / total
      if (depth > maxScrollRef.current) maxScrollRef.current = depth
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [module])

  const handleStartQuiz = async () => {
    const timeOnContent = Math.floor((Date.now() - enteredRef.current) / 1000)
    await eventAPI.log({
      eventType: 'CONTENT_VIEW',
      contentId: moduleId,
      depthScore: maxScrollRef.current,
      metadata: {
        timeOnContentSeconds: timeOnContent,
        scrollDepth: Math.round(maxScrollRef.current * 100)
      }
    })
    enteredRef.current = Date.now()
    setView('quiz')
  }

  const handleSubmitQuiz = async () => {
    if (!moduleId || !module) return
    if (Object.keys(answers).length !== module.quizzes.length) return
    setSubmitting(true)
    try {
      const res = await contentAPI.submitQuiz(moduleId, answers)
      setResults(res.data)
      setView('results')
    } catch (err) {
      console.error('Quiz submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfidenceSubmit = async () => {
    if (!confidenceScore || !module) return
    await eventAPI.log({
      eventType: 'CONTENT_VIEW',
      contentId: moduleId,
      metadata: {
        action: 'self_assessment',
        confidenceScore,
        quizScore: results?.score
      }
    })
    navigate(`/track/${module.trackId}`)
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^## (.+)/gm, '<h2 style="color:#1F3864;margin:1.5rem 0 0.5rem">$1</h2>')
      .replace(/^### (.+)/gm, '<h3 style="color:#2E75B6;margin:1.2rem 0 0.4rem">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#f0f4ff;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em">$1</code>')
      .replace(/```python([\s\S]+?)```/g, '<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem;border-radius:8px;overflow-x:auto;font-size:0.875rem;line-height:1.6;margin:1rem 0"><code>$1</code></pre>')
      .replace(/\n\n/g, '</p><p style="margin:0.75rem 0;color:#444;line-height:1.7">')
      .replace(/^(?!<)(.+)/gm, '<p style="margin:0.75rem 0;color:#444;line-height:1.7">$1</p>')
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading...</div>
  }

  if (!module) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Module not found</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#1F3864', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate(`/track/${module.trackId}`)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 0.875rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ← {module.track.title}
        </button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>{module.title}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          {view === 'content' ? 'Reading' : view === 'quiz' ? 'Quiz' : 'Results'}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: '#eee' }}>
        <div style={{
          height: '3px',
          background: '#2E75B6',
          width: view === 'content' ? '33%' : view === 'quiz' ? '66%' : '100%',
          transition: 'width 0.4s ease'
        }} />
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem', width: '100%' }}>

        {/* ── CONTENT VIEW ── */}
        {view === 'content' && (
          <div>
            <div
              ref={contentRef}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                maxHeight: '60vh',
                overflowY: 'auto',
                marginBottom: '1.5rem'
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(module.content) }}
            />
            <button className="btn btn-primary" onClick={handleStartQuiz}>
              I have read this — take the quiz →
            </button>
          </div>
        )}

        {/* ── QUIZ VIEW ── */}
        {view === 'quiz' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#1F3864', marginBottom: '0.25rem' }}>Quiz</h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Answer all {module.quizzes.length} questions then submit.
              </p>
            </div>

            {module.quizzes.map((quiz, qIndex) => {
              const options = parseOptions(quiz.options)
              return (
                <div
                  key={quiz.id}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#1F3864', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {qIndex + 1}. {quiz.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        onClick={() => setAnswers(prev => ({ ...prev, [quiz.id]: oIndex }))}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${answers[quiz.id] === oIndex ? '#1F3864' : '#e0e0e0'}`,
                          background: answers[quiz.id] === oIndex ? '#EEF4FF' : 'white',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          color: answers[quiz.id] === oIndex ? '#1F3864' : '#444',
                          fontWeight: answers[quiz.id] === oIndex ? 600 : 400,
                          transition: 'all 0.15s'
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <button
              className="btn btn-primary"
              onClick={handleSubmitQuiz}
              disabled={submitting || Object.keys(answers).length !== module.quizzes.length}
            >
              {submitting
                ? 'Submitting...'
                : `Submit quiz (${Object.keys(answers).length}/${module.quizzes.length} answered)`}
            </button>
          </div>
        )}

        {/* ── RESULTS VIEW ── */}
        {view === 'results' && results && (
          <div>
            {/* Score card */}
            <div style={{
              background: results.score >= 60 ? '#f0fff4' : '#fff8f0',
              border: `1.5px solid ${results.score >= 60 ? '#27ae60' : '#e67e22'}`,
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: results.score >= 60 ? '#27ae60' : '#e67e22' }}>
                {results.score}%
              </div>
              <div style={{ color: '#555', marginTop: '0.25rem' }}>
                {results.correct} out of {results.total} correct
                {results.score >= 60 ? ' — Well done!' : ' — Review the explanations below'}
              </div>
            </div>

            {/* Per-question results */}
            {results.results.map((r, i) => (
              <div
                key={r.questionId}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '0.875rem',
                  borderLeft: `4px solid ${r.isCorrect ? '#27ae60' : '#e74c3c'}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ fontWeight: 600, color: '#1F3864', marginBottom: '0.5rem' }}>
                  {i + 1}. {r.question}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: r.isCorrect ? '#27ae60' : '#e74c3c',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  {r.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.5 }}>
                  {r.explanation}
                </div>
              </div>
            ))}

            {/* Self-assessment */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '1.5rem',
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ color: '#1F3864', marginBottom: '0.5rem' }}>How confident do you feel now?</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                1 = not confident at all · 10 = completely confident
              </p>
              <div className="scale-row" style={{ marginBottom: '1rem' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    className={`scale-btn ${confidenceScore === n ? 'selected' : ''}`}
                    onClick={() => setConfidenceScore(n)}
                    type="button"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleConfidenceSubmit}
                disabled={!confidenceScore}
              >
                Save and return to track →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}