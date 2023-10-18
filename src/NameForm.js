import React, { useState } from 'react';

const NameForm = ({ onFormSubmit }) => {
  const [name, setName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [prefix, setPrefix] = useState('Lil');

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
        <select id="prefix" value={prefix} onChange={handlePrefixChange} >
          <option value="">-- No prefix --</option>
          <option value="Lil">Lil</option>
          <option value="MC">MC</option>
          <option value="DJ">DJ</option>
          <option value="DR">DR</option>
          <option value="BIG">BIG</option>
        </select>
      </div>

      <button type="submit">Generate New Name</button>
    </form>
  );
};

export default NameForm;
