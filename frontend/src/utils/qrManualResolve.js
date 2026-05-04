/**
 * Pick one restaurant from API list results for manual dine-in entry (name + table).
 */
export function pickRestaurantFromSearch(query, list) {
  const q = String(query || '').trim().toLowerCase();
  if (!q || !Array.isArray(list) || list.length === 0) return { restaurant: null, ambiguous: false };

  const norm = (name) => String(name || '').trim().toLowerCase();

  const exact = list.find((r) => norm(r.name) === q);
  if (exact) return { restaurant: exact, ambiguous: false };

  if (list.length === 1) return { restaurant: list[0], ambiguous: false };

  const contains = list.filter((r) => norm(r.name).includes(q));
  if (contains.length === 1) return { restaurant: contains[0], ambiguous: false };

  if (contains.length > 1) return { restaurant: null, ambiguous: true };

  return { restaurant: null, ambiguous: false };
}

export function buildTableMenuPath(restaurantId, tableLabel) {
  const id = String(restaurantId || '').trim();
  const table = String(tableLabel || '').trim();
  if (!id || !table) return null;
  const q = new URLSearchParams({ table });
  return `/menu/${encodeURIComponent(id)}?${q.toString()}`;
}
