// useMediaQuery.ts
import {useEffect, useState} from 'react';

function getMatch(query: string): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia === 'undefined'
  ) {
    return false;
  }
  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultValue;
    return getMatch(query);
  });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 先同步一次，防止 hydration 后不一致
    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', listener);
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * 语义化封装：是否为手机尺寸
 * 常见断点：< 768px
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * 是否为平板区间
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * 是否为桌面端
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
