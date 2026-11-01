import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, Trophy, X, ChevronRight, Zap } from 'lucide-react'
import { badgeView } from '../../lib/badges'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import { useAchievementCelebrationStore } from '../../store/achievementCelebrationStore'
import t from '../../content/profile.json'

const ROMAN = ['', 'I', 'II', 'III', 'IV']

// Χρονισμός του rank-up: δείχνει το παλιό tier, «φορτίζει», και μετά σκάει το νέο.
// Το κομφετί του modal ξεκινάει τη στιγμή του UPGRADE_AT, μαζί με το slam.
const CHARGE_AT = 1300
const UPGRADE_AT = 2400

// Lightweight pure-canvas confetti generator (no external dependencies)
function ConfettiCanvas({ delay = 0 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = ['#14b8a6', '#0d9488', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981']
    const particles = Array.from({ length: 110 }, () => ({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.35 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.38,
      drag: 0.98,
    }))

    let start = null
    function render(time) {
      if (start === null) start = time
      const elapsed = time - start
      ctx.clearRect(0, 0, width, height)

      let anyAlive = false
      for (const p of particles) {
        p.vx *= p.drag
        p.vy = p.vy * p.drag + p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        if (elapsed > 3200) {
          p.opacity = Math.max(0, p.opacity - 0.015)
        }

        if (p.opacity > 0 && p.y < height + 50) {
          anyAlive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
      }

      if (anyAlive && elapsed < 6000) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const delayId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(render)
    }, delay)

    function handleResize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(delayId)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [delay])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      aria-hidden="true"
    />
  )
}

// LoL-style Rank-up Card (I -> II)
function RankUpCard({ item }) {
  const [stage, setStage] = useState('before') // 'before' -> 'morphing' -> 'upgraded'
  const oldNumeral = ROMAN[item.oldTier] || String(item.oldTier)
  const newNumeral = ROMAN[item.newTier] || String(item.newTier)

  const viewData = badgeView({ code: item.code, tier: stage === 'upgraded' ? item.newTier : item.oldTier, earned: true })
  const baseName = viewData?.name?.replace(/ (I|II|III|IV)$/, '') || viewData?.name

  useEffect(() => {
    // Stage 1: display old tier
    const t1 = setTimeout(() => setStage('morphing'), CHARGE_AT)
    // Stage 2: slam into new tier
    const t2 = setTimeout(() => setStage('upgraded'), UPGRADE_AT)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (!viewData) return null
  const Icon = viewData.Icon

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 p-6 text-center shadow-xl flex flex-col items-center">
      {/* Background radial rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none animate-ray-spin" />

      {/* Rank Up tag */}
      <div className="relative mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-widest text-amber-300 shadow-sm">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
        {t.celebration.rankUp}
      </div>

      {/* Central Emblem & Shockwave */}
      <div className="relative my-3 flex items-center justify-center">
        {/* Shockwave ripple when morphing */}
        {stage === 'morphing' && (
          <span className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-shockwave pointer-events-none" />
        )}
        {/* Διπλό κύμα τη στιγμή του upgrade */}
        {stage === 'upgraded' && (
          <>
            <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-shockwave-big pointer-events-none" />
            <span className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-shockwave-big [animation-delay:180ms] pointer-events-none" />
          </>
        )}

        <div className={`relative w-28 h-28 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 ${
          stage === 'upgraded'
            ? 'bg-gradient-to-br from-amber-500/25 to-yellow-500/10 border-amber-400 text-amber-400 animate-gold-glow scale-110'
            : stage === 'morphing'
              ? 'bg-slate-800/80 border-amber-500/60 text-amber-200 animate-charge'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
        }`}>
          <Icon className="w-14 h-14 stroke-[1.75]" />
        </div>
      </div>

      {/* Badge Name & Rank Numeral Morph */}
      <h4 className="mt-3 text-lg font-extrabold text-slate-100 tracking-tight flex items-center justify-center gap-2">
        <span>{baseName}</span>

        {/* LoL Rank-up Roman Numeral Morph */}
        <span className="relative inline-flex items-center justify-center min-w-[2.2rem] h-8 px-2 rounded-lg bg-amber-950/60 border border-amber-500/50 shadow-inner">
          {stage !== 'upgraded' ? (
            <span
              className={`text-base font-black text-amber-400 transition-all duration-300 ${
                stage === 'morphing' ? 'scale-110 opacity-60 animate-pulse' : 'scale-100 opacity-100'
              }`}
            >
              {oldNumeral}
            </span>
          ) : (
            <span className="text-base font-black text-amber-300 animate-rank-slam drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]">
              {newNumeral}
            </span>
          )}
        </span>
      </h4>

      {/* Progression Indicator: I -> II */}
      <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 line-through decoration-amber-500/60">
          Tier {oldNumeral}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          Tier {newNumeral}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-xs">
        {viewData.description}
      </p>
    </div>
  )
}

// Fresh Unlock Card (0 -> I)
function UnlockCard({ item }) {
  const viewData = badgeView({ code: item.code, tier: item.newTier, earned: true })
  if (!viewData) return null
  const Icon = viewData.Icon

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-teal-500/30 p-6 text-center shadow-xl flex flex-col items-center animate-pop">
      {/* Background radial rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,184,166,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none animate-ray-spin" />

      {/* New Badge tag */}
      <div className="relative mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 border border-teal-500/40 text-[11px] font-extrabold uppercase tracking-widest text-teal-300 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
        {t.celebration.newBadge}
      </div>

      {/* Badge Icon */}
      <div className="relative my-3 w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/25 to-brand-500/10 border border-teal-400/60 text-teal-300 flex items-center justify-center shadow-inner">
        <Icon className="w-12 h-12 stroke-[1.75]" />
      </div>

      {/* Badge Name */}
      <h4 className="mt-3 text-lg font-extrabold text-slate-100 tracking-tight">
        {viewData.name}
      </h4>

      <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
        {viewData.description}
      </p>
    </div>
  )
}

function AchievementCelebrationModal({
  open: propOpen,
  onClose: propOnClose,
  achievements: propAchievements,
} = {}) {
  const storeOpen = useAchievementCelebrationStore((s) => s.open)
  const storeAchievements = useAchievementCelebrationStore((s) => s.achievements)
  const storeClose = useAchievementCelebrationStore((s) => s.close)

  const open = propOpen !== undefined ? propOpen : storeOpen
  const achievements = propAchievements !== undefined ? propAchievements : storeAchievements
  const onClose = propOnClose !== undefined ? propOnClose : storeClose

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open || !achievements || achievements.length === 0) return null

  const hasUpgrades = achievements.some((a) => a.isUpgrade)
  const hasUnlocks = achievements.some((a) => !a.isUpgrade)

  const title =
    hasUpgrades && !hasUnlocks
      ? t.celebration.titleUpgrade
      : !hasUpgrades && hasUnlocks
        ? t.celebration.titleNew
        : t.celebration.titleMultiple

  const subtitle =
    hasUpgrades && !hasUnlocks
      ? t.celebration.subtitleUpgrade
      : !hasUpgrades && hasUnlocks
        ? t.celebration.subtitleNew
        : t.celebration.subtitleMultiple

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <ConfettiCanvas delay={hasUpgrades ? UPGRADE_AT : 0} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-xl my-6 bg-slate-950/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center animate-reveal overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Κλείσιμο"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Trophy className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Badges Grid */}
        <div className={`w-full gap-4 ${
          achievements.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex flex-col'
        }`}>
          {achievements.map((item) =>
            item.isUpgrade ? (
              <RankUpCard key={item.code} item={item} />
            ) : (
              <UnlockCard key={item.code} item={item} />
            )
          )}
        </div>

        {/* Confirm Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full sm:w-auto min-w-[12rem] px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-brand-600 hover:from-teal-400 hover:to-brand-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all cursor-pointer"
        >
          {t.celebration.close}
        </button>
      </div>
    </div>,
    document.body
  )
}

export default AchievementCelebrationModal
