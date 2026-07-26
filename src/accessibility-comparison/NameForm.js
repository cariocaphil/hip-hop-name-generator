import React from 'react';
import { useAccessibilityVersion } from './AccessibilityVersionContext';
import AfterNameForm from './after/AfterNameForm';
import BeforeNameForm from './before/BeforeNameForm';

/**
 * Thin selector so callers can keep importing NameForm while the comparison
 * mode chooses the reconstructed before vs current after implementation.
 */
const NameForm = (props) => {
  const { accessibilityVersion } = useAccessibilityVersion();

  return accessibilityVersion === 'before' ? (
    <BeforeNameForm {...props} />
  ) : (
    <AfterNameForm {...props} />
  );
};

export default NameForm;
