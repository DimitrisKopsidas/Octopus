// Scoring helpers shared by Test, Results and ReviewCard.
//
// A question is "multiple correct" when more than one of its answers has
// isCorrect === true. The student answer for a question is stored as either a
// single answerId (single-correct) or an array of answerIds (multiple-correct).
// These helpers normalise both shapes so callers don't have to care.

// Ids of every correct answer for a question.
export function getCorrectAnswerIds(question) {
  return question.answers.filter((a) => a.isCorrect).map((a) => a.id)
}

// True when the question expects more than one correct answer.
export function isMultiAnswer(question) {
  return getCorrectAnswerIds(question).length > 1
}

// Normalise a stored answer (scalar id | array of ids | null) to an id array.
export function getChosenIds(chosen) {
  if (chosen == null) return []
  return Array.isArray(chosen) ? chosen : [chosen]
}

// All-or-nothing: the chosen set must match the correct set exactly —
// every correct answer picked, no incorrect answer picked.
export function isQuestionCorrect(question, chosen) {
  const correct = getCorrectAnswerIds(question)
  const picked = getChosenIds(chosen)
  if (correct.length !== picked.length) return false
  const pickedSet = new Set(picked)
  return correct.every((id) => pickedSet.has(id))
}

// Flatten the answers map into a single list of answer ids for bundle submit.
export function flattenAnswerIds(answers) {
  return Object.values(answers).flatMap((v) => (Array.isArray(v) ? v : [v]))
}
