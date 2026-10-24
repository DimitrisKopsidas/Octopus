// Generator script for scripts/seed-test-data.sql
const fs = require('fs');
const path = require('path');

const PASSWORD_HASH = '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.'; // 'password123'

const users = [
  // 2 Admins
  { id: '00000000-0000-0000-0000-000000000001', username: 'admin_alex', displayName: 'Αλέξανδρος Διαχειριστής', role: 'ADMIN', year: 2020, discord: '@alex_adm' },
  { id: '00000000-0000-0000-0000-000000000002', username: 'admin_eleni', displayName: 'Ελένη Διαχειρίστρια', role: 'ADMIN', year: 2021, discord: '@eleni_adm' },
  // 3 Helpers
  { id: '00000000-0000-0000-0000-000000000003', username: 'helper_nikos', displayName: 'Νίκος Βοηθός', role: 'HELPER', year: 2022, discord: '@nikos_h' },
  { id: '00000000-0000-0000-0000-000000000004', username: 'helper_maria', displayName: 'Μαρία Βοηθός', role: 'HELPER', year: 2022, discord: '@maria_h' },
  { id: '00000000-0000-0000-0000-000000000005', username: 'helper_kostas', displayName: 'Κώστας Βοηθός', role: 'HELPER', year: 2023, discord: '@kostas_h' },
  // 5 Students
  { id: '00000000-0000-0000-0000-000000000006', username: 'student_giannis', displayName: 'Γιάννης Παπαδόπουλος', role: 'STUDENT', year: 2024, discord: '@giannis_p' },
  { id: '00000000-0000-0000-0000-000000000007', username: 'student_dimitra', displayName: 'Δήμητρα Γεωργίου', role: 'STUDENT', year: 2024, discord: '@dimitra_g' },
  { id: '00000000-0000-0000-0000-000000000008', username: 'student_petros', displayName: 'Πέτρος Ιωάννου', role: 'STUDENT', year: 2025, discord: '@petros_i' },
  { id: '00000000-0000-0000-0000-000000000009', username: 'student_sofia', displayName: 'Σοφία Βασιλείου', role: 'STUDENT', year: 2025, discord: '@sofia_v' },
  { id: '00000000-0000-0000-0000-000000000010', username: 'student_giorgos', displayName: 'Γιώργος Νικολάου', role: 'STUDENT', year: 2023, discord: '@giorgos_n' }
];

const courses = [
  { id: 1101, name: 'Μαθηματικά Ι' },
  { id: 1102, name: 'Δομημένος Προγραμματισμός' },
  { id: 1103, name: 'Εισαγωγή στην Επιστήμη των Υπολογιστών' },
  { id: 1205, name: 'Αντικειμενοστρεφής Προγραμματισμός' }
];

const questionTemplates = {
  1101: [
    { title: 'Ποιο είναι το όριο του sin(x)/x καθώς το x τείνει στο 0;', correct: '1', wrongs: ['0', 'Άπειρο', 'Δεν υπάρχει'] },
    { title: 'Ποια είναι η παράγωγος του e^(2x);', correct: '2*e^(2x)', wrongs: ['e^(2x)', '2x*e^(2x)', 'e^(x)'] },
    { title: 'Ποιο είναι το ολοκλήρωμα ∫(2x + 3)dx;', correct: 'x^2 + 3x + C', wrongs: ['2x^2 + 3x + C', 'x^2 + C', '2x + C'] },
    { title: 'Ποιος πίνακας ονομάζεται μοναδιαίος;', correct: 'Ο τετραγωνικός με 1 στην κύρια διαγώνιο και 0 αλλού', wrongs: ['Ο πίνακας που έχει όλα τα στοιχεία 1', 'Ο μηδενικός πίνακας', 'Ο ανάστροφος πίνακας'] },
    { title: 'Τι εκφράζει η ορίζουσα ενός 2x2 πίνακα γεωμετρικά;', correct: 'Το προσανατολισμένο εμβαδόν του παραλληλογράμμου', wrongs: ['Το μήκος της διαγωνίου', 'Την περίμετρο', 'Τον όγκο'] }
  ],
  1102: [
    { title: 'Ποιος είναι ο ρόλος της εντολής break σε ένα switch block στη C;', correct: 'Τερματίζει την εκτέλεση του switch και βγαίνει από αυτό', wrongs: ['Επανεκκινεί το πρόγραμμα', 'Πηδάει στο επόμενο case αυτόματα', 'Κάνει free τη μνήμη'] },
    { title: 'Ποιος τελεστής επιστρέφει τη διεύθυνση μνήμης μιας μεταβλητής στη C;', correct: '&', wrongs: ['*', '->', '%'] },
    { title: 'Ποιο είναι το αποτέλεσμα της πράξης 7 % 3 στη C;', correct: '1', wrongs: ['2', '2.33', '0'] },
    { title: 'Ποια συνάρτηση της C δεσμεύει δυναμικά μνήμη στο heap;', correct: 'malloc()', wrongs: ['alloc()', 'new()', 'create()'] },
    { title: 'Ποιος είναι ο σωστός τρόπος δήλωσης πίνακα 10 ακεραίων στη C;', correct: 'int arr[10];', wrongs: ['array int arr[10];', 'int arr = new int[10];', 'arr[10] of int;'] }
  ],
  1103: [
    { title: 'Πόσα bits αντιστοιχούν σε 1 byte;', correct: '8', wrongs: ['4', '16', '32'] },
    { title: 'Ποιο είναι το δυαδικό ισοδύναμο του δεκαδικού αριθμού 13;', correct: '1101', wrongs: ['1011', '1110', '1001'] },
    { title: 'Τι σημαίνει το ακρωνύμιο CPU;', correct: 'Central Processing Unit', wrongs: ['Computer Personal Unit', 'Central Power Unit', 'Core Processing Utility'] },
    { title: 'Ποιο είναι το βασικό χαρακτηριστικό της κύριας μνήμης (RAM);', correct: 'Είναι πτητική (χάνει τα δεδομένα όταν κλείνει το ρεύμα)', wrongs: ['Διατηρεί μόνιμα τα δεδομένα', 'Είναι πιο αργή από τον σκληρό δίσκο', 'Είναι μόνο για ανάγνωση'] },
    { title: 'Ποια λογική πύλη δίνει έξοδο 1 μόνο όταν όλες οι είσοδοι είναι 1;', correct: 'AND', wrongs: ['OR', 'XOR', 'NAND'] }
  ],
  1205: [
    { title: 'Ποιος πυλώνας του OOP επιτρέπει σε μια υποκλάση να αποκτά ιδιότητες της υπερκλάσης;', correct: 'Κληρονομικότητα (Inheritance)', wrongs: ['Πολυμορφισμός', 'Ενθυλάκωση', 'Αφαίρεση'] },
    { title: 'Τι είναι ο Constructor (Κατασκευαστής) μιας κλάσης;', correct: 'Ειδική μέθοδος που καλείται αυτόματα κατά τη δημιουργία ενός αντικειμένου', wrongs: ['Μέθοδος που διαγράφει το αντικείμενο', 'Μια στατική μεταβλητή', 'Μια διεπαφή (interface)'] },
    { title: 'Ποια λέξη-κλειδί χρησιμοποιεί η Java για να υλοποιήσει ένα interface;', correct: 'implements', wrongs: ['extends', 'inherits', 'uses'] },
    { title: 'Τι επιτυγχάνεται με την ενθυλάκωση (Encapsulation);', correct: 'Απόκρυψη των εσωτερικών δεδομένων και πρόσβαση μέσω μεθόδων', wrongs: ['Ταχύτερη εκτέλεση του κώδικα', 'Απεριόριστη πρόσβαση σε όλα τα πεδία', 'Αυτόματη μεταγλώττιση'] },
    { title: 'Ποια είναι η διαφορά των private πεδίων από τα public;', correct: 'Τα private είναι προσβάσιμα μόνο μέσα από την ίδια την κλάση', wrongs: ['Τα private είναι προσβάσιμα από παντού', 'Τα private καταλαμβάνουν λιγότερη μνήμη', 'Δεν υπάρχει διαφορά'] }
  ]
};

let sql = `-- =============================================================================\n`;
sql += `-- Octopus Test Seeding Script\n`;
sql += `-- Seeds: 10 Users (2 Admin, 3 Helper, 5 Student) + Questions + 5 Tests/User (50 Bundles)\n`;
sql += `-- All test users have password: password123\n`;
sql += `-- =============================================================================\n\n`;

// 1. Insert Users
sql += `-- 1. USERS (10 test accounts)\n`;
sql += `INSERT INTO users (id, username, display_name, password_hash, role, active, year, discord_name, display_preference, created, updated)\nVALUES\n`;

const userRows = users.map(u => 
  `  ('${u.id}', '${u.username}', '${u.displayName}', '${PASSWORD_HASH}', '${u.role}', true, ${u.year}, '${u.discord}', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW())`
);
sql += userRows.join(',\n') + `\nON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role, display_name = EXCLUDED.display_name;\n\n`;

// 2. Questions & Answers
sql += `-- 2. QUESTIONS & ANSWERS (5 questions per 4 courses = 20 questions, 80 answers)\n`;

const helpersAndAdmins = users.filter(u => u.role === 'ADMIN' || u.role === 'HELPER');

let qId = 2001;
let aId = 5001;
const courseQuestions = {}; // courseId -> array of { qId, correctAId, wrongAIds: [] }

for (const course of courses) {
  courseQuestions[course.id] = [];
  const templates = questionTemplates[course.id];
  for (let i = 0; i < templates.length; i++) {
    const tmpl = templates[i];
    const currQId = qId++;
    const authorUser = helpersAndAdmins[(i + course.id) % helpersAndAdmins.length].id;
    
    sql += `INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)\n`;
    sql += `VALUES (${currQId}, '${tmpl.title.replace(/'/g, "''")}', ${course.id}, '${authorUser}', true, NOW() - INTERVAL '8 days', NOW())\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;\n\n`;

    const correctAId = aId++;
    const wrongAIds = [aId++, aId++, aId++];

    sql += `INSERT INTO answers (id, question_id, title, is_correct)\nVALUES\n`;
    sql += `  (${correctAId}, ${currQId}, '${tmpl.correct.replace(/'/g, "''")}', true),\n`;
    sql += `  (${wrongAIds[0]}, ${currQId}, '${tmpl.wrongs[0].replace(/'/g, "''")}', false),\n`;
    sql += `  (${wrongAIds[1]}, ${currQId}, '${tmpl.wrongs[1].replace(/'/g, "''")}', false),\n`;
    sql += `  (${wrongAIds[2]}, ${currQId}, '${tmpl.wrongs[2].replace(/'/g, "''")}', false)\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;\n\n`;

    courseQuestions[course.id].push({
      qId: currQId,
      correctAId,
      wrongAIds
    });
  }
}

// 3. Bundles (5 tests per user = 50 tests)
sql += `-- 3. BUNDLES (5 completed tests per user across courses)\n`;

let bundleId = 1001;
const bundleAnswers = [];

// Predetermined distribution of scores for realism
const scoreProfiles = [
  [5, 4, 5, 4, 5], // Alex (Admin) - avg 4.6
  [4, 5, 4, 4, 5], // Eleni (Admin) - avg 4.4
  [5, 4, 4, 3, 4], // Nikos (Helper) - avg 4.0
  [4, 3, 5, 4, 4], // Maria (Helper) - avg 4.0
  [3, 4, 4, 4, 3], // Kostas (Helper) - avg 3.6
  [5, 5, 4, 5, 5], // Giannis (Student - Top Performer) - avg 4.8
  [4, 4, 3, 4, 5], // Dimitra (Student) - avg 4.0
  [3, 3, 4, 2, 4], // Petros (Student) - avg 3.2
  [4, 5, 4, 4, 3], // Sofia (Student) - avg 4.0
  [2, 3, 3, 4, 2]  // Giorgos (Student) - avg 2.8
];

const targetCoursesPerTest = [1101, 1102, 1103, 1205, 1101];

for (let uIdx = 0; uIdx < users.length; uIdx++) {
  const user = users[uIdx];
  const scores = scoreProfiles[uIdx];

  for (let tIdx = 0; tIdx < 5; tIdx++) {
    const bId = bundleId++;
    const courseId = targetCoursesPerTest[tIdx];
    const targetScore = scores[tIdx]; // out of 5
    const timeSec = 90 + ((uIdx * 17 + tIdx * 23) % 180);
    const daysAgo = 7 - tIdx;

    sql += `INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)\n`;
    sql += `VALUES (${bId}, '${user.id}', ${targetScore}, ${timeSec}, ${tIdx + 1}, NOW() - INTERVAL '${daysAgo} days')\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;\n`;

    // Pick answers for the 5 questions of this course
    const qList = courseQuestions[courseId];
    for (let qIdx = 0; qIdx < 5; qIdx++) {
      const q = qList[qIdx];
      // if within targetScore, pick correct answer; else pick first wrong answer
      const chosenAnswerId = (qIdx < targetScore) ? q.correctAId : q.wrongAIds[0];
      bundleAnswers.push(`  (${bId}, ${chosenAnswerId})`);
    }
  }
}

sql += `\n-- 4. BUNDLE ANSWERS (Links completed tests to selected answers)\n`;
sql += `INSERT INTO bundle_answers (bundle_id, answer_id)\nVALUES\n`;
sql += bundleAnswers.join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;

// 5. Update Sequences
sql += `-- 5. SYNC SEQUENCES\n`;
sql += `SELECT setval('questions_seq', (SELECT COALESCE(MAX(id), 1) FROM questions));\n`;
sql += `SELECT setval('answers_seq', (SELECT COALESCE(MAX(id), 1) FROM answers));\n`;
sql += `SELECT setval('bundles_seq', (SELECT COALESCE(MAX(id), 1) FROM bundles));\n`;

const outputPath = path.join(__dirname, 'seed-test-data.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated ${outputPath}`);
