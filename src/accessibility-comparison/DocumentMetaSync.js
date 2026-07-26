import { useEffect } from 'react';
import { useAccessibilityVersion } from './AccessibilityVersionContext';

const AFTER_LANG = 'en';
const AFTER_TITLE = 'Hip Hop Name Generator';
/** Pre-merge index.html had no <title>; browsers fall back to the URL/filename. */
const BEFORE_TITLE = '';

/**
 * Reflects document-level accessibility fixes (lang + title) that lived in
 * public/index.html. index.html keeps the accessible defaults; this effect
 * temporarily mirrors the pre-merge document when "before" is selected.
 */
const DocumentMetaSync = () => {
  const { accessibilityVersion } = useAccessibilityVersion();

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.getAttribute('lang');
    const previousTitle = document.title;

    if (accessibilityVersion === 'before') {
      root.removeAttribute('lang');
      document.title = BEFORE_TITLE;
      document.body.dataset.accessibilityVersion = 'before';
    } else {
      root.setAttribute('lang', AFTER_LANG);
      document.title = AFTER_TITLE;
      document.body.dataset.accessibilityVersion = 'after';
    }

    return () => {
      if (previousLang === null) {
        root.removeAttribute('lang');
      } else {
        root.setAttribute('lang', previousLang);
      }
      document.title = previousTitle;
      delete document.body.dataset.accessibilityVersion;
    };
  }, [accessibilityVersion]);

  return null;
};

export default DocumentMetaSync;
