import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const BOOKS = [
  'NCERT Physics (Class 11)',
  'NCERT Physics (Class 12)',
  'HC Verma - Concepts of Physics',
  'NCERT Mathematics',
  'RD Sharma Mathematics',
  'NCERT Chemistry',
  'OP Tandon Physical Chemistry',
]

const CHAPTERS_MAP = {
  'NCERT Physics (Class 11)': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Laws of Motion', 'Work, Energy and Power'],
  'NCERT Physics (Class 12)': ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism'],
  'HC Verma - Concepts of Physics': ['Introduction to Physics', 'Physics and Mathematics', 'Rest and Motion: Kinematics', 'The Forces'],
  'NCERT Mathematics': ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Principle of Mathematical Induction', 'Complex Numbers'],
  'RD Sharma Mathematics': ['Algebraic Expressions', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles'],
  'NCERT Chemistry': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding'],
  'OP Tandon Physical Chemistry': ['Atomic Structure', 'Radioactivity and Nuclear Transformation', 'States of Matter', 'Solutions'],
}

function Dropdown({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </label>
      )}
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: `1.5px solid ${open ? '#0EA5E9' : 'var(--input-border)'}`, borderRadius: '10px', padding: '10px 13px', color: value ? 'var(--text-1)' : 'var(--text-3)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', transition: 'all 0.2s', boxShadow: open ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none', textAlign: 'left' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || placeholder}</span>
        <ChevronDown size={14} color="var(--text-3)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{ position: 'relative', marginTop: '5px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', zIndex: 100, overflowY: 'auto', maxHeight: '240px', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
              style={{ width: '100%', padding: '9px 13px', background: value === opt ? 'var(--primary-dim)' : 'none', border: 'none', color: value === opt ? '#0EA5E9' : 'var(--text-2)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s' }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'var(--card-2)' }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent' }}>
              {opt}
              {value === opt && <Check size={13} color="#0EA5E9" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiSelectDropdown({ label, options, selected = [], onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const allSelected = options.length > 0 && selected.length === options.length
  const toggleAll = () => onChange(allSelected ? [] : [...options])
  const toggle = (ch) => onChange(selected.includes(ch) ? selected.filter((c) => c !== ch) : [...selected, ch])

  const displayText =
    selected.length === 0 ? 'All chapters (none pinned)'
    : allSelected ? 'All chapters'
    : selected.length === 1 ? selected[0]
    : `${selected.length} chapters selected`

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </label>
      )}
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: `1.5px solid ${open ? '#0EA5E9' : 'var(--input-border)'}`, borderRadius: '10px', padding: '10px 13px', color: 'var(--text-1)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: open ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none', transition: 'all 0.2s', textAlign: 'left' }}>
        <span>{displayText}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected.length > 0 && !allSelected && (
            <span style={{ backgroundColor: '#0EA5E9', color: '#fff', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{selected.length}</span>
          )}
          <ChevronDown size={14} color="var(--text-3)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>

      {open && (
        <div style={{ position: 'relative', marginTop: '5px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', zIndex: 100, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', maxHeight: '240px', overflowY: 'auto' }}>
          <button type="button" onClick={toggleAll}
            style={{ width: '100%', padding: '9px 13px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', color: '#0EA5E9', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Checkbox checked={allSelected} />
            Select All Chapters
          </button>
          {options.map((ch) => {
            const checked = selected.includes(ch)
            return (
              <button key={ch} type="button" onClick={() => toggle(ch)}
                style={{ width: '100%', padding: '9px 13px', background: checked ? 'var(--primary-dim)' : 'none', border: 'none', color: checked ? '#0EA5E9' : 'var(--text-2)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '9px', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { if (!checked) e.currentTarget.style.backgroundColor = 'var(--card-2)' }}
                onMouseLeave={(e) => { if (!checked) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <Checkbox checked={checked} />
                {ch}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked }) {
  return (
    <div style={{ width: '15px', height: '15px', borderRadius: '4px', border: `2px solid ${checked ? '#0EA5E9' : 'var(--border-2)'}`, backgroundColor: checked ? '#0EA5E9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
      {checked && <Check size={9} color="#fff" strokeWidth={3} />}
    </div>
  )
}

export default function Step1ContentSelection({ data, onChange }) {
  const chapters = data.book ? (CHAPTERS_MAP[data.book] || []) : []

  const handleBookChange = (val) => onChange({ ...data, book: val, chapters: [] })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.3rem' }}>Content Selection</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Choose the textbook and chapters to draw questions from.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Dropdown label="Select Book" options={BOOKS} value={data.book} onChange={handleBookChange} placeholder="Select a book..." />
        
        {data.book ? (
          <MultiSelectDropdown
            label={`Select Chapters — ${data.book}`}
            options={chapters}
            selected={data.chapters}
            onChange={(v) => onChange({ ...data, chapters: v })}
          />
        ) : (
          <div style={{ backgroundColor: 'var(--card-2)', border: '1px dashed var(--border)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
            Select a book above to choose specific chapters
          </div>
        )}
      </div>

    </div>
  )
}

export { BOOKS, CHAPTERS_MAP }
