import React from 'react';

function InputMask({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="number"
        value={value}
        min="0"
        max="32"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default InputMask;
