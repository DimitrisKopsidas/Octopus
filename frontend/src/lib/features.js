// Feature flags. Flip a value here to switch a whole surface on or off.

// The leaderboard's ranking queries still need rework (rows carry only a name,
// namesakes merge, inactive users count), so the page shows a locked state and
// fires no requests until this is true again.
export const LEADERBOARD_ENABLED = false
