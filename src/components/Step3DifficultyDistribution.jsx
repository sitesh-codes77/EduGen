import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle, Layers } from 'lucide-react'
import { Q_TYPES } from './Step2QuestionComposition'

const DIFF = [
  { key: 'easy',   label: 'Easy',   color: '#76e6c0ff', focus: 'rgba(16,185,129,0.15)' },
  { key: 'medium', label: 'Medium', color: '#f0bf6aff', focus: 'rgba(245,158,11,0.15)' },
  { key: 'hard',   label: 'Hard',   color: '#eb6a6aff', focus: 'rgba(239,68,68,0.15)' },
]

/* ── small numeric input with color focus ring ─────────── */
function DiffInput({ value, onChange, color, focusRing, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="number" min={0} max={999}
      value={disabled ? '' : (value === 0 ? '' : value)}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(0, Math.min(999, Number(e.target.value))))}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={disabled ? '—' : '0'}
      style={{
        width: '68px',
        backgroundColor: disabled ? 'var(--card-2)' : 'var(--input-bg)',
        border: `1.5px solid ${focused ? color : 'var(--input-border)'}`,
        borderRadius: '9px',
        padding: '7px 6px',
        color: disabled ? 'var(--text-3)' : 'var(--text-1)',
        fontSize: '0.9rem',
        fontWeight: 800,
        textAlign: 'center',
        outline: 'none',
        boxShadow: focused ? `0 0 0 3px ${focusRing}` : 'none',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  )
}

/* ── Chapter section ────────────────────────────────────── */
function ChapterSection({ chapter, activeTypes, chapterData, step2Data, crossChapterTotals, onChange }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
      {/* Chapter header */}
      <button type="button" onClick={() => setCollapsed(!collapsed)}
        style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card)', border: 'none', cursor: 'pointer', borderBottom: collapsed ? 'none' : '1px solid var(--border)', transition: 'background-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--card-2)', borderRadius: '8px', padding: '6px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </div>
          <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em', textAlign: 'left' }}>{chapter}</span>
        </div>
        {/* Chapter total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {DIFF.map(({ key, color }) => {
            const total = activeTypes.reduce((s, t) => s + ((chapterData[t.key] || {})[key] || 0), 0)
            return total > 0 ? (
              <span key={key} style={{ color, fontSize: '0.72rem', fontWeight: 800, backgroundColor: `${color}14`, border: `1px solid ${color}25`, padding: '3px 8px', borderRadius: '999px' }}>
                {total} {key}
              </span>
            ) : null
          })}
        </div>
      </button>

      {!collapsed && (
        <div className="w-full overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ minWidth: '500px', padding: '0.75rem 1rem' }}>
            {/* Sub-header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px 80px', padding: '10px 12px', gap: '12px' }}>
              <div style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question Type</div>
              {DIFF.map(({ label, color }) => (
                <div key={label} style={{ color, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{label}</div>
              ))}
              <div style={{ color: '#0EA5E9', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Sum</div>
            </div>

            {/* One row per active question type */}
            {activeTypes.map((type, idx) => {
              const row     = chapterData[type.key] || { easy: 0, medium: 0, hard: 0 }
              const rowSum  = row.easy + row.medium + row.hard
              const typeMax = step2Data[type.key]?.count ?? 0
              const crossUsed = crossChapterTotals[type.key] || 0
              const remaining = typeMax - crossUsed
              const overLimit = rowSum > typeMax

              return (
                <div key={type.key}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px 80px', padding: '12px', alignItems: 'center', gap: '12px', borderTop: idx > 0 ? '1px solid var(--border)' : 'none', borderRadius: '10px', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: rowSum > 0 ? '#0EA5E9' : 'var(--border-2)' }} />
                    <div>
                      <div style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.875rem' }}>{type.label}</div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 500 }}>Target: {typeMax}</div>
                    </div>
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: rowSum > typeMax ? '#EF4444' : rowSum > 0 ? '#0EA5E9' : 'var(--text-3)' }}>
                      {rowSum}
                    </span>
                    {rowSum > typeMax && (
                      <span style={{ color: '#EF4444', fontSize: '0.65rem', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={9} /> Exceeds
                      </span>
                    )}
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
          // Prefer explicit chapter allocation from Configure modal
          const chapterAlloc = step2Data[type.key]?.chapterAlloc

          activeChapters.forEach((ch, idx) => {
            let easyCount
            if (chapterAlloc && chapterAlloc[ch] !== undefined) {
              easyCount = chapterAlloc[ch]
            } else {
              const baseCount = Math.floor(totalCount / numChapters)
              const remainder = totalCount % numChapters
              easyCount = baseCount + (idx === 0 ? remainder : 0)
            }
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
  }, [chapters, step2Data])

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
    const max = step2Data[typeKey]?.count ?? 0
    let newType = { ...prevType, [diffKey]: val }
    let sum = newType.easy + newType.medium + newType.hard
    
    if (sum > max) {
      let excess = sum - max
      if (diffKey !== 'easy' && newType.easy > 0) {
        const reduceBy = Math.min(newType.easy, excess)
        newType.easy -= reduceBy
        excess -= reduceBy
      }
      if (excess > 0 && diffKey !== 'medium' && newType.medium > 0) {
        const reduceBy = Math.min(newType.medium, excess)
        newType.medium -= reduceBy
        excess -= reduceBy
      }
      if (excess > 0 && diffKey !== 'hard' && newType.hard > 0) {
        const reduceBy = Math.min(newType.hard, excess)
        newType.hard -= reduceBy
        excess -= reduceBy
      }
      if (excess > 0) {
        newType[diffKey] -= excess
      }
    }

    onUpdate({
      ...data,
      [chapter]: { ...prev, [typeKey]: newType },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Difficulty Distribution</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
          Distribute question difficulty level per chapter. Ensure the sums match configured totals.
        </p>
      </div>

      {/* Difficulty legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {DIFF.map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: `${color}10`, border: `1px solid ${color}25`, borderRadius: '999px', padding: '5px 12px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
            <span style={{ color, fontSize: '0.75rem', fontWeight: 800 }}>{label}</span>
          </div>
        ))}
        {activeTypes.length === 0 && (
          <span style={{ color: 'var(--text-3)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={13} /> Complete Step 2 first to see question types.
          </span>
        )}
      </div>

      {/* Per-type allocation status dashboard */}
      {activeTypes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.875rem' }}>
          {activeTypes.map((type) => {
            const used = crossChapterTotals[type.key] || 0
            const max  = step2Data[type.key]?.count ?? 0
            const over = used > max
            const done = used === max
            return (
              <div key={type.key} style={{ backgroundColor: 'var(--card-2)', border: `1.5px solid ${over ? '#EF4444' : done ? '#10B981' : 'var(--border)'}`, borderRadius: '14px', padding: '0.85rem 1.1rem', boxShadow: 'var(--shadow)', transition: 'all 0.25s ease' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{type.label} Allocation</p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <p style={{ color: over ? '#EF4444' : done ? '#10B981' : '#0EA5E9', fontWeight: 900, fontSize: '1.25rem' }}>
                    {used}<span style={{ color: 'var(--text-3)', fontWeight: 600, fontSize: '0.82rem' }}> / {max}</span>
                  </p>
                  {done && <CheckCircle2 size={14} color="#10B981" style={{ alignSelf: 'center' }} />}
                  {over && <AlertTriangle size={14} color="#EF4444" style={{ alignSelf: 'center' }} />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Chapter sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          <div style={{ backgroundColor: 'var(--card-2)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
            No active question types found. Go back to Step 2 and set question counts.
          </div>
        )}
      </div>

      {/* Grand totals footer stats card */}
      {activeTypes.length > 0 && (
        <div style={{ backgroundColor: 'var(--card-2)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: 'var(--primary-dim)', borderRadius: '8px', padding: '6px', color: '#0EA5E9' }}>
              <Layers size={16} />
            </div>
            <div>
              <span style={{ color: 'var(--text-2)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Difficulty Stats Summary</span>
              <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginTop: '2px' }}>Total questions distributed by difficulty level</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {DIFF.map(({ key, label, color }) => (
              <div key={key} style={{ textAlign: 'center', minWidth: '56px' }}>
                <div style={{ color, fontWeight: 900, fontSize: '1.3rem' }}>{grandTotals[key]}</div>
                <div style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
            <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--border)', alignSelf: 'center' }} />
            <div style={{ textAlign: 'center', minWidth: '56px' }}>
              <div style={{ color: '#0EA5E9', fontWeight: 900, fontSize: '1.3rem' }}>{grandTotals.easy + grandTotals.medium + grandTotals.hard}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
