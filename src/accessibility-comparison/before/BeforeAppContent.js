import React from 'react';
import dancerImage from '../../images/dancer.png';
import BeforeNameForm from './BeforeNameForm';

/**
 * Pre-accessibility App chrome reconstructed from commit 8a47751.
 * Shares submit handler / loading / result state with the after variant.
 */
const BeforeAppContent = ({ onFormSubmit, loading, hipHopName }) => {
  const goToWikipedia = () => {
    window.location.href = 'https://en.wikipedia.org/wiki/Hip_hop_artists';
  };

  return (
    <div className="container">
      <h3>Hip Hop Name Generator</h3>
      <h1>
        Unhappy with how your friends or colleagues call you? Looking for a cool name based on
        your real one?
      </h1>
      {/* Intentionally non-keyboard / non-semantic link: pre-accessibility markup. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span className="link" onClick={goToWikipedia}>
        Link: check out the names of hip hop artists on wikipedia
      </span>
      <br></br>
      {/* Intentionally missing alt text: reproduces pre-accessibility markup. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={dancerImage} style={{ width: '200px' }} />
      <BeforeNameForm onFormSubmit={onFormSubmit} />
      {loading ? (
        <p>Loading...</p>
      ) : hipHopName !== null ? (
        <p>Your hip hop name is: {hipHopName}</p>
      ) : (
        <p>API not available</p>
      )}
    </div>
  );
};

export default BeforeAppContent;
