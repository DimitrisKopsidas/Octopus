import { Link } from 'react-router-dom'

export default function NoAccessAdmin({ loggedIn, currentUser }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-up">
      {/* ================= Hero Card ================= */}
      <div className="relative overflow-hidden rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 sm:p-12 text-center">
        {/* Background Glow */}
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        {/* Crown */}
        <div className="flex flex-col items-center mb-7 space-y-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-500/20 animate-ping opacity-20" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 via-white to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-amber-300 dark:border-amber-700 shadow-xl text-4xl">
              👑
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-500">
            🛡️ ΑΠΑΙΤΟΥΝΤΑΙ ΔΙΚΑΙΩΜΑΤΑ ΔΙΑΧΕΙΡΙΣΤΗ
          </div>
        </div>


        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {loggedIn
            ? 'Περιορισμένη Πρόσβαση'
            : 'Απαιτείται Σύνδεση Διαχειριστή'}
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-7">
          {loggedIn ? (
            <>
              Ο λογαριασμός σου{' '}
              <span className="font-bold text-slate-900 dark:text-slate-200">
                @{currentUser?.username}
              </span>{' '}
              διαθέτει ρόλο{' '}
              <span className="font-bold">
                {currentUser?.role}
              </span>
              . Η συγκεκριμένη περιοχή είναι διαθέσιμη μόνο σε χρήστες με
              δικαιώματα{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                ADMIN
              </span>
              .
            </>
          ) : (
            <>
              Συνδέσου με λογαριασμό <b>ADMIN</b> για να αποκτήσεις πρόσβαση
              στις ρυθμίσεις του συστήματος, τα Audit Logs και τα εργαλεία
              διαχείρισης.
            </>
          )}
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 px-7 py-3.5 font-bold text-slate-900 transition-all hover:-translate-y-1 shadow-lg shadow-amber-500/30"
              >
                🔐 Σύνδεση ως Admin
              </Link>

              <Link
                to="/"
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-7 py-3.5 font-semibold text-slate-800 dark:text-slate-200 transition-all hover:-translate-y-1"
              >
                🏠 Πίσω στην Αρχική
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-600 px-7 py-3.5 font-bold text-slate-900 transition-all hover:-translate-y-1 shadow-lg shadow-amber-500/30"
              >
                🏠 Επιστροφή στην Αρχική
              </Link>

              <Link
                to="/courses"
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-7 py-3.5 font-semibold text-slate-800 dark:text-slate-200 transition-all hover:-translate-y-1"
              >
                📚 Προβολή Μαθημάτων
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ================= Section Title ================= */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Τι περιλαμβάνει η πρόσβαση Διαχειριστή
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Οι παρακάτω λειτουργίες είναι διαθέσιμες αποκλειστικά σε λογαριασμούς
          με δικαιώματα ADMIN.
        </p>
      </div>

      {/* ================= Feature Cards ================= */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              🛡️
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Audit Logs & Ασφάλεια
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              Παρακολούθηση όλων των ενεργειών του συστήματος, ιστορικό
              συνδέσεων, αλλαγές δεδομένων και συμβάντα ασφαλείας.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              ⚙️
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Σφαιρικές Ρυθμίσεις
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              Διαχείριση παραμέτρων, χρονικών ορίων, κανόνων λειτουργίας,
              πολιτικών ασφαλείας και ρυθμίσεων του συστήματος.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              🔑
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Διαχείριση Ρόλων & Helpers
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              Διαχείριση δικαιωμάτων χρηστών, δημιουργία Helper Codes,
              ανάθεση ρόλων και πλήρης έλεγχος πρόσβασης.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}