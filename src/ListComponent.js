import React, { useState, useEffect, useRef } from 'react';

const ListComponent = ({ options, selectedOption, onSelect }) => {
  const listRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && focusedIndex < options.length - 1) {
        event.preventDefault();
        setFocusedIndex((prev) => prev + 1);
      } else if (event.key === 'ArrowUp' && focusedIndex > 0) {
        event.preventDefault();
        setFocusedIndex((prev) => prev - 1);
      } else if (event.key === 'Enter') {
        onSelect(options[focusedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options, onSelect, focusedIndex]);

  useEffect(() => {
    if (listRef.current) {
      const listItems = listRef.current.querySelectorAll('li');
      listItems[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const handleItemClick = (option, index) => {
    setFocusedIndex(index);
    onSelect(option);
  };

  return (
    <ul ref={listRef}>
      {options.map((option, index) => (
        <li
          key={option}
          onClick={() => handleItemClick(option, index)}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={index === focusedIndex ? '0' : '-1'}
          aria-selected={selectedOption === option ? 'true' : 'false'}
        >
          {option}
        </li>
      ))}
    </ul>
  );
};

export default ListComponent;
