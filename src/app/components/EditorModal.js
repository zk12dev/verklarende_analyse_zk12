import React from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';

const EditorModal = ({
  selectedBlock,
  tempData,
  setTempData,
  saveData,
  applyFormatting,
  closeModal,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%', // Larger width for the modal
        height: '60%', // Larger height for the modal
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden', // Prevent overflow
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Edit {selectedBlock}</h2>

      <textarea
        value={tempData}
        onChange={(e) => setTempData(e.target.value)}
        style={{
          width: '100%',
          height: '70%', // Increased height for text area
          border: '1px solid #ccc',
          padding: '10px',
          overflowY: 'auto', // Enable vertical scrolling
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5',
          resize: 'none', // Prevent resizing
        }}
      />

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => applyFormatting('bold')} title="Bold">
          <FaBold />
        </button>
        <button onClick={() => applyFormatting('italic')} title="Italic">
          <FaItalic />
        </button>
        <button onClick={() => applyFormatting('underline')} title="Underline">
          <FaUnderline />
        </button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={saveData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#DC3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditorModal;
