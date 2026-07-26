import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ACCESSIBILITY_VERSION,
  getAccessibilityVersionFromLocation,
  setAccessibilityVersionInLocation,
} from './version';

const AccessibilityVersionContext = createContext({
  accessibilityVersion: DEFAULT_ACCESSIBILITY_VERSION,
  setAccessibilityVersion: () => {},
});

/**
 * Provides the demo comparison mode and keeps it in sync with ?accessibility=.
 * Remove this provider (and the toggle) when the comparison demo is retired.
 */
export const AccessibilityVersionProvider = ({ children }) => {
  const [accessibilityVersion, setAccessibilityVersionState] = useState(
    getAccessibilityVersionFromLocation
  );

  // Keep React state aligned if the query string changes (e.g. browser back/forward).
  useEffect(() => {
    const syncFromUrl = () => {
      setAccessibilityVersionState(getAccessibilityVersionFromLocation());
    };

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const setAccessibilityVersion = useCallback((version) => {
    const next = version === 'before' ? 'before' : 'after';
    setAccessibilityVersionInLocation(next);
    setAccessibilityVersionState(next);
  }, []);

  const value = useMemo(
    () => ({
      accessibilityVersion,
      setAccessibilityVersion,
    }),
    [accessibilityVersion, setAccessibilityVersion]
  );

  return (
    <AccessibilityVersionContext.Provider value={value}>
      {children}
    </AccessibilityVersionContext.Provider>
  );
};

export const useAccessibilityVersion = () => useContext(AccessibilityVersionContext);
