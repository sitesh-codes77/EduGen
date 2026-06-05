import { create } from 'zustand'

const INITIAL_STEP1 = { book: '', grade: '', chapters: [] }

const INITIAL_STEP2 = {
  totalQuestions: '',
  totalMarks: '',
  duration: '',
  mcq:   { count: 0, marks: 1 },
  msq:   { count: 0, marks: 2 },
  numerical: { count: 0, marks: 4 },
  short: { count: 0, marks: 3 },
  long:  { count: 0, marks: 5 },
}

const INITIAL_STEP3 = {}

// Apply dark class to <html> immediately (SSR-safe)
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function distributeQuestionsAndMarks(tqStr, tmStr, currentState) {
  const tq = tqStr === '' ? 0 : Number(tqStr)
  const tm = tmStr === '' ? 0 : Number(tmStr)

  const defaultState = {
    mcq: { count: 0, marks: 1 },
    msq: { count: 0, marks: 2 },
    numerical: { count: 0, marks: 4 },
    short: { count: 0, marks: 3 },
    long: { count: 0, marks: 5 },
  }

  if (tq <= 0) return defaultState
  if (tm <= 0 || tq > tm) return { ...defaultState, mcq: { count: tq, marks: 1 } }

  const avg = Math.floor(tm / tq)
  const rem = tm % tq

  if (avg >= 20 || (avg === 20 && rem > 0)) {
    return { ...defaultState, long: { count: tq, marks: 20 } }
  }

  if (avg < 10 || (avg === 10 && rem === 0)) {
    if (rem === 0) {
      return { ...defaultState, mcq: { count: tq, marks: avg } }
    }
    return {
      ...defaultState,
      mcq: { count: tq - rem, marks: avg },
      msq: { count: rem, marks: avg + 1 },
    }
  }

  if (avg === 10 && rem > 0) {
    return {
      ...defaultState,
      mcq: { count: tq - rem, marks: 10 },
      numerical: { count: rem, marks: 11 },
    }
  }

  if (avg > 10 && avg < 20) {
    if (rem === 0) {
      return { ...defaultState, numerical: { count: tq, marks: avg } }
    }
    return {
      ...defaultState,
      numerical: { count: tq - rem, marks: avg },
      long: { count: rem, marks: avg + 1 },
    }
  }

  return defaultState
}

const useWizardStore = create((set, get) => ({
  // ── Theme ──────────────────────────────────────────────
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      applyTheme(next)
      return { isDark: next }
    }),

  // ── Wizard navigation ──────────────────────────────────
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),

  // ── Step data ──────────────────────────────────────────
  step1: { ...INITIAL_STEP1 },
  step2: { ...INITIAL_STEP2 },
  step3: { ...INITIAL_STEP3 },

  // ── Step 1 updater ─────────────────────────────────────
  updateStep1: (data) => set({ step1: data }),

  // ── Step 2 updater ─────────────────────────────────────
  setTotalQuestions: (val) =>
    set((state) => ({
      step2: {
        ...state.step2,
        totalQuestions: val,
        ...distributeQuestionsAndMarks(val, state.step2.totalMarks, state.step2),
      },
    })),

  setTotalMarks: (val) =>
    set((state) => ({
      step2: {
        ...state.step2,
        totalMarks: val,
        ...distributeQuestionsAndMarks(state.step2.totalQuestions, val, state.step2),
      }
    })),

  setDuration: (val) =>
    set((state) => ({
      step2: { ...state.step2, duration: val },
    })),

  updateTypeConfig: (typeKey, patch) =>
    set((state) => ({
      step2: {
        ...state.step2,
        [typeKey]: { ...state.step2[typeKey], ...patch },
      },
    })),

  // ── Step 3 updater ─────────────────────────────────────
  updateStep3: (data) => set({ step3: data }),

  updateChapterDifficulty: (chapter, typeKey, field, val) =>
    set((state) => {
      const prev = state.step3[chapter] || {}
      const prevType = prev[typeKey] || { easy: 0, medium: 0, hard: 0 }
      return {
        step3: {
          ...state.step3,
          [chapter]: {
            ...prev,
            [typeKey]: { ...prevType, [field]: val },
          },
        },
      }
    }),

  // ── Per-step reset (keeps currentStep, keeps other steps) ─
  resetCurrentStep: () => {
    const { currentStep } = get()
    if (currentStep === 1) set({ step1: { ...INITIAL_STEP1 } })
    if (currentStep === 2) set({ step2: { ...INITIAL_STEP2 } })
    if (currentStep === 3) set({ step3: { ...INITIAL_STEP3 } })
    // Step 4 has no editable data — nothing to clear
  },

  // ── Full reset (start over) ───────────────────────────
  resetAll: () =>
    set({
      currentStep: 1,
      step1: { ...INITIAL_STEP1 },
      step2: { ...INITIAL_STEP2 },
      step3: { ...INITIAL_STEP3 },
    }),
}))

// Initialise theme on module load
applyTheme(false)

export default useWizardStore
