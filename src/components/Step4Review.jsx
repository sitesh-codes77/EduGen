import { BookOpen, Layers, BarChart3, Award, CheckCircle2, FileText, Clock } from 'lucide-react'
import { Q_TYPES } from './Step2QuestionComposition'

const DIFF = [
  { key: 'easy',   label: 'Easy',   color: '#10B981' },
  { key: 'medium', label: 'Medium', color: '#F59E0B' },
  { key: 'hard',   label: 'Hard',   color: '#EF4444' },
]

function Block({ icon: Icon, label, children }) {
  return (
    <div style={{ backgroundColor: 'var(--card)', border: '2px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
          <Icon size={16} />
        </div>
        <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default function Step4Review({ step1, step2, step3 }) {
  const chapters = step1.chapters?.length > 0 ? step1.chapters : ['All Chapters']

  const activeTypes = Q_TYPES.filter((t) => (step2[t.key]?.count ?? 0) > 0)

  const qBreakdown = activeTypes.map((t) => {
    const cfg = step2[t.key]
    return { ...t, count: cfg.count, marks: cfg.marks, subtotal: cfg.count * cfg.marks }
  })
  const totalMarks     = qBreakdown.reduce((s, t) => s + t.subtotal, 0)
  const totalQuestions = qBreakdown.reduce((s, t) => s + t.count, 0)
  const targetMarks    = step2.totalMarks === '' ? '—' : step2.totalMarks

  // Aggregate difficulty across all chapters + types
  let totEasy = 0, totMedium = 0, totHard = 0
  chapters.forEach((ch) => {
    activeTypes.forEach((type) => {
      const row = (step3[ch] || {})[type.key] || { easy: 0, medium: 0, hard: 0 }
      totEasy   += row.easy
      totMedium += row.medium
      totHard   += row.hard
    })
  })
  const totDiff = totEasy + totMedium + totHard
  const pct = (n) => (totDiff > 0 ? Math.round((n / totDiff) * 100) : 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: 'var(--success-dim)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#10B981" />
          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ready to Generate</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Review Summary</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Confirm paper configuration specifications before finalizing.</p>
        </div>
      </div>

      {/* Top blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
        <Block icon={BookOpen} label="Selected Book" iconColor="#0EA5E9">
          <p style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1rem', lineHeight: 1.4 }}>{step1.book || '—'}</p>
          {step1.grade && <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontWeight: 500, marginTop: '4px' }}>Grade Level: {step1.grade}</p>}
        </Block>

        <Block icon={Layers} label={`Chapters (${chapters.length})`} iconColor="#818CF8">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
            {chapters.slice(0, 3).map((ch) => (
              <span key={ch} style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', color: 'var(--text-2)', fontSize: '0.72rem', fontWeight: 600 }}>{ch}</span>
            ))}
            {chapters.length > 3 && (
              <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 600, alignSelf: 'center', marginLeft: '2px' }}>
                +{chapters.length - 3} more
              </span>
            )}
          </div>
        </Block>

        <Block icon={Award} label="Total Marks Score">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: '#10B981', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.03em' }}>{totalMarks}</span>
            <span style={{ color: 'var(--text-3)', fontSize: '0.95rem', fontWeight: 700 }}>/ {targetMarks}</span>
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 500, marginTop: '2px' }}>{totalQuestions} questions total</p>
        </Block>

        {step2.duration && (
          <Block icon={Clock} label="Duration">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ color: '#0EA5E9', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.03em' }}>{step2.duration}</span>
              <span style={{ color: 'var(--text-3)', fontSize: '0.95rem', fontWeight: 700 }}>min</span>
            </div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 500, marginTop: '2px' }}>
              {Math.floor(step2.duration / 60) > 0 ? `${Math.floor(step2.duration / 60)}h ${step2.duration % 60}m` : `${step2.duration} minutes`}
            </p>
          </Block>
        )}
      </div>

      {/* Question breakdown */}
      <Block icon={FileText} label="Question Composition Invoice" iconColor="#0EA5E9">
        {qBreakdown.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>No question types configured.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {qBreakdown.map((t) => (
                <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0EA5E9' }} />
                    <span style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 700 }}>{t.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontWeight: 500 }}>{t.count} × {t.marks} marks</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 800, minWidth: '50px', textAlign: 'right', fontSize: '0.9rem' }}>{t.subtotal}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1.5px solid var(--border)', marginTop: '8px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-3)', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Score Summary</span>
              <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>{totalMarks} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-3)' }}>marks</span></span>
            </div>
          </div>
        )}
      </Block>

      {/* Difficulty distribution */}
      <Block icon={BarChart3} label="Difficulty distribution" iconColor="#F59E0B">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.25rem' }}>
          {DIFF.map(({ key, label, color }) => {
            const val = key === 'easy' ? totEasy : key === 'medium' ? totMedium : totHard
            const p = pct(val)
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ color, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--text-1)', fontSize: '0.85rem', fontWeight: 800 }}>
                    {val} {val === 1 ? 'question' : 'questions'}{' '}
                    <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>({p}%)</span>
                  </span>
                </div>
                <div style={{ height: '7px', backgroundColor: 'var(--card)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${p}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
