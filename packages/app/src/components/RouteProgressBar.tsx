'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';

import {cn} from '@/lib/utils';

export const ROUTE_PROGRESS_START_EVENT = 'grseed:route-progress-start';

const INITIAL_PROGRESS = 8;
const MAX_TRACKED_PROGRESS = 96;
const COMPLETE_PROGRESS = 100;

export function startRouteProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ROUTE_PROGRESS_START_EVENT));
  }
}

type WorkCounters = {
  done: number;
  pending: number;
  total: number;
};

export type RouteProgressBarProps = {
  className?: string;
  /**
   * Keeps very fast route changes from flashing a one-frame bar.
   */
  minimumVisibleMs?: number;
  /**
   * Quiet period after all tracked work settles before the bar completes.
   */
  settleDelayMs?: number;
  /**
   * Last-resort guard for failed requests or browser APIs that never settle.
   */
  maxVisibleMs?: number;
};

type RouteLoadProgressOptions = Omit<RouteProgressBarProps, 'className'>;

function resetCounters(counters: WorkCounters) {
  counters.done = 0;
  counters.pending = 0;
  counters.total = 0;
}

function shouldTrackFetch(input: unknown) {
  const url =
    input instanceof Request
      ? input.url
      : input instanceof URL
        ? input.href
        : input;

  if (typeof url !== 'string') return true;

  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return true;
  }
}

function getTrackableImages() {
  return Array.from(document.images).filter(image => {
    if (image.loading === 'lazy') return false;
    if (!image.currentSrc && !image.src) return false;

    const style = window.getComputedStyle(image);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

export function useRouteLoadProgress({
  maxVisibleMs = 12000,
  minimumVisibleMs = 180,
  settleDelayMs = 120,
}: RouteLoadProgressOptions = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeRef = useRef(false);
  const loadIdRef = useRef(0);
  const routeSettledRef = useRef(true);
  const startedAtRef = useRef(0);
  const networkRef = useRef<WorkCounters>({done: 0, pending: 0, total: 0});
  const assetsRef = useRef<WorkCounters>({done: 0, pending: 0, total: 0});
  const fontsRef = useRef<WorkCounters>({done: 0, pending: 0, total: 0});
  const finishTimer = useRef<number | undefined>(undefined);
  const maxTimer = useRef<number | undefined>(undefined);
  const resetTimer = useRef<number | undefined>(undefined);
  const cleanupAssetsRef = useRef<(() => void) | undefined>(undefined);

  const clearTimers = useCallback(() => {
    window.clearTimeout(finishTimer.current);
    window.clearTimeout(maxTimer.current);
    window.clearTimeout(resetTimer.current);
  }, []);

  const updateProgress = useCallback(() => {
    const routeDone = routeSettledRef.current ? 1 : 0;
    const network = networkRef.current;
    const assets = assetsRef.current;
    const fonts = fontsRef.current;
    const total = 1 + network.total + assets.total + fonts.total;
    const done = routeDone + network.done + assets.done + fonts.done;
    const next = Math.max(
      INITIAL_PROGRESS,
      Math.min(MAX_TRACKED_PROGRESS, Math.round((done / total) * 100)),
    );

    setProgress(current => Math.max(current, next));
  }, []);

  const complete = useCallback(() => {
    if (!activeRef.current) return;

    const remainingVisibleMs = Math.max(
      0,
      minimumVisibleMs - (performance.now() - startedAtRef.current),
    );
    const delay = Math.max(settleDelayMs, remainingVisibleMs);

    window.clearTimeout(finishTimer.current);
    finishTimer.current = window.setTimeout(() => {
      setProgress(COMPLETE_PROGRESS);
      resetTimer.current = window.setTimeout(() => {
        activeRef.current = false;
        setActive(false);
        setProgress(0);
      }, 180);
    }, delay);
  }, [minimumVisibleMs, settleDelayMs]);

  const maybeComplete = useCallback(() => {
    if (!activeRef.current) return;
    updateProgress();

    if (!routeSettledRef.current) return;
    if (networkRef.current.pending > 0) return;
    if (assetsRef.current.pending > 0) return;
    if (fontsRef.current.pending > 0) return;

    complete();
  }, [complete, updateProgress]);

  const start = useCallback(() => {
    loadIdRef.current += 1;
    cleanupAssetsRef.current?.();
    cleanupAssetsRef.current = undefined;
    clearTimers();
    resetCounters(networkRef.current);
    resetCounters(assetsRef.current);
    resetCounters(fontsRef.current);

    activeRef.current = true;
    routeSettledRef.current = false;
    startedAtRef.current = performance.now();
    setActive(true);
    setProgress(INITIAL_PROGRESS);

    maxTimer.current = window.setTimeout(() => {
      routeSettledRef.current = true;
      networkRef.current.pending = 0;
      assetsRef.current.pending = 0;
      fontsRef.current.pending = 0;
      complete();
    }, maxVisibleMs);
  }, [clearTimers, complete, maxVisibleMs]);

  const finishTask = useCallback(
    (counters: WorkCounters, loadId = loadIdRef.current) => {
      if (loadId !== loadIdRef.current) return;
      counters.done += 1;
      counters.pending = Math.max(0, counters.pending - 1);
      maybeComplete();
    },
    [maybeComplete],
  );

  const trackCurrentPageAssets = useCallback(() => {
    cleanupAssetsRef.current?.();
    cleanupAssetsRef.current = undefined;
    resetCounters(assetsRef.current);

    const pendingImages = getTrackableImages().filter(image => !image.complete);
    if (pendingImages.length === 0) {
      maybeComplete();
      return;
    }

    assetsRef.current.total += pendingImages.length;
    assetsRef.current.pending += pendingImages.length;
    updateProgress();

    const loadId = loadIdRef.current;
    const cleanups = pendingImages.map(image => {
      const onSettled = () => finishTask(assetsRef.current, loadId);
      image.addEventListener('load', onSettled, {once: true});
      image.addEventListener('error', onSettled, {once: true});

      return () => {
        image.removeEventListener('load', onSettled);
        image.removeEventListener('error', onSettled);
      };
    });

    cleanupAssetsRef.current = () => cleanups.forEach(cleanup => cleanup());
  }, [finishTask, maybeComplete, updateProgress]);

  const trackFonts = useCallback(() => {
    if (fontsRef.current.total > 0) {
      maybeComplete();
      return;
    }

    if (!('fonts' in document) || document.fonts.status === 'loaded') {
      maybeComplete();
      return;
    }

    fontsRef.current.total += 1;
    fontsRef.current.pending += 1;
    const loadId = loadIdRef.current;
    document.fonts.ready.finally(() => finishTask(fontsRef.current, loadId));
    updateProgress();
  }, [finishTask, maybeComplete, updateProgress]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');
      if (
        !href ||
        href.startsWith('#') ||
        targetAttr === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }
      const nextUrl = new URL(href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;
      if (nextUrl.href === window.location.href) return;
      start();
    };

    window.addEventListener(ROUTE_PROGRESS_START_EVENT, start);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener(ROUTE_PROGRESS_START_EVENT, start);
      document.removeEventListener('click', onClick, true);
    };
  }, [start]);

  useEffect(() => {
    const originalFetch = window.fetch;
    const trackedFetch = (async (...args: Parameters<typeof window.fetch>) => {
      const [input] = args;
      const shouldTrack = activeRef.current && shouldTrackFetch(input);
      const loadId = loadIdRef.current;
      if (shouldTrack) {
        networkRef.current.total += 1;
        networkRef.current.pending += 1;
        updateProgress();
      }

      try {
        return await originalFetch(...args);
      } finally {
        if (shouldTrack) finishTask(networkRef.current, loadId);
      }
    }) as typeof window.fetch;
    Object.assign(trackedFetch, originalFetch);

    window.fetch = trackedFetch;
    return () => {
      if (window.fetch === trackedFetch) window.fetch = originalFetch;
    };
  }, [finishTask, updateProgress]);

  useEffect(() => {
    if (!activeRef.current) return;

    routeSettledRef.current = true;
    updateProgress();

    const frame = window.requestAnimationFrame(() => {
      trackCurrentPageAssets();
      trackFonts();
      maybeComplete();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    pathname,
    searchParams,
    maybeComplete,
    trackCurrentPageAssets,
    trackFonts,
    updateProgress,
  ]);

  useEffect(() => {
    if (document.readyState === 'complete') return;

    const frame = window.requestAnimationFrame(() => start());
    const onLoad = () => {
      routeSettledRef.current = true;
      trackCurrentPageAssets();
      trackFonts();
      maybeComplete();
    };

    window.addEventListener('load', onLoad, {once: true});
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, [maybeComplete, start, trackCurrentPageAssets, trackFonts]);

  useEffect(() => {
    return () => {
      clearTimers();
      cleanupAssetsRef.current?.();
    };
  }, [clearTimers]);

  return {active, progress};
}

export function RouteProgressBar({
  className,
  maxVisibleMs = 12000,
  minimumVisibleMs = 180,
  settleDelayMs = 120,
}: RouteProgressBarProps) {
  const {active, progress} = useRouteLoadProgress({
    maxVisibleMs,
    minimumVisibleMs,
    settleDelayMs,
  });

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden',
        className,
      )}
      aria-hidden={!active}
    >
      <div
        className={cn(
          'h-full origin-left bg-primary transition-transform duration-300 ease-out',
          active ? 'opacity-100' : 'opacity-0',
        )}
        style={{transform: `scaleX(${progress / 100})`}}
      />
    </div>
  );
}
