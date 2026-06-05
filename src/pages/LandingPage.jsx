import { useNavigate } from 'react-router-dom'
import { Brain, Layers, Wand2, ArrowRight, Sparkles, ChevronRight, NotebookText } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import useWizardStore from '../store/useWizardStore'

const features = [
  { icon: Brain,  title: 'Smart Selection',    description: 'Intelligently curates questions based on curriculum standards, learning objectives, and cognitive levels.', color: '#0EA5E9', glow: 'rgba(14,165,233,0.12)' },
  { icon: Layers, title: 'Custom Composition', description: 'Fine-tune MCQ, MSQ, short and long answer ratios. Set marks per question and target total score with precision.', color: '#10B981', glow: 'rgba(16,185,129,0.12)' },
  { icon: Wand2,  title: 'AI Review',          description: 'Automated review flags duplicate or ambiguous questions ensuring a polished, exam-ready paper every time.', color: '#F59E0B', glow: 'rgba(245,158,11,0.12)' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const isDark = useWizardStore((s) => s.isDark)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NotebookText size={22} color="#0EA5E9" />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0EA5E9', letterSpacing: '-0.02em' }}>
              EduGen
            </span>
          </div>

          {/* Nav links (removed) */}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#0EA5E9', border: '1.5px solid #0EA5E9', color: '#fff', borderRadius: '999px', padding: '8px 24px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(14,165,233,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}>
              Login <ChevronRight size={13} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '5%', left: '15%', width: '500px', height: '500px', background: isDark ? 'radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '400px', height: '400px', background: isDark ? 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-dim)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '999px', padding: '5px 14px', marginBottom: '1.75rem', color: '#0EA5E9', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <Sparkles size={11} /> AI-Powered Education
        </div>

        {/* Headline */}
        <h1 style={{ 
          fontFamily: "'Plus Jakarta Sans', 'Noto Sans Math', sans-serif",
          fontSize: 'clamp(2.4rem,6vw,4.2rem)', 
          fontWeight: 900, 
          lineHeight: 1.1, 
          letterSpacing: '-0.03em', 
          maxWidth: '800px', 
          marginBottom: '1.25rem', 
          color: 'var(--text-1)' 
        }}>
          Intelligent{' '}
          <span style={{ background: 'linear-gradient(135deg,#0EA5E9 0%,#818CF8 50%,#10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Question Paper
          </span>
          <br />Generation.
        </h1>

        <p style={{ color: 'var(--text-2)', fontSize: 'clamp(1rem,2vw,1.15rem)', maxWidth: '540px', lineHeight: 1.7, marginBottom: '2.25rem' }}>
          Craft perfectly balanced exam papers in minutes. Select chapters, configure difficulty,
          and let AI compose a publication-ready question paper — every time.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/login')}
            style={{ background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 0 16px rgba(14,165,233,0.3), 0 4px 20px rgba(14,165,233,0.25)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(14,165,233,0.65), 0 8px 28px rgba(14,165,233,0.45)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 16px rgba(14,165,233,0.3), 0 4px 20px rgba(14,165,233,0.25)' }}>
            Start Generating <ArrowRight size={17} />
          </button>
          <button style={{ background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '13px 28px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', marginTop: '3.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ value: '10,000+', label: 'Papers Generated' }, { value: '500+', label: 'Institutions' }, { value: '98%', label: 'Satisfaction Rate' }].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0EA5E9', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Features ── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
            Everything you need to create great exams
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto' }}>
            A complete toolkit built for educators who demand precision and efficiency.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem' }}>
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.82rem' }}>
        © 2026 EduGen. Built for educators, powered by AI.
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  const blueColor = '#0EA5E9'
  const blueGlow = 'rgba(14,165,233,0.12)'
  return (
    <div
      style={{ 
        backgroundColor: 'var(--card)', 
        border: '1px solid var(--border)', 
        borderRadius: '16px', 
        padding: '1.75rem', 
        transition: 'all 0.28s ease', 
        cursor: 'default',
        textAlign: 'center' 
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.borderColor = blueColor; 
        e.currentTarget.style.transform = 'translateY(-8px)'; 
        e.currentTarget.style.boxShadow = '0 20px 35px rgba(14, 165, 233, 0.18)'; 
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.borderColor = 'var(--border)'; 
        e.currentTarget.style.transform = 'none'; 
        e.currentTarget.style.boxShadow = 'none'; 
      }}
    >
      <div style={{ 
        width: '46px', 
        height: '46px', 
        borderRadius: '12px', 
        backgroundColor: blueGlow, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 1.1rem', 
        border: `1px solid rgba(14,165,233,0.2)` 
      }}>
        <Icon size={20} color={blueColor} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.6rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.6 }}>{description}</p>
    </div>
  )
}
