// Utility helpers for Leaderboard values formatting and user matching.

export function formatValue(tab, val) {
  if (val == null || isNaN(val)) return "0";
  const num = Number(val);
  if (tab === "byCourse") {
    return `${Math.round(num)}`;
  }
  if (tab === "users" || tab === "coursesAvg") {
    // Show percentage if backend returns > 10, otherwise format raw score
    return num > 10 ? `${num.toFixed(1)}%` : num.toFixed(2);
  }
  if (tab === "popularCourses") {
    return `${Math.round(num)} κουίζ`;
  }
  if (tab === "helpers") {
    return `${Math.round(num)} ερωτήσεις`;
  }
  return num.toString();
}

export function isCurrentUserRow(row, user, tab) {
  if (!user || !row?.name) return false;
  const rName = row.name.toLowerCase().trim();
  const uName = user.username?.toLowerCase().trim();
  const dName = user.displayName?.toLowerCase().trim();
  const pName = user.publicName?.toLowerCase().trim();
  const discord = user.discordName?.toLowerCase().trim().replace(/^@/, "");

  // 1. In 'helpers' tab, backend returns u.username -> strict username matching
  if (tab === "helpers") {
    return Boolean(uName && rName === uName);
  }

  // 2. In users / course tabs, backend returns display_name or formatted publicName
  if (pName && rName === pName) return true;
  if (dName && rName === dName) return true;
  if (dName && rName.startsWith(`${dName} (`)) return true;
  if (
    discord &&
    (rName.includes(`(${discord})`) || rName.includes(`(@${discord})`))
  )
    return true;
  if (uName && rName === uName) return true;

  return false;
}
