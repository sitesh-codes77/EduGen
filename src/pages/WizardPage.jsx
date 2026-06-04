import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, ListChecks, BarChart3, ClipboardCheck,
  ChevronRight, RotateCcw, Sparkles, FileCheck2,
  ArrowLeft, X, Check, AlertCircle,
} from 'lucide-react'
import useWizardStore from '../store/useWizardStore'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../components/Toast'
import Step1ContentSelection from '../components/Step1ContentSelection'
import Step2QuestionComposition, { Q_TYPES } from '../components/Step2QuestionComposition'
import Step3DifficultyDistribution from '../components/Step3DifficultyDistribution'
import Step4Review from '../components/Step4Review'
import { motion, AnimatePresence } from 'framer-motion'

import { step1Schema, step2Schema, validateStep3 } from '../store/validation'

/* ── Step metadata ──────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Content',     sublabel: 'Book & Chapters',      icon: BookOpen     },
  { id: 2, label: 'Composition', sublabel: 'Questions & Marks',     icon: ListChecks   },
  { id: 3, label: 'Difficulty',  sublabel: 'Easy / Medium / Hard',  icon: BarChart3    },
  { id: 4, label: 'Review',      sublabel: 'Confirm & Generate',    icon: ClipboardCheck },
]

/* ── Horizontal Stepper ─────────────────────────────────── */
function Stepper({ current, onGoto }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {STEPS.map((step, idx) => {
        const done   = current > step.id
        const active = current === step.id
        const Icon   = step.icon
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
            {/* Node */}
            <button type="button" onClick={() => done && onGoto(step.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', background: 'none', border: 'none', cursor: done ? 'pointer' : 'default', padding: 0, flexShrink: 0 }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: done ? '#0EA5E9' : active ? 'var(--primary-dim)' : 'var(--card-2)',
                border: `2px solid ${done ? '#0EA5E9' : active ? '#0EA5E9' : 'var(--border)'}`,
                boxShadow: active ? '0 0 0 4px rgba(14,165,233,0.15)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {done
                  ? <Check size={17} color="#fff" strokeWidth={2.5} />
                  : <Icon size={16} color={active ? '#0EA5E9' : 'var(--text-3)'} />
                }
              </div>
              <div style={{ textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: active ? 'var(--text-1)' : done ? '#0EA5E9' : 'var(--text-3)', transition: 'color 0.3s' }}>
                  {step.label}
                </div>
              </div>
            </button>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', margin: '0 6px', marginBottom: '22px', backgroundColor: current > step.id ? '#0EA5E9' : 'var(--border)', borderRadius: '2px', transition: 'background-color 0.35s ease', position: 'relative', overflow: 'hidden' }}>
                {current > step.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#0EA5E9,#38BDF8)' }} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Generate success modal ─────────────────────────────── */
function GenerateModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(8px)' }}>
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
          <X size={17} />
        </button>
        <div style={{ width: '68px', height: '68px', margin: '0 auto 1.5rem', background: 'radial-gradient(circle,rgba(16,185,129,0.18) 0%,transparent 70%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(16,185,129,0.35)' }}>
          <FileCheck2 size={30} color="#10B981" />
        </div>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.65rem' }}>Paper Generated! 🎉</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Your question paper has been successfully composed and is ready for download. All questions have passed the AI quality review.
        </p>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
          <button style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', borderRadius: '9px', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Inline validation error banner ─────────────────────── */
function ValidationBanner({ message }) {
  if (!message) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: 'var(--danger-dim)', border: '1.5px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '0.85rem 1rem', marginTop: '-0.5rem' }}>
      <AlertCircle size={17} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
      <p style={{ color: '#EF4444', fontSize: '0.85rem', lineHeight: 1.5 }}>{message}</p>
    </div>
  )
}

/* ── Wizard Page ────────────────────────────────────────── */
export default function WizardPage() {
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)
  const [bannerMsg,   setBannerMsg]   = useState('')

  // Store selectors
  const currentStep      = useWizardStore((s) => s.currentStep)
  const setStep          = useWizardStore((s) => s.setStep)
  const step1            = useWizardStore((s) => s.step1)
  const step2            = useWizardStore((s) => s.step2)
  const step3            = useWizardStore((s) => s.step3)
  const updateStep1      = useWizardStore((s) => s.updateStep1)
  const setTotalQuestions= useWizardStore((s) => s.setTotalQuestions)
  const setTotalMarks    = useWizardStore((s) => s.setTotalMarks)
  const updateTypeConfig = useWizardStore((s) => s.updateTypeConfig)
  const updateStep3      = useWizardStore((s) => s.updateStep3)
  const resetCurrentStep = useWizardStore((s) => s.resetCurrentStep)

  const isFinalStep = currentStep === 4

  /* ── Validation ─────────────────────────────────────── */
  const validateStep = (step) => {
    if (step === 1) {
      const res = step1Schema.safeParse(step1)
      if (!res.success) {
        const msg = res.error.errors[0].message
        setBannerMsg(msg)
        showToast(msg, 'error')
        return false
      }
    } else if (step === 2) {
      const targetMarks = Number(step2.totalMarks) || 0
      const targetQuestions = Number(step2.totalQuestions) || 0
      
      const mcqMarks = (step2.mcq?.count ?? 0) * (step2.mcq?.marks ?? 1)
      const msqMarks = (step2.msq?.count ?? 0) * (step2.msq?.marks ?? 2)
      const numericalMarks = (step2.numerical?.count ?? 0) * (step2.numerical?.marks ?? 4)
      const shortMarks = (step2.short?.count ?? 0) * (step2.short?.marks ?? 3)
      const longMarks = (step2.long?.count ?? 0) * (step2.long?.marks ?? 5)
      
      const mcqCount = (step2.mcq?.count ?? 0)
      const msqCount = (step2.msq?.count ?? 0)
      const numericalCount = (step2.numerical?.count ?? 0)
      const shortCount = (step2.short?.count ?? 0)
      const longCount = (step2.long?.count ?? 0)

      const allocatedMarks = mcqMarks + msqMarks + numericalMarks + shortMarks + longMarks
      const allocatedQuestions = mcqCount + msqCount + numericalCount + shortCount + longCount

      if (allocatedMarks !== targetMarks || allocatedQuestions !== targetQuestions) {
        const msg = `Error: You allocated ${allocatedMarks} marks and ${allocatedQuestions} questions, but the target is ${targetMarks} marks and ${targetQuestions} questions.`
        setBannerMsg(msg)
        showToast(msg, 'error')
        return false
      }

      const res = step2Schema.safeParse(step2)
      if (!res.success) {
        const msg = res.error.errors[0].message
        setBannerMsg(msg)
        showToast(msg, 'error')
        return false
      }
    } else if (step === 3) {
      const targetQuestions = Number(step2.totalQuestions) || 0
      let sumDistributed = 0
      const chaptersToIterate = activeChapters.length > 0 ? activeChapters : ['All Chapters']
      
      for (const chapter of chaptersToIterate) {
        const chapterData = step3[chapter] || {}
        for (const typeKey of ['mcq', 'msq', 'numerical', 'short', 'long']) {
          if (chapterData[typeKey]) {
            sumDistributed += (Number(chapterData[typeKey].easy) || 0)
                            + (Number(chapterData[typeKey].medium) || 0)
                            + (Number(chapterData[typeKey].hard) || 0)
          }
        }
      }

      if (sumDistributed !== targetQuestions) {
        const missing = targetQuestions - sumDistributed
        const msg = `Error: You have distributed ${sumDistributed} questions, but you need to distribute exactly ${targetQuestions} questions. You are missing ${missing} questions.`
        setBannerMsg(msg)
        showToast(msg, 'error')
        return false
      }

      const res = validateStep3(step3, step2, activeChapters)
      if (!res.success) {
        const msg = res.error.errors[0].message
        setBannerMsg(msg)
        showToast(msg, 'error')
        return false
      }
    }
    setBannerMsg('')
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < 4) {
      if (currentStep === 2 || currentStep === 3) {
        showToast('Configuration saved successfully!', 'success')
      }
      setStep(currentStep + 1)
    }
    else setShowSuccess(true)
  }

  const handleBack = () => {
    setBannerMsg('')
    setStep(currentStep - 1)
  }

  const handleGoto = (step) => {
    setBannerMsg('')
    setStep(step)
  }

  const handleReset = () => {
    setBannerMsg('')
    resetCurrentStep()
  }

  /* ── Chapters for Step 3 ────────────────────────────── */
  const activeChapters = step1.chapters?.length > 0 ? step1.chapters : []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ── */}
      <div style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0EA5E9')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
          <ArrowLeft size={15} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: 'linear-gradient(135deg,#0EA5E9,#6366F1)', borderRadius: '6px', padding: '4px' }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', background: 'linear-gradient(90deg,#0EA5E9,#818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduGen</span>
          </div>
        </button>

        <div style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 500 }}>
          Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>Auto-saving</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Stepper card */}
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem 2rem', boxShadow: 'var(--shadow)' }}>
          <div className="w-full overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Stepper current={currentStep} onGoto={handleGoto} />
          </div>
        </div>

        {/* Step content card */}
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2rem', boxShadow: 'var(--shadow)', flex: 1, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Step1ContentSelection data={step1} onChange={updateStep1} />
              )}
              {currentStep === 2 && (
                <Step2QuestionComposition
                  data={step2}
                  onTotalQChange={setTotalQuestions}
                  onTotalMarksChange={setTotalMarks}
                  onTypeConfig={updateTypeConfig}
                />
              )}
              {currentStep === 3 && (
                <Step3DifficultyDistribution
                  step2Data={step2}
                  data={step3}
                  onUpdate={updateStep3}
                  chapters={activeChapters}
                />
              )}
              {currentStep === 4 && (
                <Step4Review step1={step1} step2={step2} step3={step3} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Validation banner (Step 2 only) */}
        {bannerMsg && <ValidationBanner message={bannerMsg} />}

        {/* ── Action Bar ── */}
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow)', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Reset current step */}
          <button onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', padding: '9px 18px', color: 'var(--text-3)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)' }}
            title="Clears only this step's data">
            <RotateCcw size={14} /> Reset Step
          </button>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            {/* Back */}
            {currentStep > 1 && (
              <button onClick={handleBack}
                style={{ backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', padding: '9px 18px', color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
                Back
              </button>
            )}

            {/* Next / Generate */}
            <motion.button
              id={isFinalStep ? 'generateExamBtn' : 'nextStepBtn'}
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: isFinalStep
                  ? 'linear-gradient(135deg,#10B981,#059669)'
                  : 'linear-gradient(135deg,#0EA5E9,#0284C7)',
                border: 'none', borderRadius: '9px',
                padding: isFinalStep ? '11px 26px' : '9px 22px',
                color: '#fff',
                fontSize: isFinalStep ? '0.95rem' : '0.875rem',
                fontWeight: 700, cursor: 'pointer',
                boxShadow: isFinalStep ? '0 4px 18px rgba(16,185,129,0.35)' : '0 4px 14px rgba(14,165,233,0.3)',
                transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {isFinalStep
                ? <><FileCheck2 size={17} /> Generate Exam Paper</>
                : <>Next <ChevronRight size={16} /></>
              }
            </motion.button>
          </div>
        </div>
      </div>

      {showSuccess && <GenerateModal onClose={() => setShowSuccess(false)} />}
      <ToastContainer />
    </div>
  )
}
