// Initial-letter avatar, coloured by role. Used by profiles, Community cards and
// the preview modal. (The older inline avatars in UserMenu, the admin table and
// the drawer are left as they are.) Shows the Octopus logo in Konami mode.
import { forwardRef } from 'react'
import { userInitial } from '../../lib/roles'
import { useEasterEggStore } from '../../store/easterEggStore'
import logo from '../../assets/logo.png'

const ROLE_TONE = {
  ADMIN: 'bg-rose-50 dark:bg-rose-950/40 border-rose-400/70 text-rose-600 dark:text-rose-300 shadow-rose-500/10',
  HELPER: 'bg-amber-50 dark:bg-amber-950/40 border-amber-400/70 text-amber-600 dark:text-amber-300 shadow-amber-500/10',
  STUDENT: 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/60 text-teal-600 dark:text-teal-400 shadow-teal-500/10',
}

const SIZES = {
  sm: 'w-9 h-9 text-sm rounded-xl border',
  md: 'w-12 h-12 text-lg rounded-xl border-2',
  lg: 'w-16 h-16 text-2xl rounded-2xl border-2',
  xl: 'w-24 h-24 text-4xl rounded-3xl border-2',
}

const UserAvatar = forwardRef(function UserAvatar(
  { name, username, role, size = 'md', className = '', ...rest },
  ref,
) {
  const octopusMode = useEasterEggStore((s) => s.octopusAvatars)
  const tone = ROLE_TONE[role] ?? ROLE_TONE.STUDENT

  return (
    <div
      ref={ref}
      className={`${SIZES[size] ?? SIZES.md} ${tone} font-bold flex items-center justify-center shadow-lg shrink-0 select-none overflow-hidden ${className}`}
      {...rest}
    >
      {octopusMode ? (
        <img src={logo} alt="" className="w-[80%] h-[80%] animate-float" />
      ) : (
        userInitial({ displayName: name, username })
      )}
    </div>
  )
})

export default UserAvatar
