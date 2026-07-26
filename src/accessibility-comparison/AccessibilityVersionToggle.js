import React from 'react';
import { useAccessibilityVersion } from './AccessibilityVersionContext';

/**
 * Always-accessible control for switching demo versions.
 * Stays available even while the "before" UI is intentionally inaccessible.
 */
const AccessibilityVersionToggle = () => {
  const { accessibilityVersion, setAccessibilityVersion } = useAccessibilityVersion();

  return (
    <fieldset
      className="accessibility-version-toggle"
      style={{
        margin: '0 auto 1.25rem',
        maxWidth: '400px',
        padding: '0.75rem 1rem',
        border: '1px solid #666',
        borderRadius: '4px',
        fontSize: '0.875rem',
      }}
    >
      <legend style={{ padding: '0 0.35rem' }}>Demo comparison</legend>
      <p style={{ margin: '0 0 0.5rem', color: '#333' }}>
        Switch between the pre- and post-accessibility UI for review.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <input
            type="radio"
            name="accessibility-version"
            value="before"
            checked={accessibilityVersion === 'before'}
            onChange={() => setAccessibilityVersion('before')}
          />
          Before accessibility
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <input
            type="radio"
            name="accessibility-version"
            value="after"
            checked={accessibilityVersion === 'after'}
            onChange={() => setAccessibilityVersion('after')}
          />
          After accessibility
        </label>
      </div>
    </fieldset>
  );
};

export default AccessibilityVersionToggle;
