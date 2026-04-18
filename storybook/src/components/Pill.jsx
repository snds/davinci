import React from 'react';

function Pill({ children, variant, style }) {
  return (
    <span className={`pill ${variant ? 'pill--' + variant : ''}`} style={style}>
      {children}
    </span>
  );
}

export default Pill;
