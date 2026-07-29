/**
 * @file Timer utilities. Pure helper for computing remaining session
 * time from an end timestamp, used by the Timer component and its tests.
 */

/**
 * Computes the whole seconds remaining until endTime, clamped to zero.
 * @param {number} endTime - Target timestamp in milliseconds (e.g. from
 * Date.now() plus a duration).
 * @param {number} [currentTime=Date.now()] - Timestamp to measure from,
 * in milliseconds. Defaults to now; overridable for testing.
 * @returns {number} Seconds remaining until endTime, never below 0.
 */
export function getRemainingSeconds(endTime, currentTime = Date.now()) {
  return Math.max(0, Math.ceil((endTime - currentTime) / 1000));
}