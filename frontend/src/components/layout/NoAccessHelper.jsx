import { Link } from 'react-router-dom'
import tAdmin from '../../content/admin.json'

export default function NoAccessHelper({ loggedIn, currentUser }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-up">
      {/* ================= Hero Card ================= */}
      <div className="relative overflow-hidden rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 sm:p-12 text-center">
        {/* Background Glow */}
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Handshake Icon */}
        <div className="flex flex-col items-center mb-7 space-y-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-brand-500/20 animate-ping opacity-20" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-50 via-white to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-brand-300 dark:border-brand-700 shadow-xl text-4xl">
              🤝
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-500">
            🤝 ΠΙΝΑΚΑΣ ΣΥΝΕΡΓΑΤΩΝ HELPER
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {loggedIn
            ? 'Περιορισμένη Πρόσβαση'
            : 'Απαιτείται Σύνδεση Helper'}
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
              . Η διαχείριση ερωτήσεων και υλικού είναι διαθέσιμη σε χρήστες με
              δικαιώματα{' '}
              <span className="font-bold text-brand-600 dark:text-brand-400">
                HELPER
              </span>{' '}
              ή{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                ADMIN
              </span>
              .
            </>
          ) : (
            <>
              Συνδέσου με λογαριασμό <b>HELPER</b> ή <b>ADMIN</b> για να αποκτήσεις πρόσβαση
              στη διαχείριση μαθημάτων, την εισαγωγή ερωτήσεων και τις αναφορές.
            </>
          )}
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-7 py-3.5 font-bold text-white transition-all hover:-translate-y-1 shadow-lg shadow-brand-600/30"
              >
                🔐 Σύνδεση / Εγγραφή
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
                className="inline-flex min-w-[220px] justify-center items-center rounded-xl bg-brand-600 hover:bg-brand-700 px-7 py-3.5 font-bold text-white transition-all hover:-translate-y-1 shadow-lg shadow-brand-600/30"
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
          Τι περιλαμβάνει ο Πίνακας Συνεργατών
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Οι παρακάτω λειτουργίες είναι διαθέσιμες σε εγγεγραμμένα μέλη με ρόλο HELPER & ADMIN.
        </p>
      </div>

      {/* ================= Feature Cards ================= */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              ✍️
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {tAdmin.features[0].title}
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              {tAdmin.features[0].description}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              🚩
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {tAdmin.features[1].title}
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              {tAdmin.features[1].description}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 text-2xl transition-transform duration-300 group-hover:scale-110">
              📊
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {tAdmin.features[2].title}
            </h3>

            <p className="mt-3 flex-grow text-sm leading-6 text-slate-600 dark:text-slate-400">
              {tAdmin.features[2].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
