import { z } from 'zod'

// ── Step 1 Validation ───────────────────────────────────────
export const step1Schema = z.object({
  book: z.string().min(1, 'Please select a book before continuing.'),
  // grade: z.string().optional(),
  chapters: z.array(z.string()).optional(),
})

// ── Step 2 Validation ───────────────────────────────────────
export const step2Schema = z.object({
  totalQuestions: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num > 0
  }, { message: 'Total Number of Questions must be a positive number.' }),
  totalMarks: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num > 0
  }, { message: 'Total Marks for Paper must be a positive number.' }),
  mcq: z.object({ count: z.number().min(0), marks: z.number().min(1) }),
  msq: z.object({ count: z.number().min(0), marks: z.number().min(1) }),
  numerical: z.object({ count: z.number().min(0), marks: z.number().min(1) }),
  short: z.object({ count: z.number().min(0), marks: z.number().min(1) }),
  long: z.object({ count: z.number().min(0), marks: z.number().min(1) }),
}).superRefine((data, ctx) => {
  const targetMarks = Number(data.totalMarks)
  const mcqMarks = (data.mcq?.count ?? 0) * (data.mcq?.marks ?? 1)
  const msqMarks = (data.msq?.count ?? 0) * (data.msq?.marks ?? 2)
  const numericalMarks = (data.numerical?.count ?? 0) * (data.numerical?.marks ?? 4)
  const shortMarks = (data.short?.count ?? 0) * (data.short?.marks ?? 3)
  const longMarks = (data.long?.count ?? 0) * (data.long?.marks ?? 5)
  const allocated = mcqMarks + msqMarks + numericalMarks + shortMarks + longMarks

  if (allocated !== targetMarks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Total allocated marks must equal exactly ${targetMarks}. Currently allocated: ${allocated}`,
      path: ['totalMarks'],
    })
  }
})

// ── Step 3 Validation ───────────────────────────────────────
export const validateStep3 = (step3Data, step2Data, activeChapters) => {
  const activeTypes = ['mcq', 'msq', 'numerical', 'short', 'long'].filter(
    (key) => (step2Data[key]?.count ?? 0) > 0
  )
  const chapters = activeChapters.length > 0 ? activeChapters : ['All Chapters']

  const schema = z.record(z.any()).superRefine((val, ctx) => {
    for (const typeKey of activeTypes) {
      const typeConfig = step2Data[typeKey] || {}
      const totalCount = typeConfig.count ?? 0
      const alloc = typeConfig.chapterAlloc || {}

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        
        // Match the same strict chapter target logic
        let chapterTarget = alloc[chapter];
        if (chapterTarget === undefined) {
            const perCh = Math.floor(totalCount / chapters.length);
            const rem = totalCount % chapters.length;
            chapterTarget = (i === 0) ? perCh + rem : perCh;
        }

        if (chapterTarget === 0) continue; // Skip if this chapter doesn't need this type

        const row = (val[chapter] || {})[typeKey] || { easy: 0, medium: 0, hard: 0 }
        const distributedSum = (Number(row.easy) || 0) + (Number(row.medium) || 0) + (Number(row.hard) || 0)

        // STRICT GATE: Blocks navigation if the chapter row doesn't match the specific target
        if (distributedSum !== chapterTarget) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Difficulty Mismatch in "${chapter}": You distributed ${distributedSum} for ${typeKey.toUpperCase()}, but the target is exactly ${chapterTarget}.`,
            path: [chapter, typeKey],
          })
        }
      }
    }
  })

  return schema.safeParse(step3Data)
}
