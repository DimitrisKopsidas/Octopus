export const mockCourses = [
  { id: 1, name: 'Μαθηματική Ανάλυση Ι', semester: 1 },
  { id: 2, name: 'Δομές Δεδομένων', semester: 3 },
  { id: 3, name: 'Αρχιτεκτονική Υπολογιστών', semester: 4 },
]

export const mockQuestions = [
  // Course 1 Questions
  {
    id: 101,
    courseId: 1,
    title: 'Ποιο είναι το όριο του sin(x)/x καθώς το x τείνει στο 0;',
    answers: [
      { id: 1001, title: '0', isCorrect: false },
      { id: 1002, title: '1', isCorrect: true },
      { id: 1003, title: 'Άπειρο', isCorrect: false },
      { id: 1004, title: 'Δεν ορίζεται', isCorrect: false },
    ],
  },
  {
    id: 102,
    courseId: 1,
    title: 'Ποια είναι η παράγωγος της συνάρτησης f(x) = e^(2x);',
    answers: [
      { id: 1005, title: 'e^(2x)', isCorrect: false },
      { id: 1006, title: '2 * e^(2x)', isCorrect: true },
      { id: 1007, title: '2x * e^(2x-1)', isCorrect: false },
      { id: 1008, title: '0.5 * e^(2x)', isCorrect: false },
    ],
  },
  {
    id: 103,
    courseId: 1,
    title: 'Ποιο από τα παρακάτω ολοκληρώματα εκφράζει το εμβαδόν κάτω από την f(x) = x^2 από 0 έως 1;',
    answers: [
      { id: 1009, title: '1/3', isCorrect: true },
      { id: 1010, title: '1/2', isCorrect: false },
      { id: 1011, title: '1', isCorrect: false },
      { id: 1012, title: '2/3', isCorrect: false },
    ],
  },
  
  // Course 3 Questions
  {
    id: 301,
    courseId: 3,
    title: 'Ποιο από τα παρακάτω είναι υπεύθυνο για την αποκωδικοποίηση των εντολών στον επεξεργαστή;',
    answers: [
      { id: 3001, title: 'Η Αριθμητική Λογική Μονάδα (ALU)', isCorrect: false },
      { id: 3002, title: 'Η Μονάδα Ελέγχου (Control Unit)', isCorrect: true },
      { id: 3003, title: 'Οι καταχωρητές (Registers)', isCorrect: false },
      { id: 3004, title: 'Η κρυφή μνήμη (Cache)', isCorrect: false },
    ],
  },
  {
    id: 302,
    courseId: 3,
    title: 'Ποιο επίπεδο της κρυφής μνήμης (Cache) είναι συνήθως το πιο γρήγορο και το πιο μικρό σε χωρητικότητα;',
    answers: [
      { id: 3005, title: 'L1', isCorrect: true },
      { id: 3006, title: 'L2', isCorrect: false },
      { id: 3007, title: 'L3', isCorrect: false },
      { id: 3008, title: 'RAM', isCorrect: false },
    ],
  }
]

// Generate exactly 115 questions dynamically for Course ID 2 (Δομές Δεδομένων)
// to test the 25-question split logic (25/25/25/25/15)
for (let i = 1; i <= 115; i++) {
  const isCorrectIdx = i % 4 // 0, 1, 2, or 3
  
  mockQuestions.push({
    id: 200 + i,
    courseId: 2,
    title: `[Ερώτηση ${i}] Ποια είναι η χρονική πολυπλοκότητα χειρότερης περίπτωσης (worst-case complexity) για την πράξη αναζήτησης σε ένα ${
      i % 2 === 0 ? 'Ταξινομημένο Πίνακα (Sorted Array)' : 'Δυαδικό Δέντρο Αναζήτησης (Unbalanced BST)'
    };`,
    answers: [
      { id: 2000 + i * 10 + 1, title: 'O(1) - Σταθερός χρόνος', isCorrect: isCorrectIdx === 0 },
      { id: 2000 + i * 10 + 2, title: 'O(log n) - Λογαριθμικός χρόνος', isCorrect: isCorrectIdx === 1 },
      { id: 2000 + i * 10 + 3, title: 'O(n) - Γραμμικός χρόνος', isCorrect: isCorrectIdx === 2 },
      { id: 2000 + i * 10 + 4, title: 'O(n^2) - Τετραγωνικός χρόνος', isCorrect: isCorrectIdx === 3 },
    ],
  })
}

export default { mockCourses, mockQuestions }
