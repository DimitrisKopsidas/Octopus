TRUNCATE TABLE bundle_answers, bundles, answers, questions, players, courses RESTART IDENTITY CASCADE;

INSERT INTO COURSES(ID,NAME,SEMESTER, QUESTION_SET_SIZE, DEFAULT_TIMER_MINUTES) VALUES
(1101, 'Μαθηματικά Ι', 1, 3, 15),
(1102, 'Δομημένος Προγραμματισμός', 1, 10, 15),
(1103, 'Εισαγωγή στην Επιστήμη των Υπολογιστών', 1, 10, 15),
(1104, 'Ηλεκτρονική Φυσική', 1, 10, 15),
(1105, 'Κυκλώματα Συνεχούς Ρεύματος', 1, 10, 15),
(1201, 'Μαθηματικά ΙΙ', 2, 10, 15),
(1202, 'Μετρήσεις και Κυκλώματα Εναλλασσόμενου Ρεύματος', 2, 10, 15),
(1203, 'Τεχνική Συγγραφή, Παρουσίαση και Ορολογία Ξένης Γλώσσας', 2, 10, 15),
(1204, 'Σχεδίαση Ψηφιακών Συστημάτων', 2, 10, 15),
(1205, 'Αντικειμενοστρεφής Προγραμματισμός', 2, 10, 15),

(1302, 'Μαθηματικά ΙΙI', 3, 10, 15),
(1303, 'Επεξεργασία Σήματος', 3, 10, 15),
(1301, 'Θεωρία Πιθανοτήτων και Στατιστική', 3, 10, 15),
(1305, 'Δομές Δεδομένων και Ανάλυση Αλγορίθμων', 3, 10, 15),
(1405, 'Γλώσσες και Τεχνολογίες Ιστού', 3, 10, 15),

(1304, 'Οργάνωση και Αρχιτεκτονική Υπολογιστικών Συστημάτων', 4, 10, 15),
(1401, 'Συστήματα Διαχείρισης Βάσεων Δεδομένων', 4, 10, 15),
(1402, 'Τηλεπικοινωνιακά Συστήματα', 4, 10, 15),
(1403, 'Εισαγωγή στα Λειτουργικά Συστήματα', 4, 10, 15),
(1404, 'Ηλεκτρονικά Κυκλώματα', 4, 10, 15),

(1501, 'Ασύρματες Επικοινωνίες', 5, 10, 15),
(1503, 'Σχεδίαση Λειτουργικών Συστημάτων', 5, 10, 15),
(1504, 'Ηλεκτρονικές Διατάξεις', 5, 10, 15),
(1505, 'Αλληλεπίδραση Ανθρώπου-Μηχανής', 5, 10, 15),
(1502, 'Μικροελεγκτές', 5, 10, 15),

(1601, 'Τεχνητή Νοημοσύνη', 6, 10, 15),
(1602, 'Ενσωματωμένα Συστήματα', 6, 10, 15),
(1611, 'Σύνθεση Ηλεκτρονικών Κυκλωμάτων', 6, 10, 15),
(1612, 'Κβαντική Υπολογιστική', 6, 10, 15),
(1613, 'Μεθοδολογίες Σχεδιασμού Μικροηλεκτρονικών Κυκλωμάτων', 6, 10, 15),
(1671, 'Μικροκυματική Τεχνολογία και Τηλεπισκόπηση', 6, 10, 15),
(1672, 'Οπτοηλεκτρονική και Οπτικές Επικοινωνίες', 6, 10, 15),
(1673, 'Συστήματα Μέσων Μαζικής Επικοινωνίας', 6, 10, 15),
(1641, 'Αριθμητικές Μέθοδοι', 6, 10, 15),
(1642, 'Προηγμένα Θέματα Αλληλεπίδρασης (Προγραμματισμός Κινητών Συσκευών)', 6, 10, 15),
(1643, 'Διοίκηση Έργων', 6, 10, 15),

(1701, 'Δίκτυα Υπολογιστών', 7, 10, 15),
(1702, 'Ηλεκτρονικά Ισχύος', 7, 10, 15),
(1711, 'Συστήματα Αυτομάτου Ελέγχου', 7, 10, 15),
(1712, 'Αισθητήρια και Επεξεργασία Μετρήσεων', 7, 10, 15),
(1713, 'Προγραμματιζόμενοι Λογικοί Ελεγκτές', 7, 10, 15),
(1714, 'Σχεδίαση Επαναπροσδιοριζόμενων Ψηφιακών Συστημάτων (FPGA)', 7, 10, 15),
(1771, 'Τεχνολογίες Ήχου και Εικόνας', 7, 10, 15),
(1741, 'Εισαγωγή στην Αναλυτική των Δεδομένων', 7, 10, 15),
(1742, 'Μηχανική Λογισμικού', 7, 10, 15),
(1743, 'Τεχνολογία Βάσεων Δεδομένων', 7, 10, 15),
(1744, 'Προηγμένες Αρχιτεκτονικές Υπολογιστών και Προγραμματισμός Παράλληλων Συστημάτων', 7, 10, 15),

(1801, 'Ασφάλεια Πληροφοριακών Συστημάτων', 8, 10, 15),
(1802, 'Αρχές και Μέθοδοι Μηχανικής Μάθησης', 8, 10, 15),
(1803, 'Διαδίκτυο των Πραγμάτων', 8, 10, 15),
(1811, 'Εφαρμογές Συστημάτων Αυτομάτου Ελέγχου', 8, 10, 15),
(1812, 'Μετατροπείς Ισχύος', 8, 10, 15),
(1838, 'Εφαρμογές Συστημάτων Ισχύος και ΑΠΕ', 8, 10, 15),
(1839, 'Ηλεκτροκίνηση και Ευφυή Δίκτυα', 8, 10, 15),
(1871, 'Ασύρματα Δίκτυα', 8, 10, 15),
(1872, 'Ειδικά Θέματα Δικτύων (CCNA) 1', 8, 10, 15),
(1873, 'Προηγμένα Θέματα Δικτύων', 8, 10, 15),
(1874, 'Συστήματα Κινητών Επικοινωνιών', 8, 10, 15),
(1898, 'Ελεύθερη Επιλογή Β', 8, 10, 15),
(1841, 'Οργάνωση Δεδομένων και Εξόρυξη Πληροφορίας', 8, 10, 15),
(1842, 'Διαδικτυακές Υπηρεσίες Προστιθέμενης Αξίας', 8, 10, 15),
(1948, 'Ανάπτυξη Ολοκληρωμένων Πληροφοριακών Συστημάτων', 8, 10, 15),

(1911, 'Εφαρμογές Ενσωματωμένων Συστημάτων', 9, 10, 15),
(1912, 'Ρομποτική', 9, 10, 15),
(1913, 'ΑΠΕ και Ευφυή Ηλεκτρικά Δίκτυα', 9, 10, 15),
(1914, 'Απτικές Διεπαφές', 9, 10, 15),
(1915, 'Βιοϊατρική Τεχνολογία', 9, 10, 15),
(1916, 'Συστήματα Μετρήσεων Υποβοηθούμενων από Η/Υ', 9, 10, 15),
(1970, 'Πρακτική Άσκηση', 9, 10, 15),
(1971, 'Ασφάλεια Δικτύων και Επικοινωνιών', 9, 10, 15),
(1972, 'Δικτύωση Καθορισμένη από Λογισμικό', 9, 10, 15),
(1973, 'Ειδικά Θέματα Δικτύων (CCNA) 2', 9, 10, 15),
(1974, 'Δορυφορικές Επικοινωνίες', 9, 10, 15),
(1975, 'Τεχνολογία Πολυμέσων', 9, 10, 15),
(1998, 'Ελεύθερη Επιλογή Α', 9, 10, 15),
(1941, 'Ανάπτυξη Διαδικτυακών Συστημάτων και Εφαρμογών', 9, 10, 15),
(1942, 'Επιχειρησιακή Έρευνα', 9, 10, 15),
(1943, 'Ανάκτηση Πληροφοριών – Μηχανές Αναζήτησης', 9, 10, 15),
(1944, 'Διαχείριση Συστήματος και Υπηρεσιών DBMS', 9, 10, 15),
(1945, 'Ευφυή Συστήματα', 9, 10, 15),
(1946, 'Προηγμένα Θέματα Τεχνητής Νοημοσύνης', 9, 10, 15),
(1947, 'Προηγμένη Μηχανική Μάθηση', 9, 10, 15),
(1949, 'Κατανεμημένα Συστήματα', 9, 10, 15),
(1950, 'Σημασιολογικός Ιστός', 9, 10, 15),
(1969, 'Γραφικά Υπολογιστών', 9, 10, 15);


-- Questions for courseId 1103
INSERT INTO questions (id, title, course_id, created, updated) VALUES
(1001, 'What is a variable?', 1101, NOW(), NOW()),
(1002, 'What is the difference between a stack and a queue?', 1101, NOW(), NOW()),
(1003, 'What does JVM stand for and what does it do?', 1101, NOW(), NOW()),
(1004, 'What is Big O notation?', 1101, NOW(), NOW()),
(1005, 'What is encapsulation in OOP?', 1101, NOW(), NOW()),
(1006, 'What is the difference between a primary key and a foreign key?', 1101, NOW(), NOW()),
(1007, 'What is inheritance in OOP?', 1101, NOW(), NOW()),
(1008, 'What is a REST API?', 1101, NOW(), NOW()),
(1009, 'What is the difference between SQL and NoSQL?', 1101, NOW(), NOW()),
(1010, 'What is recursion?', 1101, NOW(), NOW());

-- Answers
INSERT INTO answers (id, title, is_correct, question_id) VALUES
-- Question 1: What is a variable?
(1001,  'A named storage location in memory that holds a value', true,  1001),
(1002,  'A fixed constant that cannot change during execution',  false, 1001),
(1003,  'A function that returns a value',                       false, 1001),
(1004,  'A type of loop used to iterate over data',              false, 1001),

-- Question 2: Stack vs Queue
(1005,  'A stack is LIFO, a queue is FIFO',                      true,  1002),
(1006,  'A stack is FIFO, a queue is LIFO',                      false, 1002),
(1007,  'Both are FIFO data structures',                         false, 1002),
(1008,  'Both are LIFO data structures',                         false, 1002),

-- Question 3: JVM
(1009,  'Java Virtual Machine, executes Java bytecode',          true,  1003),
(1010, 'Java Variable Manager, manages memory allocation',      false, 1003),
(1011, 'Java Version Manager, handles Java installations',      false, 1003),
(1012, 'Java Verification Module, checks code syntax',          false, 1003),

-- Question 4: Big O notation
(1013, 'A way to describe the time and space complexity of an algorithm', true,  1004),
(1014, 'A method for sorting algorithms efficiently',           false, 1004),
(1015, 'A notation for writing mathematical functions',         false, 1004),
(1016, 'A tool for measuring CPU usage of a program',           false, 1004),

-- Question 5: Encapsulation
(1017, 'Bundling data and methods that operate on it into a single unit', true,  1005),
(1018, 'The ability of a class to inherit from multiple classes', false, 1005),
(1019, 'Hiding the implementation of an algorithm',             false, 1005),
(1020, 'A way to overload methods in a class',                  false, 1005),

-- Question 6: Primary key vs Foreign key
(1021, 'A primary key uniquely identifies a row, a foreign key links to another table', true,  1006),
(1022, 'A primary key links tables together, a foreign key identifies a row', false, 1006),
(1023, 'Both are used to uniquely identify rows in a table',    false, 1006),
(1024, 'A foreign key must always match the primary key type',  false, 1006),

-- Question 7: Inheritance
(1025, 'A mechanism where a class acquires properties and methods of another class', true,  1007),
(1026, 'A way to restrict access to class members',             false, 1007),
(1027, 'The process of creating multiple instances of a class', false, 1007),
(1028, 'A design pattern for creating objects',                 false, 1007),

-- Question 8: REST API
(1029, 'An architectural style for building web services using HTTP methods', true,  1008),
(1030, 'A database query language for web applications',        false, 1008),
(1031, 'A JavaScript framework for building web interfaces',    false, 1008),
(1032, 'A protocol for securing web communications',            false, 1008),

-- Question 9: SQL vs NoSQL
(1033, 'SQL is relational and structured, NoSQL is non-relational and flexible', true,  1009),
(1034, 'SQL is faster than NoSQL in all cases',                 false, 1009),
(1035, 'NoSQL databases always use JSON format',                false, 1009),
(1036, 'SQL and NoSQL are both relational database types',      false, 1009),

-- Question 10: Recursion
(1037, 'A function that calls itself until a base case is reached', true,  1010),
(1038, 'A loop that iterates over a collection of items',       false, 1010),
(1039, 'A method for sorting arrays efficiently',               false, 1010),
(1040, 'A way to declare multiple variables at once',           false, 1010);

