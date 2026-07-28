export function getRemainingSeconds(endTime, currentTime = Date.now()) {
  return Math.max(0, Math.ceil((endTime - currentTime) / 1000));
}
