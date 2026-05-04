/**
 * html5-qrcode uses fixed element ids (#qr-shaded-region, #qr-canvas). Overlapping
 * start/stop (e.g. React Strict Mode or async races) corrupts cleanup and can
 * leave two camera surfaces. Serialize scanner work app-wide.
 */
let chain = Promise.resolve();

export function withQrScanLock(fn) {
  const next = chain.then(fn, fn);
  chain = next.catch(() => {});
  return next;
}
