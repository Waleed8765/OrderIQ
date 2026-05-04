import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CameraOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveQrScanToAppPath } from '../../utils/qrScanResolve';
import { pickRestaurantFromSearch, buildTableMenuPath } from '../../utils/qrManualResolve';
import { restaurantService } from '../../services/restaurant.service';
import { withQrScanLock } from '../../utils/qrScanLock';

/**
 * Stable unique id per component instance (outer reader mount point).
 */
function useReaderElementId() {
  const [id] = useState(() => {
    const suffix =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    return `orderiq-qr-reader-${suffix}`;
  });
  return id;
}

function dedupeVideosInReader(rootEl) {
  if (!rootEl) return;
  const videos = rootEl.querySelectorAll('video');
  videos.forEach((v, i) => {
    if (i > 0) v.remove();
  });
}

/**
 * Opens the device camera (rear camera on mobile when available) to scan table QR codes.
 * Works on HTTPS or localhost; user must grant camera permission.
 */
const QRScanPage = () => {
  const navigate = useNavigate();
  const readerElementId = useReaderElementId();
  const scannerRef = useRef(null);
  const handledRef = useRef(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('Starting camera…');
  const [manualName, setManualName] = useState('');
  const [manualTable, setManualTable] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  useLayoutEffect(() => {
    let alive = true;

    const stopScanner = async () => {
      const instance = scannerRef.current;
      scannerRef.current = null;
      if (!instance) {
        const el = document.getElementById(readerElementId);
        if (el) el.innerHTML = '';
        return;
      }
      try {
        await instance.stop();
      } catch {
        /* already stopped */
      }
      try {
        instance.clear();
      } catch {
        /* ignore */
      }
      const el = document.getElementById(readerElementId);
      if (el) el.innerHTML = '';
    };

    const startWork = withQrScanLock(async () => {
      let Html5Qrcode;
      try {
        ({ Html5Qrcode } = await import('html5-qrcode'));
      } catch {
        if (alive) {
          setError('Scanner failed to load. Check your connection and try again.');
          setHint('');
        }
        return;
      }

      const root = document.getElementById(readerElementId);
      if (!root || !alive) return;
      root.innerHTML = '';

      const onScanSuccess = async (decodedText) => {
        if (handledRef.current || !alive) return;
        const path = resolveQrScanToAppPath(decodedText);
        if (!path) {
          toast.error('This QR code is not an OrderIQ table menu. Scan the code on your table.');
          return;
        }
        handledRef.current = true;
        await withQrScanLock(stopScanner);
        navigate(path, { replace: true });
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      let html5;
      try {
        html5 = new Html5Qrcode(readerElementId, { verbose: false });
        scannerRef.current = html5;
      } catch (e) {
        if (alive) {
          setError(e?.message || 'Could not start the scanner.');
          setHint('');
        }
        return;
      }

      try {
        try {
          await html5.start({ facingMode: 'environment' }, config, onScanSuccess, () => {});
        } catch {
          try {
            await html5.stop();
          } catch {
            /* ignore */
          }
          try {
            html5.clear();
          } catch {
            /* ignore */
          }
          root.innerHTML = '';
          if (!alive) return;

          const cameras = await Html5Qrcode.getCameras();
          if (!alive) return;
          if (!cameras?.length) {
            scannerRef.current = null;
            if (alive) {
              setError('No camera found. On desktop, connect a webcam or open this page on your phone.');
              setHint('');
            }
            return;
          }
          scannerRef.current = html5;
          await html5.start(cameras[0].id, config, onScanSuccess, () => {});
        }

        if (!alive) {
          try {
            await html5.stop();
          } catch {
            /* ignore */
          }
          return;
        }

        dedupeVideosInReader(root);
        setHint('Point at the QR code on your table');
        setError('');
      } catch (e) {
        await stopScanner();
        if (alive) {
          setError(e?.message || 'Could not access the camera. Allow permission in browser settings.');
          setHint('');
        }
      }
    });

    void startWork;

    return () => {
      alive = false;
      void withQrScanLock(stopScanner);
    };
  }, [navigate, readerElementId]);

  const onManualOpenMenu = async (e) => {
    e.preventDefault();
    const name = manualName.trim();
    const table = manualTable.trim();
    if (!name) {
      toast.error('Enter the restaurant name.');
      return;
    }
    if (!table) {
      toast.error('Enter the table name or number (as shown on the table QR).');
      return;
    }

    setManualLoading(true);
    try {
      const res = await restaurantService.getAllRestaurants({
        search: name,
        limit: 30,
        page: 1,
      });
      const list = res?.data || [];
      const { restaurant, ambiguous } = pickRestaurantFromSearch(name, list);

      if (ambiguous) {
        toast.error('Several restaurants matched. Enter the full name as it appears in the app.');
        return;
      }
      if (!restaurant) {
        toast.error('No restaurant found with that name. Check spelling or try the name from the home page.');
        return;
      }

      const path = buildTableMenuPath(restaurant.id, table);
      if (!path) {
        toast.error('Could not open the menu. Try again.');
        return;
      }

      handledRef.current = true;
      await withQrScanLock(async () => {
        const instance = scannerRef.current;
        scannerRef.current = null;
        if (instance) {
          try {
            await instance.stop();
          } catch {
            /* ignore */
          }
          try {
            instance.clear();
          } catch {
            /* ignore */
          }
        }
        const el = document.getElementById(readerElementId);
        if (el) el.innerHTML = '';
      });

      navigate(path, { replace: true });
    } catch {
      toast.error('Could not look up the restaurant. Check your connection and try again.');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40 shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">Scan table QR</h1>
          <p className="text-xs text-white/60">Dine-in ordering</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-auto">
        {!error && (
          <div className="orderiq-qr-root">
            <div id={readerElementId} className="orderiq-qr-surface" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 max-w-md text-center mt-8">
            <CameraOff className="w-16 h-16 text-white/40" />
            <p className="text-white/90">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 font-medium"
            >
              Back to home
            </button>
          </div>
        )}

        {hint && !error && (
          <p className="mt-4 text-sm text-white/70 text-center max-w-md">{hint}</p>
        )}

        <div className="w-full max-w-md mt-8 rounded-xl border border-white/15 bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-white/90 mb-1">No camera or scan not working?</h2>
          <p className="text-xs text-white/55 mb-3">
            Type the restaurant name and table exactly as on your table card (for example “Table 5”).
          </p>
          <form onSubmit={onManualOpenMenu} className="flex flex-col gap-3">
            <label className="block">
              <span className="text-xs text-white/60">Restaurant name</span>
              <input
                type="text"
                value={manualName}
                onChange={(ev) => setManualName(ev.target.value)}
                autoComplete="organization"
                className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Pizza House"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/60">Table name or number</span>
              <input
                type="text"
                value={manualTable}
                onChange={(ev) => setManualTable(ev.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Table 5"
              />
            </label>
            <button
              type="submit"
              disabled={manualLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 py-2.5 text-sm font-medium"
            >
              {manualLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Open table menu
            </button>
          </form>
        </div>

        <p className="mt-6 text-xs text-white/45 text-center max-w-sm">
          If nothing happens, allow camera access for this site. On iPhone use Safari; on Android use Chrome.
        </p>
      </div>
    </div>
  );
};

export default QRScanPage;
