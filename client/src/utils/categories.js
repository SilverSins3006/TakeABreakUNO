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

export function normalizeCategory(category) {
  if (typeof category !== "string") return null;
  return categoryMap[category.trim().toLowerCase()] || null;
}

export function normalizeCategories(categories) {
  if (!Array.isArray(categories)) return [];

  return categories.map(normalizeCategory).filter(Boolean);
}
