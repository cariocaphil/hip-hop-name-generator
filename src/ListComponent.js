import React from 'react';

const ListComponent = ({ options, selectedOption, onSelect }) => {
  return (
    <ul>
      {options.map((option) => (
        <li key={option} onClick={() => onSelect(option)}>
          {option}
        </li>
      ))}
    </ul>
  );
};

export default ListComponent;