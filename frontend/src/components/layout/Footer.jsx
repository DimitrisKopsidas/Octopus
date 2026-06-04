// Site footer (brand, version badge, nav links, credits). Rendered by Layout.
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import t from '../../content/layout.json'

function FooterLink({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `text-sm transition-colors ${
          isActive
            ? 'text-brand-700 dark:text-brand-400 font-medium'
            : 'text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Octopus" className="w-7 h-7" />
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">{t.brand}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-100/70 dark:bg-brand-900/40 px-1.5 py-0.5 rounded-full">
                {t.footer.version}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <nav className="md:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              {t.footer.navTitle}
            </h3>
            <ul className="space-y-2">
              <li><FooterLink to="/" end>{t.nav.home}</FooterLink></li>
              <li><FooterLink to="/courses">{t.nav.courses}</FooterLink></li>
              <li><FooterLink to="/info">{t.nav.info}</FooterLink></li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{t.footer.copyright.replace('{year}', new Date().getFullYear())}</span>
          <span>{t.footer.credits}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
