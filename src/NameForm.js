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
      Real Name:
      <input type="text" value={name} onChange={handleChange} style={{ marginLeft: '8px', verticalAlign: 'middle' }} tabIndex="-1"/>
      <br></br>

      <br />
      Further Information:
      <textarea value={additionalInfo} onChange={handleInfoChange} style={{ marginLeft: '8px', verticalAlign: 'middle' }} tabIndex="2" />
      <br />
      <br></br>
       Choose a prefix if you want one:
      <select value={prefix} onChange={handlePrefixChange} >
        <option value="">-- No prefix --</option>
        <option value="Lil">Option 1</option>
        <option value="MC">Option 2</option>
        <option value="DJ">Option 3</option>
        <option value="DR">Option 4</option>
        <option value="BIG">Option 5</option>
      </select>
      <br />
      <br></br>

      <button type="submit" tabIndex="-1">Submit Form</button>
    </form>
  );
};

export default NameForm;