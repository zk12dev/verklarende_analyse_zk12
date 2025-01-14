// Block.js
import React from 'react';

const Block = ({ title, content, onClick, style }) => {
  return (
    <div
      style={{ border: '1px solid #ccc', padding: '10px', ...style }}
      onClick={onClick}
    >
      <strong>{title}</strong>
      <div dangerouslySetInnerHTML={{ __html: content || 'Klik om te bewerken' }}></div>
    </div>
  );
};

export default Block;
