/**
 * @file Category normalization utilities. Maps loosely-formatted category
 * input (different casing, hyphens vs. spaces, short aliases) to the
 * canonical category labels used elsewhere in the app.
 */

const categoryMap = {
  exercise: "Exercise",
  stretch: "Stretch",
  chores: "Chores",
  brain: "Brain Teaser",
  "brain teaser": "Brain Teaser",
  "brain-teaser": "Brain Teaser",
  hunt: "Scavenger Hunt",
  "scavenger hunt": "Scavenger Hunt",
  "scavenger-hunt": "Scavenger Hunt",
  outside: "Get Outside",
  "get outside": "Get Outside",
  "get-outside": "Get Outside",
};

/**
 * Normalizes a category string using categoryMap, so aliases like
 * "brain-teaser" and "Brain Teaser" both resolve to the same value.
 * @param {string} category - Raw category value from the request.
 * @returns {string|null} The normalized category, or null if invalid.
 */
export function normalizeCategory(category) {
  if (typeof category !== "string") return null;
  return categoryMap[category.trim().toLowerCase()] || null;
}

/**
 * Normalizes an array of category strings using normalizeCategory.
 * @param {string[]} categories - Array of raw category values from the request.
 * @returns {string[]} Array of normalized categories, with invalid entries removed.
 */
export function normalizeCategories(categories) {
  if (!Array.isArray(categories)) return [];

  return categories.map(normalizeCategory).filter(Boolean);
}