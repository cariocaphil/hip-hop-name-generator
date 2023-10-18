import React, { useState } from 'react';
import NameForm from './NameForm';
import generateHipHopName from './HipHopName';
import dancerImage from './images/dancer.png'; // Import the image
import './styles.css'; // Import the CSS file


const App = () => {
  const [hipHopName, setHipHopName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (name, additionalInfo, prefix) => {
    setLoading(true);
    const hiphopName = await generateHipHopName(name, additionalInfo, prefix);
    setHipHopName(hiphopName);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Hip Hop Name Generator</h1>
      <h3>Unhappy with how your friends or colleagues call you? Looking for a cool name based on your real one?</h3>
      <a href="https://en.wikipedia.org/wiki/Hip_hop_artists" className="link">
        Explore hip hop artist names on Wikipedia
      </a>
      <br></br>
      <img src={dancerImage} style={{ width: '200px' }} />
      <NameForm onFormSubmit={handleFormSubmit} />
      {loading ? <p>Loading...</p> : 
        (hipHopName !== null ? 
          <p>Your hip hop name is: {hipHopName}</p> :
          <p>API not available</p>
        )
      }
    </div>
  );
};

export default App;
