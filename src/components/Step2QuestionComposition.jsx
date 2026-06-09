import { useState, useCallback, useRef } from 'react'
import { Settings2, X, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Q_TYPES = [
  { key: 'mcq', label: 'MCQ', description: 'Multiple Choice – Single Answer', defaultMarks: 1, maxMarks: 10 },
  { key: 'msq', label: 'MSQ', description: 'Multiple Select – Multi Answer', defaultMarks: 2, maxMarks: 10 },
  { key: 'numerical', label: 'Numerical', description: 'Number input answers', defaultMarks: 4, maxMarks: 20 },
  { key: 'short', label: 'Short Answer', description: '2–3 sentence answers', defaultMarks: 3, maxMarks: 10 },
  { key: 'long', label: 'Long Answer', description: 'Essay-type detailed answers', defaultMarks: 5, maxMarks: 20 },
]

/* ─── Red flash toast ─────────────────────────────────── */
function ErrorToast({ msg, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#1e0a0a', border: '1.5px solid #EF4444',
            borderRadius: '12px', padding: '10px 18px', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 32px rgba(239,68,68,0.3)',
          }}>
          <AlertCircle size={15} color="#EF4444" />
          <span style={{ color: '#FCA5A5', fontSize: '0.82rem', fontWeight: 700 }}>{msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Hook: timed error flash ─────────────────────────── */
function useErrorFlash() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  const flash = useCallback((text) => {
    setMsg(text)
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 2200)
  }, [])

  return { msg, visible, flash }
}

/* ─── Stepper Input — number + ▲▼ inside one box ─────── */
function StepperInput({ value, onChange, min = 0, max = 999, active = false, placeholder = '0' }) {
  const [focused, setFocused] = useState(false)

  const borderColor = focused ? '#0EA5E9' : active ? '#0EA5E9' : 'var(--input-border)'
  const bg = active ? 'var(--primary-dim)' : 'var(--input-bg)'
  const textColor = active ? '#0EA5E9' : 'var(--text-1)'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      border: `1.5px solid ${borderColor}`,
      borderRadius: '9px', overflow: 'hidden',
      backgroundColor: bg,
      transition: 'all 0.2s',
      boxShadow: focused ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
    }}>
      <input
        type="number" min={min} max={max}
        value={value === 0 && !focused ? '' : value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value === '' ? min : Number(e.target.value)
          onChange(Math.max(min, Math.min(max, v)))
        }}
        onFocus={() => setFocused(true)}
        onWheel={(e) => e.target.blur()}
        onBlur={() => setFocused(false)}
        style={{
          width: '52px', border: 'none', outline: 'none', background: 'transparent',
          color: textColor, fontWeight: 800, fontSize: '0.9rem',
          textAlign: 'center', padding: '7px 4px 7px 10px',
        }}
      />
      {/* ▲▼ stepper column */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: '22px', height: '18px', border: 'none', background: 'transparent',
            color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.55rem', lineHeight: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; e.currentTarget.style.color = '#0EA5E9' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
        >▲</button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: '22px', height: '18px', border: 'none', background: 'transparent',
            color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.55rem', lineHeight: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; e.currentTarget.style.color = '#0EA5E9' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
        >▼</button>
      </div>
    </div>
  )
}

/* ─── Chapter allocation modal ───────────────────────── */
function ChapterModal({ type, config, chapters, onSave, onClose }) {
  // Distribute count across chapters: 51% to first, rest split evenly
  const initAlloc = () => {
    const total = config.count
    if (chapters.length === 0 || total === 0) return {}
    const alloc = {}
    const perChapter = Math.floor(total / chapters.length)
    const extra = total % chapters.length
    chapters.forEach((ch, i) => {
      alloc[ch] = perChapter + (i === 0 ? extra : 0)
    })
    return alloc
  }

  const [alloc, setAlloc] = useState(initAlloc)
  const total = Object.values(alloc).reduce((s, v) => s + (v || 0), 0)
  const remaining = config.count - total

  const setChapterCount = (ch, val) => {
    const newAlloc = { ...alloc, [ch]: Math.max(0, val) }
    setAlloc(newAlloc)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Assign {type.label} to Chapters
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '4px' }}>
              Total: <span style={{ color: '#0EA5E9', fontWeight: 700 }}>{config.count}</span> questions to distribute
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Chapter rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {chapters.length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
              No chapters selected. Go back to Step 1 to select chapters.
            </p>
          ) : chapters.map((ch, i) => (
            <div key={ch} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#0EA5E9', fontSize: '0.65rem', fontWeight: 900 }}>{i + 1}</span>
                </div>
                <span style={{ color: 'var(--text-1)', fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setChapterCount(ch, (alloc[ch] || 0) - 1)}
                  style={{ width: '28px', height: '28px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-1)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <input type="number" min={0} max={config.count} value={alloc[ch] || 0}
                  onChange={(e) => setChapterCount(ch, Number(e.target.value))}
                  style={{ width: '52px', backgroundColor: 'var(--input-bg)', border: '1.5px solid var(--input-border)', borderRadius: '8px', padding: '5px 6px', color: 'var(--text-1)', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', outline: 'none' }} />
                <button onClick={() => setChapterCount(ch, (alloc[ch] || 0) + 1)}
                  style={{ width: '28px', height: '28px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-1)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining badge */}
        <div style={{ backgroundColor: remaining === 0 ? 'rgba(16,185,129,0.08)' : remaining < 0 ? 'rgba(239,68,68,0.08)' : 'var(--primary-dim)', border: `1px solid ${remaining === 0 ? 'rgba(16,185,129,0.25)' : remaining < 0 ? 'rgba(239,68,68,0.25)' : 'rgba(14,165,233,0.2)'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 600 }}>
            {remaining === 0 ? 'All questions assigned ✓' : remaining > 0 ? `${remaining} left to assign` : `${Math.abs(remaining)} over budget`}
          </span>
          <span style={{ color: remaining === 0 ? '#10B981' : remaining < 0 ? '#EF4444' : '#0EA5E9', fontWeight: 900, fontSize: '1.1rem' }}>
            {total} / {config.count}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '10px', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>Cancel</button>
          <button onClick={() => { onSave(alloc); onClose() }} disabled={remaining !== 0}
            style={{ flex: 1, padding: '10px', background: remaining === 0 ? 'linear-gradient(135deg,#0EA5E9,#0284C7)' : 'var(--card-2)', border: 'none', borderRadius: '10px', color: remaining === 0 ? '#fff' : 'var(--text-3)', fontSize: '0.875rem', fontWeight: 700, cursor: remaining === 0 ? 'pointer' : 'not-allowed', boxShadow: remaining === 0 ? '0 4px 14px rgba(14,165,233,0.3)' : 'none', transition: 'all 0.2s' }}>
            Apply to Chapters
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Step 2 Component ────────────────────────────── */
export default function Step2QuestionComposition({
  data, chapters = [],
  onTotalQChange, onTotalMarksChange, onDurationChange, onTypeConfig,
}) {
  const [configOpen, setConfigOpen] = useState(null)
  const { msg: errMsg, visible: errVisible, flash } = useErrorFlash()

  const tq = data.totalQuestions === '' ? 0 : Number(data.totalQuestions)
  const tm = data.totalMarks === '' ? 0 : Number(data.totalMarks)

  const allocatedCount = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)
  const allocatedMarks = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0) * (data[t.key]?.marks ?? 0), 0)

  const countOk = tq === 0 || allocatedCount === tq
  const marksOk = tm === 0 || allocatedMarks === tm

  const usedByOthers = (excludeKey) =>
    Q_TYPES.filter((t) => t.key !== excludeKey).reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)

  const marksPct = tm > 0 ? Math.min(100, Math.round((allocatedMarks / tm) * 100)) : 0

  const handleCountChange = (typeKey, val) => {
    const maxCount = tq === '' || tq === 0 ? 999 : tq - usedByOthers(typeKey)
    if (val > maxCount) {
      flash(`Count exceeds remaining questions (max ${maxCount} available)`)
      val = maxCount
    }
    onTypeConfig(typeKey, { count: Math.max(0, val) })
  }

  const handleMarksChange = (typeKey, val, maxMarks) => {
    if (val > maxMarks) {
      flash(`Max ${maxMarks} marks allowed for ${Q_TYPES.find(t => t.key === typeKey)?.label}`)
      val = maxMarks
    }
    onTypeConfig(typeKey, { marks: Math.max(1, val) })
  }

  const handleChapterSave = (typeKey, alloc) => {
    // Store chapter allocation on the type config; also seed Step 3 easy values
    onTypeConfig(typeKey, { chapterAlloc: alloc })
  }

  const labelStyle = { color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' }
  const inputStyle = { width: '100%', backgroundColor: 'var(--input-bg)', border: '1.5px solid var(--input-border)', borderRadius: '8px', padding: '7px 10px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-1)', outline: 'none', transition: 'all 0.2s' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <ErrorToast msg={errMsg} visible={errVisible} />

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Question Composition</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Define paper targets and configure question counts per type.</p>
      </div>

      {/* ── Paper Basics Fieldset ── */}
      <fieldset style={{ border: '1.5px solid var(--border)', borderRadius: '14px', padding: '0', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow)' }}>
        <legend style={{ marginLeft: '14px', padding: '0 8px', color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Paper Basics
        </legend>
        <div className="paper-basics-grid">
          {/* Total Questions */}
          <div>
            <label htmlFor="totalQuestionsInput" style={labelStyle}>Total Questions</label>
            <input
              id="totalQuestionsInput"
              type="number" min={0} max={500}
              value={data.totalQuestions}
              placeholder="e.g. 30"
              onChange={(e) => onTotalQChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          {/* Total Marks */}
          <div>
            <label htmlFor="totalMarksInput" style={labelStyle}>Total Marks</label>
            <input
              id="totalMarksInput"
              type="number" min={0} max={2000}
              value={data.totalMarks}
              placeholder="e.g. 100"
              onChange={(e) => onTotalMarksChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          {/* Duration */}
          <div>
            <label htmlFor="durationInput" style={labelStyle}>Duration (min)</label>
            <input
              id="durationInput"
              type="number" min={0} max={600}
              value={data.duration ?? ''}
              placeholder="e.g. 90"
              onChange={(e) => onDurationChange && onDurationChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
        </div>
        {/* Status row */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '8px 18px', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: !countOk && tq > 0 ? '#EF4444' : countOk && tq > 0 ? '#10B981' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
            {tq > 0 ? `Questions: ${allocatedCount} / ${tq}` : 'Questions target not set'}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: !marksOk && tm > 0 ? '#EF4444' : marksOk && tm > 0 ? '#10B981' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
            {tm > 0 ? `Marks: ${allocatedMarks} / ${tm}` : 'Marks target not set'}
          </span>
        </div>
      </fieldset>

      {/* ── Distribution table ── */}
      <div className="w-full overflow-x-auto custom-scrollbar" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', boxShadow: 'var(--shadow)', paddingBottom: '6px' }}>
        <div style={{ minWidth: '560px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 120px 140px 130px', padding: '14px 20px', backgroundColor: 'var(--card-2)', borderBottom: '1px solid var(--border)', gap: '12px', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question Type</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Count</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
              Marks/Q <span style={{ color: 'rgba(14,165,233,0.6)', fontWeight: 600 }}>(max)</span>
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Chapters</div>
          </div>

          {Q_TYPES.map((type, idx) => {
            const cfg = data[type.key] || { count: 0, marks: type.defaultMarks }
            const maxCount = tq === 0 ? 999 : tq - usedByOthers(type.key) + cfg.count

            return (
              <div key={type.key}
                style={{ display: 'grid', gridTemplateColumns: '2fr 120px 140px 130px', padding: '14px 20px', alignItems: 'center', gap: '12px', borderBottom: idx < Q_TYPES.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: 'var(--card)', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}>

                {/* Type label */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HelpCircle size={15} color="var(--text-3)" />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.88rem' }}>{type.label}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{type.description}</div>
                  </div>
                </div>

                {/* Count — inline stepper */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StepperInput
                    value={cfg.count}
                    min={0}
                    max={maxCount}
                    active={false}
                    onChange={(v) => handleCountChange(type.key, v)}
                  />
                </div>

                {/* Marks — inline stepper with hard cap */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                  <StepperInput
                    value={cfg.marks}
                    min={1}
                    max={type.maxMarks}
                    active={false}
                    onChange={(v) => handleMarksChange(type.key, v, type.maxMarks)}
                  />
                  <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 600 }}>/ {type.maxMarks}</span>
                </div>

                {/* Configure → Chapter assignment */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button
                    onClick={() => setConfigOpen(type)}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', padding: '7px 13px', color: 'var(--text-2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--card)'; e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.color = '#0EA5E9' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
                    <Settings2 size={12} /> Configure
                  </motion.button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Marks allocation bar ── */}
      {tm > 0 && (
        <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Marks Breakdown</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 500 }}>
                {Q_TYPES.filter((t) => (data[t.key]?.count ?? 0) > 0).map((t) => `${t.label} (${data[t.key].count}×${data[t.key].marks})`).join(' + ') || 'No question counts set'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', color: marksOk ? '#10B981' : allocatedMarks > tm ? '#EF4444' : '#0EA5E9', transition: 'color 0.2s' }}>
                {allocatedMarks}
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: '1rem', fontWeight: 700 }}> / {tm}</span>
            </div>
          </div>

          <div>
            <div style={{ height: '6px', backgroundColor: 'var(--card)', borderRadius: '999px', overflow: 'hidden', width: '100%' }}>
              <div style={{ height: '100%', width: `${marksPct}%`, backgroundColor: marksOk ? '#10B981' : allocatedMarks > tm ? '#EF4444' : '#0EA5E9', borderRadius: '999px', transition: 'width 0.35s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>{marksPct}% allocated</span>
              {!marksOk && (
                <span style={{ color: allocatedMarks > tm ? '#EF4444' : '#F59E0B', fontSize: '0.72rem', fontWeight: 700 }}>
                  {allocatedMarks > tm ? `Over by ${allocatedMarks - tm} marks` : `Remaining: ${tm - allocatedMarks} marks`}
                </span>
              )}
              {marksOk && (
                <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={11} /> Target achieved!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapter allocation modal */}
      {configOpen && (
        <ChapterModal
          type={configOpen}
          config={data[configOpen.key] || { count: 0, marks: configOpen.defaultMarks }}
          chapters={chapters}
          onSave={(alloc) => handleChapterSave(configOpen.key, alloc)}
          onClose={() => setConfigOpen(null)}
        />
      )}
    </div>
  )
}
