import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Phone, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); navigate('/generator') }

  const inputStyle = (field) => ({
    width: '100%',
    backgroundColor: 'var(--input-bg)',
    border: `1.5px solid ${focused === field ? '#0EA5E9' : 'var(--input-border)'}`,
    borderRadius: '10px',
    padding: '11px 14px 11px 42px',
    color: 'var(--text-1)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === field ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with theme toggle */}
      <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '1.2rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s', zIndex: 10 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#0EA5E9')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
        ← Back to Home
      </button>

      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Centered card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.25rem', width: '100%', maxWidth: '430px', boxShadow: 'var(--shadow)', position: 'relative', zIndex: 1 }}
        >
          {/* Card header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.1rem' }}>
              <div style={{ background: 'linear-gradient(135deg,#0EA5E9,#6366F1)', borderRadius: '9px', padding: '7px' }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(90deg,#0EA5E9,#818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduGen</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Sign in to access the Question Generator</p>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '1.75rem' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { name: 'name',     label: 'Full Name',     type: 'text',     Icon: User,  placeholder: 'e.g. Dr. Anika Sharma' },
              { name: 'phone',    label: 'Phone Number',  type: 'tel',      Icon: Phone, placeholder: '+91 98765 43210' },
            ].map(({ name, label, type, Icon, placeholder }) => (
              <div key={name}>
                <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} color={focused === name ? '#0EA5E9' : 'var(--text-3)'} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }} />
                  <input id={name} type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} onFocus={() => setFocused(name)} onBlur={() => setFocused('')} style={inputStyle(name)} required />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color={focused === 'password' ? '#0EA5E9' : 'var(--text-3)'} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }} />
                <input id="password" type={showPw ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} style={{ ...inputStyle('password'), paddingRight: '42px' }} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0EA5E9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '-0.3rem' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
            </div>

            <button id="accessGeneratorBtn" type="submit"
              style={{ width: '100%', background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 4px 18px rgba(14,165,233,0.3)', transition: 'all 0.2s', marginTop: '0.4rem' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,233,0.45)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(14,165,233,0.3)' }}>
              Access Generator <ArrowRight size={17} />
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '1.35rem' }}>
            Don't have an account?{' '}
            <button style={{ background: 'none', border: 'none', color: '#0EA5E9', cursor: 'pointer', fontWeight: 600 }}>Contact Admin</button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
