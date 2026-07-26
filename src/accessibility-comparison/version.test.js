import {
  ACCESSIBILITY_QUERY_PARAM,
  DEFAULT_ACCESSIBILITY_VERSION,
  getAccessibilityVersionFromLocation,
  parseAccessibilityVersion,
  setAccessibilityVersionInLocation,
} from './version';

describe('accessibility version helpers', () => {
  test('defaults missing or invalid values to after', () => {
    expect(parseAccessibilityVersion(null)).toBe('after');
    expect(parseAccessibilityVersion(undefined)).toBe('after');
    expect(parseAccessibilityVersion('')).toBe('after');
    expect(parseAccessibilityVersion('nope')).toBe('after');
    expect(parseAccessibilityVersion('before')).toBe('before');
    expect(DEFAULT_ACCESSIBILITY_VERSION).toBe('after');
  });

  test('reads and writes the accessibility query param without reload', () => {
    const location = {
      href: 'http://localhost/',
      search: '',
      pathname: '/',
      hash: '',
    };
    const history = {
      state: null,
      replaceState: jest.fn((state, _title, url) => {
        const next = new URL(url, 'http://localhost');
        location.href = next.href;
        location.search = next.search;
        location.pathname = next.pathname;
        location.hash = next.hash;
      }),
    };

    expect(getAccessibilityVersionFromLocation(location)).toBe('after');

    setAccessibilityVersionInLocation('before', history, location);
    expect(history.replaceState).toHaveBeenCalled();
    expect(getAccessibilityVersionFromLocation(location)).toBe('before');
    expect(location.search).toContain(`${ACCESSIBILITY_QUERY_PARAM}=before`);

    setAccessibilityVersionInLocation('after', history, location);
    expect(getAccessibilityVersionFromLocation(location)).toBe('after');
  });
});
