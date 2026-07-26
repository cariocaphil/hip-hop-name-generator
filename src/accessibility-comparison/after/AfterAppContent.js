import React from 'react';
import dancerImage from '../../images/dancer.png';
import AfterNameForm from './AfterNameForm';

/**
 * Current accessible App chrome (post accessibility-improvements merge).
 */
const AfterAppContent = ({ onFormSubmit, loading, hipHopName }) => {
  return (
    <div className="container">
      <h1>Hip Hop Name Generator</h1>
      <h2>
        Unhappy with how your friends or colleagues call you? Looking for a cool name based on
        your real one?
      </h2>
      <a href="https://en.wikipedia.org/wiki/Hip_hop_artists" className="link">
        Explore hip hop artist names on Wikipedia
      </a>
      <br></br>
      <img src={dancerImage} alt="Dancer Illustration" style={{ width: '200px' }} />
      <AfterNameForm onFormSubmit={onFormSubmit} />
      {loading ? (
        <p>Loading...</p>
      ) : hipHopName !== null ? (
        <p>Your hip hop name is: {hipHopName}</p>
      ) : (
        <p role="alert">API not available</p>
      )}
    </div>
  );
};

export default AfterAppContent;
