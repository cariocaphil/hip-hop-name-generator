import React, { useState } from 'react';
import ListComponent from './ListComponent';

const NameForm = ({ onFormSubmit }) => {
  const [name, setName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [prefix, setPrefix] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleInfoChange = (e) => {
    setAdditionalInfo(e.target.value);
  };

  const handlePrefixChange = (e) => {
    setPrefix(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(name, additionalInfo, prefix);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="name">Real Name:</label>
        <input type="text" id="name" value={name} onChange={handleChange} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="info">Further Information:</label>
        <textarea id="info" value={additionalInfo} onChange={handleInfoChange} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="prefix">Choose a prefix if you want one: </label>
        <ListComponent
          options={['Lil', 'MC', 'DJ', 'DR', 'BIG']}
          selectedOption={prefix}
          onSelect={(selected) => setPrefix(selected)}
      />
      </div>

      <button type="submit">Generate New Name</button>
    </form>
  );
};

export default NameForm;
