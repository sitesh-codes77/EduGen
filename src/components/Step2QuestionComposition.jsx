import { useState } from 'react'
import { Settings2, X, Hash, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export const Q_TYPES = [
  { key: 'mcq', label: 'MCQ', description: 'Multiple Choice – Single Answer', defaultMarks: 1 },
  { key: 'msq', label: 'MSQ', description: 'Multiple Select – Multi Answer', defaultMarks: 2 },
  { key: 'numerical', label: 'Numerical', description: 'Number input answers', defaultMarks: 4 },
  { key: 'short', label: 'Short Answer', description: '2–3 sentence answers', defaultMarks: 3 },
  { key: 'long', label: 'Long Answer', description: 'Essay-type detailed answers', defaultMarks: 5 },
]

/* ─── small reusable number input ─────────────────────── */
function NumInput({ value, onChange, min = 0, max = 999, width = '68px', color = 'var(--text-1)', highlight = false }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="number" min={min} max={max} value={value}
      onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width, backgroundColor: 'var(--input-bg)',
        border: `1.5px solid ${focused ? '#0EA5E9' : highlight ? 'var(--border-2)' : 'var(--input-border)'}`,
        borderRadius: '8px', padding: '7px 8px', color,
        fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', outline: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    />
  )
}

/* ─── Configure modal ──────────────────────────────────── */
function ConfigModal({ type, config, totalQuestions, usedByOthers, onSave, onClose }) {
  const [local, setLocal] = useState({ count: config.count, marks: config.marks })
  const maxCount = Math.max(0, totalQuestions - usedByOthers)
  const subtotal = local.count * local.marks

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '380px', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '1rem' }}>Configure {type.label}</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '2px' }}>{type.description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Count */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Number of Questions <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(max: {totalQuestions === '' ? '—' : maxCount + local.count})</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={() => setLocal((p) => ({ ...p, count: Math.max(0, p.count - 1) }))}
                style={{ width: '34px', height: '34px', backgroundColor: 'var(--card-2)', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <NumInput value={local.count} onChange={(v) => setLocal((p) => ({ ...p, count: Math.min(maxCount + config.count, v) }))} min={0} width="80px" />
              <button type="button" onClick={() => setLocal((p) => ({ ...p, count: Math.min(maxCount + config.count, p.count + 1) }))}
                style={{ width: '34px', height: '34px', backgroundColor: 'var(--card-2)', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>

          {/* Marks per Q */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Marks per Question
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={() => setLocal((p) => ({ ...p, marks: Math.max(1, p.marks - 1) }))}
                style={{ width: '34px', height: '34px', backgroundColor: 'var(--card-2)', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <NumInput value={local.marks} onChange={(v) => setLocal((p) => ({ ...p, marks: Math.max(1, v) }))} min={1} width="80px" color="#0EA5E9" />
              <button type="button" onClick={() => setLocal((p) => ({ ...p, marks: p.marks + 1 }))}
                style={{ width: '34px', height: '34px', backgroundColor: 'var(--card-2)', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>

          {/* Subtotal pill */}
          <div style={{ backgroundColor: 'var(--primary-dim)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>Subtotal contribution</span>
            <span style={{ color: '#0EA5E9', fontWeight: 800, fontSize: '1.25rem' }}>
              {subtotal} <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-3)' }}>marks</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.4rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onSave(local); onClose() }}
            style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Apply</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Step 2 Component ────────────────────────────── */
export default function Step2QuestionComposition({ data, onTotalQChange, onTotalMarksChange, onTypeConfig }) {
  const [configOpen, setConfigOpen] = useState(null)

  const tq = data.totalQuestions === '' ? 0 : Number(data.totalQuestions)
  const tm = data.totalMarks === '' ? 0 : Number(data.totalMarks)

  const allocatedCount = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)
  const allocatedMarks = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0) * (data[t.key]?.marks ?? 0), 0)

  const countOk = tq === 0 || allocatedCount === tq
  const marksOk = tm === 0 || allocatedMarks === tm

  const usedByOthers = (excludeKey) =>
    Q_TYPES.filter((t) => t.key !== excludeKey).reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.3rem' }}>Question Composition</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Set the paper targets, then distribute questions by type.</p>
      </div>

      {/* ── Target inputs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Questions */}
        <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Hash size={16} color="#0EA5E9" />
            <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Number of Questions</span>
          </div>
          <input
            id="totalQuestionsInput"
            className="text-slate-900 dark:text-slate-50"
            type="number" min={0} max={500}
            value={data.totalQuestions}
            placeholder="e.g. 30"
            onChange={(e) => onTotalQChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '2px solid var(--border)', borderRadius: '10px', padding: '12px 16px', fontSize: '1.5rem', fontWeight: 800, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={(e) => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 4px rgba(14,165,233,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
          <p style={{ color: !countOk && tq > 0 ? '#EF4444' : 'var(--text-3)', fontSize: '0.85rem', marginTop: '10px', fontWeight: 500 }}>
            {tq > 0 ? `Allocated: ${allocatedCount} / ${tq}` : 'Enter the target number of questions'}
          </p>
        </div>

        {/* Total Marks */}
        <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Award size={16} color="#10B981" />
            <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Marks for Paper</span>
          </div>
          <input
            id="totalMarksInput"
            className="text-slate-900 dark:text-slate-50"
            type="number" min={0} max={1000}
            value={data.totalMarks}
            placeholder="e.g. 100"
            onChange={(e) => onTotalMarksChange(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '2px solid var(--border)', borderRadius: '10px', padding: '12px 16px', fontSize: '1.5rem', fontWeight: 800, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
          <p style={{ color: !marksOk && tm > 0 ? '#EF4444' : 'var(--text-3)', fontSize: '0.85rem', marginTop: '10px', fontWeight: 500 }}>
            {tm > 0 ? `Allocated: ${allocatedMarks} / ${tm}` : 'Enter the total marks for this paper'}
          </p>
        </div>
      </div>

      {/* ── Distribution table ── */}
      <div className="w-full overflow-x-auto" style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ minWidth: '600px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 120px 120px 140px', padding: '16px 24px', backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)', gap: '16px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question Type</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Count</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Mark</div>
            <div></div>
          </div>

          {Q_TYPES.map((type, idx) => {
            const cfg = data[type.key] || { count: 0, marks: type.defaultMarks }
            return (
              <div key={type.key}
                style={{ display: 'grid', gridTemplateColumns: '2fr 120px 120px 140px', padding: '16px 24px', alignItems: 'center', gap: '16px', borderBottom: idx < Q_TYPES.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '0.95rem' }}>{type.label}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{type.description}</div>
                </div>
                {/* Count — inline editable */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumInput value={cfg.count} onChange={(v) => onTypeConfig(type.key, { count: Math.min(tq === '' ? 999 : tq - usedByOthers(type.key), v) })} min={0} width="80px" highlight={cfg.count > 0} />
                </div>
                {/* Marks per Question */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '1rem', backgroundColor: 'var(--card)', padding: '6px 20px', borderRadius: '10px', border: '1px solid var(--border)', display: 'inline-block', textAlign: 'center', minWidth: '60px' }}>{cfg.marks}</span>
                </div>
                {/* Configure */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button onClick={() => setConfigOpen(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-dim)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '8px', padding: '8px 14px', color: '#0EA5E9', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(14,165,233,0.2)'; e.currentTarget.style.borderColor = '#0EA5E9' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-dim)'; e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)' }}>
                    <Settings2 size={14} /> Configure
                  </motion.button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Marks allocation bar ── */}
      {tm > 0 && (
        <div style={{ backgroundColor: marksOk ? 'var(--success-dim)' : allocatedMarks > tm ? 'var(--danger-dim)' : 'var(--card-2)', border: `1px solid ${marksOk ? 'rgba(16,185,129,0.3)' : allocatedMarks > tm ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Marks Allocated</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.72rem', marginTop: '2px' }}>
              {Q_TYPES.filter((t) => (data[t.key]?.count ?? 0) > 0).map((t) => `${t.label}: ${data[t.key].count}×${data[t.key].marks}`).join(' + ') || '—'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: marksOk ? '#10B981' : allocatedMarks > tm ? '#EF4444' : '#0EA5E9' }}>
              {allocatedMarks}
            </span>
            <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}> / {tm}</span>
            {!marksOk && tm > 0 && (
              <p style={{ color: allocatedMarks > tm ? '#EF4444' : '#F59E0B', fontSize: '0.72rem', marginTop: '2px' }}>
                {allocatedMarks > tm ? `Over by ${allocatedMarks - tm}` : `Remaining: ${tm - allocatedMarks}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Configure modal */}
      {configOpen && (
        <ConfigModal
          type={configOpen}
          config={data[configOpen.key] || { count: 0, marks: configOpen.defaultMarks }}
          totalQuestions={tq}
          usedByOthers={usedByOthers(configOpen.key)}
          onSave={(val) => onTypeConfig(configOpen.key, val)}
          onClose={() => setConfigOpen(null)}
        />
      )}
    </div>
  )
}
