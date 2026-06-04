import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Q_TYPES } from './Step2QuestionComposition'

const DIFF = [
  { key: 'easy',   label: 'Easy',   color: '#10B981', focus: 'rgba(16,185,129,0.15)' },
  { key: 'medium', label: 'Medium', color: '#F59E0B', focus: 'rgba(245,158,11,0.15)' },
  { key: 'hard',   label: 'Hard',   color: '#EF4444', focus: 'rgba(239,68,68,0.15)' },
]

/* ── small numeric input with color focus ring ─────────── */
function DiffInput({ value, onChange, color, focusRing, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="number" min={0} max={999}
      value={disabled ? '' : value}
      disabled={disabled}
      onChange={(e) => onChange(Math.max(0, Math.min(999, Number(e.target.value))))}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={disabled ? '—' : '0'}
      style={{
        width: '62px', backgroundColor: disabled ? 'var(--card-2)' : 'var(--input-bg)',
        border: `1.5px solid ${focused ? color : 'var(--input-border)'}`,
        borderRadius: '7px', padding: '6px 6px', color: disabled ? 'var(--text-3)' : color,
        fontSize: '0.875rem', fontWeight: 700, textAlign: 'center', outline: 'none',
        boxShadow: focused ? `0 0 0 3px ${focusRing}` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  )
}

/* ── Chapter section ────────────────────────────────────── */
function ChapterSection({ chapter, activeTypes, chapterData, step2Data, crossChapterTotals, onChange }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Chapter header */}
      <button type="button" onClick={() => setCollapsed(!collapsed)}
        style={{ width: '100%', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card)', border: 'none', cursor: 'pointer', borderBottom: collapsed ? 'none' : '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {collapsed ? <ChevronRight size={15} color="var(--text-3)" /> : <ChevronDown size={15} color="var(--text-3)" />}
          <span style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '0.875rem' }}>{chapter}</span>
        </div>
        {/* Chapter total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {DIFF.map(({ key, color }) => {
            const total = activeTypes.reduce((s, t) => s + ((chapterData[t.key] || {})[key] || 0), 0)
            return total > 0 ? (
              <span key={key} style={{ color, fontSize: '0.75rem', fontWeight: 700, backgroundColor: `${color}18`, padding: '2px 7px', borderRadius: '999px' }}>
                {total}
              </span>
            ) : null
          })}
        </div>
      </button>

      {!collapsed && (
        <div className="w-full overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="min-w-[450px]">
            {/* Sub-header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 70px', padding: '8px 16px', gap: '8px' }}>
              <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</div>
              {DIFF.map(({ label, color }) => (
                <div key={label} style={{ color, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{label}</div>
              ))}
              <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Sum</div>
            </div>

            {/* One row per active question type */}
            {activeTypes.map((type, idx) => {
              const row     = chapterData[type.key] || { easy: 0, medium: 0, hard: 0 }
              const rowSum  = row.easy + row.medium + row.hard
              const typeMax = step2Data[type.key]?.count ?? 0
              const crossUsed = crossChapterTotals[type.key] || 0   // sum across ALL chapters
              const remaining = typeMax - crossUsed
              const overLimit = rowSum > typeMax   // conservative guard

              return (
                <div key={type.key}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 70px', padding: '10px 16px', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '0.82rem' }}>{type.label}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.7rem' }}>Max: {typeMax}</div>
                  </div>
                  {DIFF.map(({ key, color, focus }) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'center' }}>
                      <DiffInput
                        value={row[key]}
                        color={color}
                        focusRing={focus}
                        onChange={(v) => onChange(type.key, key, v)}
                      />
                    </div>
                  ))}
                  {/* Row sum */}
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: rowSum > typeMax ? '#EF4444' : rowSum > 0 ? '#0EA5E9' : 'var(--text-3)' }}>
                    {rowSum}
                    {rowSum > typeMax && <div style={{ color: '#EF4444', fontSize: '0.65rem', marginTop: '1px' }}>Exceeds!</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Step 3 Component ─────────────────────────────── */
export default function Step3DifficultyDistribution({ step2Data, data, onUpdate, chapters }) {
  // Only question types with count > 0
  const activeTypes = Q_TYPES.filter((t) => (step2Data[t.key]?.count ?? 0) > 0)

  // Chapters to show — if none explicitly selected, use a fallback
  const activeChapters = chapters.length > 0 ? chapters : ['All Chapters']

  // --- Smart Default Allocation Algorithm ---
  useEffect(() => {
    if (activeTypes.length === 0 || activeChapters.length === 0) return

    // Check if `data` is completely empty for active types across all chapters
    const isEmpty = activeChapters.every(ch => {
      const chData = data[ch]
      if (!chData) return true
      return activeTypes.every(t => {
        const typeData = chData[t.key]
        if (!typeData) return true
        return typeData.easy === 0 && typeData.medium === 0 && typeData.hard === 0
      })
    })

    if (isEmpty) {
      const numChapters = activeChapters.length
      const newData = { ...data }
      let hasChanges = false

      activeChapters.forEach(ch => {
        if (!newData[ch]) newData[ch] = {}
      })

      activeTypes.forEach(type => {
        const totalCount = step2Data[type.key]?.count ?? 0
        if (totalCount > 0) {
          hasChanges = true
          const baseCount = Math.floor(totalCount / numChapters)
          const remainder = totalCount % numChapters

          activeChapters.forEach((ch, idx) => {
            const easyCount = baseCount + (idx === 0 ? remainder : 0)
            newData[ch] = {
              ...newData[ch],
              [type.key]: {
                ...(newData[ch][type.key] || {}),
                easy: easyCount,
                medium: 0,
                hard: 0
              }
            }
          })
        }
      })

      if (hasChanges) {
        onUpdate(newData)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, step2Data]) // Run when chapters or step2 targets change

  // Cross-chapter totals per type (easy+medium+hard across all chapters)
  const crossChapterTotals = {}
  activeTypes.forEach((type) => {
    crossChapterTotals[type.key] = activeChapters.reduce((sum, ch) => {
      const row = (data[ch] || {})[type.key] || { easy: 0, medium: 0, hard: 0 }
      return sum + row.easy + row.medium + row.hard
    }, 0)
  })

  const handleChange = (chapter, typeKey, diffKey, val) => {
    const prev     = data[chapter] || {}
    const prevType = prev[typeKey] || { easy: 0, medium: 0, hard: 0 }
    onUpdate({
      ...data,
      [chapter]: { ...prev, [typeKey]: { ...prevType, [diffKey]: val } },
    })
  }

  // Grand totals row
  const grandTotals = { easy: 0, medium: 0, hard: 0 }
  activeChapters.forEach((ch) => {
    activeTypes.forEach((t) => {
      const row = (data[ch] || {})[t.key] || { easy: 0, medium: 0, hard: 0 }
      grandTotals.easy   += row.easy
      grandTotals.medium += row.medium
      grandTotals.hard   += row.hard
    })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.3rem' }}>Difficulty Distribution</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
          Distribute question difficulty per chapter. Only types with a question count appear.
        </p>
      </div>

      {/* Difficulty legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {DIFF.map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: `${color}12`, border: `1px solid ${color}30`, borderRadius: '999px', padding: '4px 10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
            <span style={{ color, fontSize: '0.75rem', fontWeight: 700 }}>{label}</span>
          </div>
        ))}
        {activeTypes.length === 0 && (
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>← Complete Step 2 first to see question types here</span>
        )}
      </div>

      {/* Per-type allocation status */}
      {activeTypes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {activeTypes.map((type) => {
            const used = crossChapterTotals[type.key] || 0
            const max  = step2Data[type.key]?.count ?? 0
            const over = used > max
            const done = used === max
            return (
              <div key={type.key} style={{ backgroundColor: 'var(--card-2)', border: `1px solid ${over ? 'rgba(239,68,68,0.4)' : done ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{type.label}</p>
                <p style={{ color: over ? '#EF4444' : done ? '#10B981' : '#0EA5E9', fontWeight: 800, fontSize: '1.1rem' }}>
                  {used}<span style={{ color: 'var(--text-3)', fontWeight: 500, fontSize: '0.8rem' }}> / {max}</span>
                </p>
                {over && <p style={{ color: '#EF4444', fontSize: '0.68rem' }}>Exceeds total!</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* Chapter sections */}
      {activeTypes.length > 0 ? (
        activeChapters.map((chapter) => (
          <ChapterSection
            key={chapter}
            chapter={chapter}
            activeTypes={activeTypes}
            chapterData={data[chapter] || {}}
            step2Data={step2Data}
            crossChapterTotals={crossChapterTotals}
            onChange={(typeKey, diffKey, val) => handleChange(chapter, typeKey, diffKey, val)}
          />
        ))
      ) : (
        <div style={{ backgroundColor: 'var(--card-2)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
          No active question types found. Go back to Step 2 and set question counts.
        </div>
      )}

      {/* Grand totals footer */}
      {activeTypes.length > 0 && (
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Grand Total</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {DIFF.map(({ key, label, color }) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ color, fontWeight: 800, fontSize: '1.1rem' }}>{grandTotals[key]}</div>
                <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.1rem' }}>{grandTotals.easy + grandTotals.medium + grandTotals.hard}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
