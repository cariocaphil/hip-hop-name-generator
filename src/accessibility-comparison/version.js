/**
 * Accessibility comparison mode helpers.
 * Demo-only: safe to delete with the rest of src/accessibility-comparison/.
 */

export const ACCESSIBILITY_QUERY_PARAM = 'accessibility';

/** @typedef {'before' | 'after'} AccessibilityVersion */

/** @type {AccessibilityVersion} */
export const DEFAULT_ACCESSIBILITY_VERSION = 'after';

/**
 * @param {string | null | undefined} value
 * @returns {AccessibilityVersion}
 */
export function parseAccessibilityVersion(value) {
  return value === 'before' ? 'before' : DEFAULT_ACCESSIBILITY_VERSION;
}

/**
 * Read the comparison mode from the current URL query string.
 * Missing or invalid values fall back to "after".
 * @returns {AccessibilityVersion}
 */
export function getAccessibilityVersionFromLocation(location = window.location) {
  const params = new URLSearchParams(location.search);
  return parseAccessibilityVersion(params.get(ACCESSIBILITY_QUERY_PARAM));
}

/**
 * Persist the comparison mode in the URL without a reload (shareable links).
 * @param {AccessibilityVersion} version
 */
export function setAccessibilityVersionInLocation(version, history = window.history, location = window.location) {
  const url = new URL(location.href);
  url.searchParams.set(ACCESSIBILITY_QUERY_PARAM, version);
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
