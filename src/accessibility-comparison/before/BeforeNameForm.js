import React from 'react';

/**
 * Pre-accessibility NameForm reconstructed from commit 8a47751
 * (first parent of accessibility merge 8e7d343).
 */
const BeforeNameForm = ({ onFormSubmit }) => {
  const [name, setName] = React.useState('');
  const [additionalInfo, setAdditionalInfo] = React.useState('');
  const [prefix, setPrefix] = React.useState('Lil');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(name, additionalInfo, prefix);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      Real Name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginLeft: '8px', verticalAlign: 'middle' }}
        tabIndex="-1"
      />
      <br></br>

      <br />
      Further Information:
      <textarea
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        style={{ marginLeft: '8px', verticalAlign: 'middle' }}
        tabIndex="2"
      />
      <br />
      <br></br>
      Choose a prefix if you want one:
      <select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
        <option value="">-- No prefix --</option>
        <option value="Lil">Option 1</option>
        <option value="MC">Option 2</option>
        <option value="DJ">Option 3</option>
        <option value="DR">Option 4</option>
        <option value="BIG">Option 5</option>
      </select>
      <br />
      <br></br>

      <button type="submit" tabIndex="-1">
        Submit Form
      </button>
    </form>
  );
};

export default BeforeNameForm;
