/**
 * Turn scanned QR text into an in-app path we allow navigating to (table menu).
 * Accepts full URLs or paths like /menu/:restaurantId?table=...
 */
export function resolveQrScanToAppPath(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;

  const isMenuPath = (pathname) => /^\/menu\/[^/]+/.test(pathname);

  try {
    const u = new URL(raw);
    if (isMenuPath(u.pathname)) {
      return `${u.pathname}${u.search || ''}`;
    }
  } catch {
    /* not absolute URL */
  }

  if (raw.startsWith('/menu/')) {
    return raw.includes(' ') ? null : raw;
  }

  try {
    const u = new URL(raw, window.location.origin);
    if (isMenuPath(u.pathname)) {
      return `${u.pathname}${u.search || ''}`;
    }
  } catch {
    return null;
  }

  return null;
}
