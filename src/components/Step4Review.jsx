import { BookOpen, Layers, BarChart3, Award, CheckCircle2, FileText } from 'lucide-react'
import { Q_TYPES } from './Step2QuestionComposition'

const DIFF = [
  { key: 'easy',   label: 'Easy',   color: '#10B981' },
  { key: 'medium', label: 'Medium', color: '#F59E0B' },
  { key: 'hard',   label: 'Hard',   color: '#EF4444' },
]

function Block({ icon: Icon, label, iconColor = '#0EA5E9', children }) {
  return (
    <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.65rem' }}>
        <Icon size={15} color={iconColor} />
        <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      {children}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: 'var(--success-dim)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '3px 11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <CheckCircle2 size={12} color="#10B981" />
          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 700 }}>Ready to Generate</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)' }}>Review Summary</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>Confirm your configuration before generating.</p>
        </div>
      </div>

      {/* Top blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.875rem' }}>
        <Block icon={BookOpen} label="Selected Book" iconColor="#0EA5E9">
          <p style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.9rem' }}>{step1.book || '—'}</p>
          {step1.grade && <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '3px' }}>Grade: {step1.grade}</p>}
        </Block>

        <Block icon={Layers} label={`Chapters (${chapters.length})`} iconColor="#818CF8">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {chapters.slice(0, 4).map((ch) => (
              <span key={ch} style={{ backgroundColor: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: '5px', padding: '2px 7px', color: '#A5B4FC', fontSize: '0.72rem', fontWeight: 500 }}>{ch}</span>
            ))}
            {chapters.length > 4 && <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', alignSelf: 'center' }}>+{chapters.length - 4} more</span>}
          </div>
        </Block>

        <Block icon={Award} label="Total Marks" iconColor="#10B981">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ color: '#10B981', fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.03em' }}>{totalMarks}</span>
            <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>/ {targetMarks}</span>
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: '0.72rem', marginTop: '3px' }}>{totalQuestions} questions total</p>
        </Block>
      </div>

      {/* Question breakdown */}
      <Block icon={FileText} label="Question Breakdown">
        {qBreakdown.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>No question types configured.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {qBreakdown.map((t) => (
              <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500 }}>{t.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>{t.count} × {t.marks} marks</span>
                  <span style={{ color: '#0EA5E9', fontWeight: 700, minWidth: '44px', textAlign: 'right', fontSize: '0.875rem' }}>{t.subtotal}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
              <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1rem' }}>{totalMarks}</span>
            </div>
          </div>
        )}
      </Block>

      {/* Difficulty distribution */}
      <Block icon={BarChart3} label="Difficulty Distribution" iconColor="#F59E0B">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginTop: '0.25rem' }}>
          {DIFF.map(({ key, label, color }) => {
            const val = key === 'easy' ? totEasy : key === 'medium' ? totMedium : totHard
            const p = pct(val)
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color, fontSize: '0.78rem', fontWeight: 600 }}>{label}</span>
                  <span style={{ color: 'var(--text-2)', fontSize: '0.78rem', fontWeight: 700 }}>{val} questions ({p}%)</span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
