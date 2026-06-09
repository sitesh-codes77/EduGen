import { create } from 'zustand'

const INITIAL_STEP1 = { book: '', grade: '', chapters: [] }

const INITIAL_STEP2 = {
  isAutoDistributed: true, // FLAG: True initially, turns false on manual edit
  totalQuestions: '',
  totalMarks: '',
  duration: '',
  mcq:       { count: 0, marks: 1 },
  msq:       { count: 0, marks: 2 },
  numerical: { count: 0, marks: 4 },
  short:     { count: 0, marks: 3 },
  long:      { count: 0, marks: 5 },
}

const INITIAL_STEP3 = {}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Pure math distribution - only runs if isAutoDistributed is true
function distributeQuestionsAndMarks(tqStr, tmStr) {
  const tq = tqStr === '' ? 0 : Number(tqStr)
  const tm = tmStr === '' ? 0 : Number(tmStr)

  const defaultState = {
    mcq:       { count: 0, marks: 1 },
    msq:       { count: 0, marks: 2 },
    numerical: { count: 0, marks: 4 },
    short:     { count: 0, marks: 3 },
    long:      { count: 0, marks: 5 },
  }

  if (tq <= 0 || tm <= 0) return defaultState

  if (tm % tq === 0) {
    return { ...defaultState, mcq: { count: tq, marks: Math.floor(tm / tq) } }
  }

  const baseMarks = Math.floor(tm / tq)
  if (baseMarks === 0) {
    return { ...defaultState, mcq: { count: tq, marks: 1 } }
  }

  const msqCount = tm - (tq * baseMarks)
  const mcqCount = tq - msqCount

  if (mcqCount > 0 && msqCount > 0) {
    return {
      ...defaultState,
      mcq: { count: mcqCount, marks: baseMarks },
      msq: { count: msqCount, marks: baseMarks + 1 }
    }
  }

  return { ...defaultState, mcq: { count: tq, marks: baseMarks } }
}

const useWizardStore = create((set, get) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      applyTheme(next)
      return { isDark: next }
    }),

  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),

  step1: { ...INITIAL_STEP1 },
  step2: { ...INITIAL_STEP2 },
  step3: { ...INITIAL_STEP3 },

  updateStep1: (data) => set({ step1: data }),

  // ── Step 2 updaters ────────────────────────────────────
  setTotalQuestions: (val) =>
    set((state) => {
      const shouldAuto = state.step2.isAutoDistributed; // Checks the flag
      return {
        step2: {
          ...state.step2,
          totalQuestions: val,
          ...(shouldAuto ? distributeQuestionsAndMarks(val, state.step2.totalMarks) : {}),
        },
      }
    }),

  setTotalMarks: (val) =>
    set((state) => {
      const shouldAuto = state.step2.isAutoDistributed; // Checks the flag
      return {
        step2: {
          ...state.step2,
          totalMarks: val,
          ...(shouldAuto ? distributeQuestionsAndMarks(state.step2.totalQuestions, val) : {}),
        }
      }
    }),

  setDuration: (val) =>
    set((state) => ({
      step2: { ...state.step2, duration: val },
    })),

  // THIS IS THE GATEKEEPER. If the user touches the +/-, this fires and locks the auto-calc.
  updateTypeConfig: (typeKey, patch) =>
    set((state) => ({
      step2: {
        ...state.step2,
        isAutoDistributed: false, // FLAG TURNS FALSE! Manual edits are now protected.
        [typeKey]: { ...state.step2[typeKey], ...patch },
      },
    })),

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

  resetCurrentStep: () => {
    const { currentStep } = get()
    if (currentStep === 1) set({ step1: { ...INITIAL_STEP1 } })
    if (currentStep === 2) set({ step2: { ...INITIAL_STEP2 } }) // Resets flag back to true
    if (currentStep === 3) set({ step3: { ...INITIAL_STEP3 } })
  },

  resetAll: () =>
    set({
      currentStep: 1,
      step1: { ...INITIAL_STEP1 },
      step2: { ...INITIAL_STEP2 },
      step3: { ...INITIAL_STEP3 },
    }),
}))

applyTheme(false)

export default useWizardStore