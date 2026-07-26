import React, { useState } from 'react';
import generateHipHopName from './HipHopName';
import './styles.css';
import {
  AccessibilityVersionProvider,
  useAccessibilityVersion,
} from './accessibility-comparison/AccessibilityVersionContext';
import AccessibilityVersionToggle from './accessibility-comparison/AccessibilityVersionToggle';
import DocumentMetaSync from './accessibility-comparison/DocumentMetaSync';
import AfterAppContent from './accessibility-comparison/after/AfterAppContent';
import BeforeAppContent from './accessibility-comparison/before/BeforeAppContent';

/**
 * Shared app state + API. Presentation is swapped by accessibility comparison mode.
 */
const AppShell = () => {
  const { accessibilityVersion } = useAccessibilityVersion();
  const [hipHopName, setHipHopName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (name, additionalInfo, prefix) => {
    setLoading(true);
    const nextName = await generateHipHopName(name, additionalInfo, prefix);
    setHipHopName(nextName);
    setLoading(false);
  };

  const contentProps = {
    onFormSubmit: handleFormSubmit,
    loading,
    hipHopName,
  };

  return (
    <>
      <DocumentMetaSync />
      <AccessibilityVersionToggle />
      {accessibilityVersion === 'before' ? (
        <BeforeAppContent {...contentProps} />
      ) : (
        <AfterAppContent {...contentProps} />
      )}
    </>
  );
};

const App = () => (
  <AccessibilityVersionProvider>
    <AppShell />
  </AccessibilityVersionProvider>
);

export default App;
