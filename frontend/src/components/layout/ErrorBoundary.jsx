// Τελευταίο δίχτυ για σφάλματα render. Χωρίς αυτό, ένα exception σε οποιοδήποτε
// component ξηλώνει ολόκληρο το React tree και ο χρήστης βλέπει λευκή σελίδα --
// χωρίς μήνυμα, και χωρίς να μάθει ποτέ κανείς ότι συνέβη.
//
// Class component υποχρεωτικά: το componentDidCatch δεν έχει hook αντίστοιχο.
import { Component } from 'react'
import { logCrash } from '../../lib/clientLog'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logCrash({
      exceptionClass: error?.name || 'ReactRenderError',
      message: error?.message || 'Unknown render error',
      // Το component stack λέει ΠΟΙΟ component έσπασε, κάτι που το JS stack
      // συχνά δεν δείχνει μετά το minification.
      stackTrace: [error?.stack, errorInfo?.componentStack].filter(Boolean).join('\n\n--- component stack ---\n'),
    })
  }

  handleReload = () => {
    window.location.assign('/')
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-5">
            💥
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Κάτι πήγε στραβά
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Παρουσιάστηκε ένα απρόσμενο σφάλμα και η σελίδα δεν μπόρεσε να φορτώσει.
            Το πρόβλημα καταγράφηκε αυτόματα και θα το δει η ομάδα.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-colors"
          >
            Επιστροφή στην αρχική
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
