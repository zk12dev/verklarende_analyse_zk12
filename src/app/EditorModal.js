// EditorModal.js
import React from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';


// TODO Kleuren aanpassen naar ZK12 kleuren ipv huidige kleuren.


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
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <h2>Edit {selectedBlock}</h2>
      <div
        id="editableArea"
        contentEditable
        style={{
          width: '100%',
          height: '100px',
          border: '1px solid #ccc',
          padding: '5px',
          overflow: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: tempData }}
        onInput={(e) => setTempData(e.currentTarget.innerHTML)}
      ></div>
      <br />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => applyFormatting('bold')}><FaBold /></button>
        <button onClick={() => applyFormatting('italic')} style={{ marginLeft: '10px' }}>
          <FaItalic />
        </button>
        <button onClick={() => applyFormatting('underline')} style={{ marginLeft: '10px' }}>
          <FaUnderline />
        </button>
      </div>
      <br />
      <button onClick={saveData} style={{ marginTop: '10px' }}>
        Save
      </button>
      <button onClick={closeModal} style={{ marginTop: '10px', marginLeft: '10px' }}>
        Cancel
      </button>
    </div>
  );
};

export default EditorModal;