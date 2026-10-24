-- =============================================================================
-- Octopus Test Seeding Script
-- Seeds: 10 Users (2 Admin, 3 Helper, 5 Student) + Questions + 5 Tests/User (50 Bundles)
-- All test users have password: password123
-- =============================================================================

-- 1. USERS (10 test accounts)
INSERT INTO users (id, username, display_name, password_hash, role, active, year, discord_name, display_preference, created, updated)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin_alex', 'Αλέξανδρος Διαχειριστής', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'ADMIN', true, 2020, '@alex_adm', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'admin_eleni', 'Ελένη Διαχειρίστρια', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'ADMIN', true, 2021, '@eleni_adm', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'helper_nikos', 'Νίκος Βοηθός', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'HELPER', true, 2022, '@nikos_h', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000004', 'helper_maria', 'Μαρία Βοηθός', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'HELPER', true, 2022, '@maria_h', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000005', 'helper_kostas', 'Κώστας Βοηθός', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'HELPER', true, 2023, '@kostas_h', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000006', 'student_giannis', 'Γιάννης Παπαδόπουλος', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'STUDENT', true, 2024, '@giannis_p', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000007', 'student_dimitra', 'Δήμητρα Γεωργίου', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'STUDENT', true, 2024, '@dimitra_g', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000008', 'student_petros', 'Πέτρος Ιωάννου', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'STUDENT', true, 2025, '@petros_i', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000009', 'student_sofia', 'Σοφία Βασιλείου', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'STUDENT', true, 2025, '@sofia_v', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000010', 'student_giorgos', 'Γιώργος Νικολάου', '$2a$10$ENRiVs9JNskmiPKE/uUn2OpuF9D2E54a6F1DF8Vmr/9AbGl/lGmB.', 'STUDENT', true, 2023, '@giorgos_n', 'DISPLAY_NAME', NOW() - INTERVAL '10 days', NOW())
ON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role, display_name = EXCLUDED.display_name;

-- 2. QUESTIONS & ANSWERS (5 questions per 4 courses = 20 questions, 80 answers)
INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2001, 'Ποιο είναι το όριο του sin(x)/x καθώς το x τείνει στο 0;', 1101, '00000000-0000-0000-0000-000000000002', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5001, 2001, '1', true),
  (5002, 2001, '0', false),
  (5003, 2001, 'Άπειρο', false),
  (5004, 2001, 'Δεν υπάρχει', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2002, 'Ποια είναι η παράγωγος του e^(2x);', 1101, '00000000-0000-0000-0000-000000000003', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5005, 2002, '2*e^(2x)', true),
  (5006, 2002, 'e^(2x)', false),
  (5007, 2002, '2x*e^(2x)', false),
  (5008, 2002, 'e^(x)', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2003, 'Ποιο είναι το ολοκλήρωμα ∫(2x + 3)dx;', 1101, '00000000-0000-0000-0000-000000000004', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5009, 2003, 'x^2 + 3x + C', true),
  (5010, 2003, '2x^2 + 3x + C', false),
  (5011, 2003, 'x^2 + C', false),
  (5012, 2003, '2x + C', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2004, 'Ποιος πίνακας ονομάζεται μοναδιαίος;', 1101, '00000000-0000-0000-0000-000000000005', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5013, 2004, 'Ο τετραγωνικός με 1 στην κύρια διαγώνιο και 0 αλλού', true),
  (5014, 2004, 'Ο πίνακας που έχει όλα τα στοιχεία 1', false),
  (5015, 2004, 'Ο μηδενικός πίνακας', false),
  (5016, 2004, 'Ο ανάστροφος πίνακας', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2005, 'Τι εκφράζει η ορίζουσα ενός 2x2 πίνακα γεωμετρικά;', 1101, '00000000-0000-0000-0000-000000000001', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5017, 2005, 'Το προσανατολισμένο εμβαδόν του παραλληλογράμμου', true),
  (5018, 2005, 'Το μήκος της διαγωνίου', false),
  (5019, 2005, 'Την περίμετρο', false),
  (5020, 2005, 'Τον όγκο', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2006, 'Ποιος είναι ο ρόλος της εντολής break σε ένα switch block στη C;', 1102, '00000000-0000-0000-0000-000000000003', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5021, 2006, 'Τερματίζει την εκτέλεση του switch και βγαίνει από αυτό', true),
  (5022, 2006, 'Επανεκκινεί το πρόγραμμα', false),
  (5023, 2006, 'Πηδάει στο επόμενο case αυτόματα', false),
  (5024, 2006, 'Κάνει free τη μνήμη', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2007, 'Ποιος τελεστής επιστρέφει τη διεύθυνση μνήμης μιας μεταβλητής στη C;', 1102, '00000000-0000-0000-0000-000000000004', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5025, 2007, '&', true),
  (5026, 2007, '*', false),
  (5027, 2007, '->', false),
  (5028, 2007, '%', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2008, 'Ποιο είναι το αποτέλεσμα της πράξης 7 % 3 στη C;', 1102, '00000000-0000-0000-0000-000000000005', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5029, 2008, '1', true),
  (5030, 2008, '2', false),
  (5031, 2008, '2.33', false),
  (5032, 2008, '0', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2009, 'Ποια συνάρτηση της C δεσμεύει δυναμικά μνήμη στο heap;', 1102, '00000000-0000-0000-0000-000000000001', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5033, 2009, 'malloc()', true),
  (5034, 2009, 'alloc()', false),
  (5035, 2009, 'new()', false),
  (5036, 2009, 'create()', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2010, 'Ποιος είναι ο σωστός τρόπος δήλωσης πίνακα 10 ακεραίων στη C;', 1102, '00000000-0000-0000-0000-000000000002', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5037, 2010, 'int arr[10];', true),
  (5038, 2010, 'array int arr[10];', false),
  (5039, 2010, 'int arr = new int[10];', false),
  (5040, 2010, 'arr[10] of int;', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2011, 'Πόσα bits αντιστοιχούν σε 1 byte;', 1103, '00000000-0000-0000-0000-000000000004', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5041, 2011, '8', true),
  (5042, 2011, '4', false),
  (5043, 2011, '16', false),
  (5044, 2011, '32', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2012, 'Ποιο είναι το δυαδικό ισοδύναμο του δεκαδικού αριθμού 13;', 1103, '00000000-0000-0000-0000-000000000005', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5045, 2012, '1101', true),
  (5046, 2012, '1011', false),
  (5047, 2012, '1110', false),
  (5048, 2012, '1001', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2013, 'Τι σημαίνει το ακρωνύμιο CPU;', 1103, '00000000-0000-0000-0000-000000000001', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5049, 2013, 'Central Processing Unit', true),
  (5050, 2013, 'Computer Personal Unit', false),
  (5051, 2013, 'Central Power Unit', false),
  (5052, 2013, 'Core Processing Utility', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2014, 'Ποιο είναι το βασικό χαρακτηριστικό της κύριας μνήμης (RAM);', 1103, '00000000-0000-0000-0000-000000000002', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5053, 2014, 'Είναι πτητική (χάνει τα δεδομένα όταν κλείνει το ρεύμα)', true),
  (5054, 2014, 'Διατηρεί μόνιμα τα δεδομένα', false),
  (5055, 2014, 'Είναι πιο αργή από τον σκληρό δίσκο', false),
  (5056, 2014, 'Είναι μόνο για ανάγνωση', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2015, 'Ποια λογική πύλη δίνει έξοδο 1 μόνο όταν όλες οι είσοδοι είναι 1;', 1103, '00000000-0000-0000-0000-000000000003', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5057, 2015, 'AND', true),
  (5058, 2015, 'OR', false),
  (5059, 2015, 'XOR', false),
  (5060, 2015, 'NAND', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2016, 'Ποιος πυλώνας του OOP επιτρέπει σε μια υποκλάση να αποκτά ιδιότητες της υπερκλάσης;', 1205, '00000000-0000-0000-0000-000000000001', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5061, 2016, 'Κληρονομικότητα (Inheritance)', true),
  (5062, 2016, 'Πολυμορφισμός', false),
  (5063, 2016, 'Ενθυλάκωση', false),
  (5064, 2016, 'Αφαίρεση', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2017, 'Τι είναι ο Constructor (Κατασκευαστής) μιας κλάσης;', 1205, '00000000-0000-0000-0000-000000000002', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5065, 2017, 'Ειδική μέθοδος που καλείται αυτόματα κατά τη δημιουργία ενός αντικειμένου', true),
  (5066, 2017, 'Μέθοδος που διαγράφει το αντικείμενο', false),
  (5067, 2017, 'Μια στατική μεταβλητή', false),
  (5068, 2017, 'Μια διεπαφή (interface)', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2018, 'Ποια λέξη-κλειδί χρησιμοποιεί η Java για να υλοποιήσει ένα interface;', 1205, '00000000-0000-0000-0000-000000000003', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5069, 2018, 'implements', true),
  (5070, 2018, 'extends', false),
  (5071, 2018, 'inherits', false),
  (5072, 2018, 'uses', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2019, 'Τι επιτυγχάνεται με την ενθυλάκωση (Encapsulation);', 1205, '00000000-0000-0000-0000-000000000004', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5073, 2019, 'Απόκρυψη των εσωτερικών δεδομένων και πρόσβαση μέσω μεθόδων', true),
  (5074, 2019, 'Ταχύτερη εκτέλεση του κώδικα', false),
  (5075, 2019, 'Απεριόριστη πρόσβαση σε όλα τα πεδία', false),
  (5076, 2019, 'Αυτόματη μεταγλώττιση', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

INSERT INTO questions (id, title, course_id, created_by, is_active, created, updated)
VALUES (2020, 'Ποια είναι η διαφορά των private πεδίων από τα public;', 1205, '00000000-0000-0000-0000-000000000005', true, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, course_id = EXCLUDED.course_id, created_by = EXCLUDED.created_by;

INSERT INTO answers (id, question_id, title, is_correct)
VALUES
  (5077, 2020, 'Τα private είναι προσβάσιμα μόνο μέσα από την ίδια την κλάση', true),
  (5078, 2020, 'Τα private είναι προσβάσιμα από παντού', false),
  (5079, 2020, 'Τα private καταλαμβάνουν λιγότερη μνήμη', false),
  (5080, 2020, 'Δεν υπάρχει διαφορά', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_correct = EXCLUDED.is_correct;

-- 3. BUNDLES (5 completed tests per user across courses)
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1001, '00000000-0000-0000-0000-000000000001', 5, 90, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1002, '00000000-0000-0000-0000-000000000001', 4, 113, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1003, '00000000-0000-0000-0000-000000000001', 5, 136, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1004, '00000000-0000-0000-0000-000000000001', 4, 159, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1005, '00000000-0000-0000-0000-000000000001', 5, 182, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1006, '00000000-0000-0000-0000-000000000002', 4, 107, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1007, '00000000-0000-0000-0000-000000000002', 5, 130, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1008, '00000000-0000-0000-0000-000000000002', 4, 153, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1009, '00000000-0000-0000-0000-000000000002', 4, 176, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1010, '00000000-0000-0000-0000-000000000002', 5, 199, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1011, '00000000-0000-0000-0000-000000000003', 5, 124, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1012, '00000000-0000-0000-0000-000000000003', 4, 147, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1013, '00000000-0000-0000-0000-000000000003', 4, 170, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1014, '00000000-0000-0000-0000-000000000003', 3, 193, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1015, '00000000-0000-0000-0000-000000000003', 4, 216, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1016, '00000000-0000-0000-0000-000000000004', 4, 141, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1017, '00000000-0000-0000-0000-000000000004', 3, 164, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1018, '00000000-0000-0000-0000-000000000004', 5, 187, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1019, '00000000-0000-0000-0000-000000000004', 4, 210, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1020, '00000000-0000-0000-0000-000000000004', 4, 233, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1021, '00000000-0000-0000-0000-000000000005', 3, 158, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1022, '00000000-0000-0000-0000-000000000005', 4, 181, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1023, '00000000-0000-0000-0000-000000000005', 4, 204, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1024, '00000000-0000-0000-0000-000000000005', 4, 227, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1025, '00000000-0000-0000-0000-000000000005', 3, 250, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1026, '00000000-0000-0000-0000-000000000006', 5, 175, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1027, '00000000-0000-0000-0000-000000000006', 5, 198, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1028, '00000000-0000-0000-0000-000000000006', 4, 221, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1029, '00000000-0000-0000-0000-000000000006', 5, 244, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1030, '00000000-0000-0000-0000-000000000006', 5, 267, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1031, '00000000-0000-0000-0000-000000000007', 4, 192, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1032, '00000000-0000-0000-0000-000000000007', 4, 215, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1033, '00000000-0000-0000-0000-000000000007', 3, 238, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1034, '00000000-0000-0000-0000-000000000007', 4, 261, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1035, '00000000-0000-0000-0000-000000000007', 5, 104, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1036, '00000000-0000-0000-0000-000000000008', 3, 209, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1037, '00000000-0000-0000-0000-000000000008', 3, 232, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1038, '00000000-0000-0000-0000-000000000008', 4, 255, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1039, '00000000-0000-0000-0000-000000000008', 2, 98, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1040, '00000000-0000-0000-0000-000000000008', 4, 121, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1041, '00000000-0000-0000-0000-000000000009', 4, 226, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1042, '00000000-0000-0000-0000-000000000009', 5, 249, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1043, '00000000-0000-0000-0000-000000000009', 4, 92, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1044, '00000000-0000-0000-0000-000000000009', 4, 115, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1045, '00000000-0000-0000-0000-000000000009', 3, 138, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1046, '00000000-0000-0000-0000-000000000010', 2, 243, 1, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1047, '00000000-0000-0000-0000-000000000010', 3, 266, 2, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1048, '00000000-0000-0000-0000-000000000010', 3, 109, 3, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1049, '00000000-0000-0000-0000-000000000010', 4, 132, 4, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;
INSERT INTO bundles (id, created_by, score, time_for_completion, set_num, created)
VALUES (1050, '00000000-0000-0000-0000-000000000010', 2, 155, 5, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, time_for_completion = EXCLUDED.time_for_completion;

-- 4. BUNDLE ANSWERS (Links completed tests to selected answers)
INSERT INTO bundle_answers (bundle_id, answer_id)
VALUES
  (1001, 5001),
  (1001, 5005),
  (1001, 5009),
  (1001, 5013),
  (1001, 5017),
  (1002, 5021),
  (1002, 5025),
  (1002, 5029),
  (1002, 5033),
  (1002, 5038),
  (1003, 5041),
  (1003, 5045),
  (1003, 5049),
  (1003, 5053),
  (1003, 5057),
  (1004, 5061),
  (1004, 5065),
  (1004, 5069),
  (1004, 5073),
  (1004, 5078),
  (1005, 5001),
  (1005, 5005),
  (1005, 5009),
  (1005, 5013),
  (1005, 5017),
  (1006, 5001),
  (1006, 5005),
  (1006, 5009),
  (1006, 5013),
  (1006, 5018),
  (1007, 5021),
  (1007, 5025),
  (1007, 5029),
  (1007, 5033),
  (1007, 5037),
  (1008, 5041),
  (1008, 5045),
  (1008, 5049),
  (1008, 5053),
  (1008, 5058),
  (1009, 5061),
  (1009, 5065),
  (1009, 5069),
  (1009, 5073),
  (1009, 5078),
  (1010, 5001),
  (1010, 5005),
  (1010, 5009),
  (1010, 5013),
  (1010, 5017),
  (1011, 5001),
  (1011, 5005),
  (1011, 5009),
  (1011, 5013),
  (1011, 5017),
  (1012, 5021),
  (1012, 5025),
  (1012, 5029),
  (1012, 5033),
  (1012, 5038),
  (1013, 5041),
  (1013, 5045),
  (1013, 5049),
  (1013, 5053),
  (1013, 5058),
  (1014, 5061),
  (1014, 5065),
  (1014, 5069),
  (1014, 5074),
  (1014, 5078),
  (1015, 5001),
  (1015, 5005),
  (1015, 5009),
  (1015, 5013),
  (1015, 5018),
  (1016, 5001),
  (1016, 5005),
  (1016, 5009),
  (1016, 5013),
  (1016, 5018),
  (1017, 5021),
  (1017, 5025),
  (1017, 5029),
  (1017, 5034),
  (1017, 5038),
  (1018, 5041),
  (1018, 5045),
  (1018, 5049),
  (1018, 5053),
  (1018, 5057),
  (1019, 5061),
  (1019, 5065),
  (1019, 5069),
  (1019, 5073),
  (1019, 5078),
  (1020, 5001),
  (1020, 5005),
  (1020, 5009),
  (1020, 5013),
  (1020, 5018),
  (1021, 5001),
  (1021, 5005),
  (1021, 5009),
  (1021, 5014),
  (1021, 5018),
  (1022, 5021),
  (1022, 5025),
  (1022, 5029),
  (1022, 5033),
  (1022, 5038),
  (1023, 5041),
  (1023, 5045),
  (1023, 5049),
  (1023, 5053),
  (1023, 5058),
  (1024, 5061),
  (1024, 5065),
  (1024, 5069),
  (1024, 5073),
  (1024, 5078),
  (1025, 5001),
  (1025, 5005),
  (1025, 5009),
  (1025, 5014),
  (1025, 5018),
  (1026, 5001),
  (1026, 5005),
  (1026, 5009),
  (1026, 5013),
  (1026, 5017),
  (1027, 5021),
  (1027, 5025),
  (1027, 5029),
  (1027, 5033),
  (1027, 5037),
  (1028, 5041),
  (1028, 5045),
  (1028, 5049),
  (1028, 5053),
  (1028, 5058),
  (1029, 5061),
  (1029, 5065),
  (1029, 5069),
  (1029, 5073),
  (1029, 5077),
  (1030, 5001),
  (1030, 5005),
  (1030, 5009),
  (1030, 5013),
  (1030, 5017),
  (1031, 5001),
  (1031, 5005),
  (1031, 5009),
  (1031, 5013),
  (1031, 5018),
  (1032, 5021),
  (1032, 5025),
  (1032, 5029),
  (1032, 5033),
  (1032, 5038),
  (1033, 5041),
  (1033, 5045),
  (1033, 5049),
  (1033, 5054),
  (1033, 5058),
  (1034, 5061),
  (1034, 5065),
  (1034, 5069),
  (1034, 5073),
  (1034, 5078),
  (1035, 5001),
  (1035, 5005),
  (1035, 5009),
  (1035, 5013),
  (1035, 5017),
  (1036, 5001),
  (1036, 5005),
  (1036, 5009),
  (1036, 5014),
  (1036, 5018),
  (1037, 5021),
  (1037, 5025),
  (1037, 5029),
  (1037, 5034),
  (1037, 5038),
  (1038, 5041),
  (1038, 5045),
  (1038, 5049),
  (1038, 5053),
  (1038, 5058),
  (1039, 5061),
  (1039, 5065),
  (1039, 5070),
  (1039, 5074),
  (1039, 5078),
  (1040, 5001),
  (1040, 5005),
  (1040, 5009),
  (1040, 5013),
  (1040, 5018),
  (1041, 5001),
  (1041, 5005),
  (1041, 5009),
  (1041, 5013),
  (1041, 5018),
  (1042, 5021),
  (1042, 5025),
  (1042, 5029),
  (1042, 5033),
  (1042, 5037),
  (1043, 5041),
  (1043, 5045),
  (1043, 5049),
  (1043, 5053),
  (1043, 5058),
  (1044, 5061),
  (1044, 5065),
  (1044, 5069),
  (1044, 5073),
  (1044, 5078),
  (1045, 5001),
  (1045, 5005),
  (1045, 5009),
  (1045, 5014),
  (1045, 5018),
  (1046, 5001),
  (1046, 5005),
  (1046, 5010),
  (1046, 5014),
  (1046, 5018),
  (1047, 5021),
  (1047, 5025),
  (1047, 5029),
  (1047, 5034),
  (1047, 5038),
  (1048, 5041),
  (1048, 5045),
  (1048, 5049),
  (1048, 5054),
  (1048, 5058),
  (1049, 5061),
  (1049, 5065),
  (1049, 5069),
  (1049, 5073),
  (1049, 5078),
  (1050, 5001),
  (1050, 5005),
  (1050, 5010),
  (1050, 5014),
  (1050, 5018)
ON CONFLICT DO NOTHING;

-- 5. SYNC SEQUENCES
SELECT setval('questions_seq', (SELECT COALESCE(MAX(id), 1) FROM questions));
SELECT setval('answers_seq', (SELECT COALESCE(MAX(id), 1) FROM answers));
SELECT setval('bundles_seq', (SELECT COALESCE(MAX(id), 1) FROM bundles));
