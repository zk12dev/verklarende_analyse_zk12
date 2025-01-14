import React from 'react';

const DraggableContainer = ({ id, children, onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const draggedId = e.dataTransfer.getData('text/plain');
        onDrop(draggedId, id);
      }}
      style={{ cursor: 'grab', display: 'inline-block', width: '100%' }}
    >
      {children}
    </div>
  );
};

export default DraggableContainer;
