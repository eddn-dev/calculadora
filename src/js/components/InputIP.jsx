import React from 'react'; 
 
function InputIP({ value, onChange }) { 
  return ( 
    <div> 
      <label>Dirección IP:</label> 
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      /> 
    </div> 
  ); 
} 
 
export default InputIP;