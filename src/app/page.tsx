'use client'
// Import necessary modules and libraries
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import jsPDF from 'jspdf';
import { FaBold, FaItalic, FaUnderline, FaArrowsAlt } from 'react-icons/fa';

const Home = () => {
  // Define state to manage data for each block
  const [blocks, setBlocks] = useState({
    Hulpvraag: '',
    Gegevens: { Datum: '', Voor: '', Opstellers: '' },
    Persoonsfactoren: '',
    Leergeschiedenis: '',
    Gezinsfactoren: '',
    Hulpverleningsgeschiedenis: '',
  });

  const [additionalBlocks, setAdditionalBlocks] = useState({
    'Attitude en beleving': '',
    Strategie: '',
    Kennis: '',
    'Attitude en beleving omgeving': '',
    'Benadering (strategie) omgeving': '',
    'Kennis omgeving': '',
    'Klachtgedrag gerelateerd aan de hulpvraag': '',
  });

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [tempData, setTempData] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setBlocks((prev) => ({
      ...prev,
      Gegevens: { ...prev.Gegevens, Datum: formattedDate },
    }));
  }, []);

  // Function to handle saving the data
  const saveData = () => {
    if (selectedBlock) {
      if (selectedBlock === 'Gegevens') {
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          Gegevens: { ...prevBlocks.Gegevens, ...tempData },
        }));
      } else {
        const targetBlocks = selectedBlock in blocks ? blocks : additionalBlocks;
        const setTargetBlocks = selectedBlock in blocks ? setBlocks : setAdditionalBlocks;
        setTargetBlocks((prevBlocks) => ({
          ...prevBlocks,
          [selectedBlock]: tempData,
        }));
      }
      setSelectedBlock(null);
      setTempData('');
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 10;

    Object.entries(blocks).forEach(([key, value]) => {
      doc.text(`${key}:`, 10, yPosition);
      yPosition += 10;
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          doc.text(`${subKey}: ${subValue || 'No data provided'}`, 10, yPosition);
          yPosition += 10;
        });
      } else {
        doc.html(value || 'No data provided', { x: 10, y: yPosition });
      }
      yPosition += 20;
    });

    Object.entries(additionalBlocks).forEach(([key, value]) => {
      doc.text(`${key}:`, 10, yPosition);
      yPosition += 10;
      doc.html(value || 'No data provided', { x: 10, y: yPosition });
      yPosition += 20;
    });

    doc.save('blocks.pdf');
  };

  // Function to apply formatting
  const applyFormatting = (format) => {
    let selection = window.getSelection();
    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range) {
      const span = document.createElement('span');
      if (format === 'bold') {
        span.style.fontWeight = 'bold';
      } else if (format === 'italic') {
        span.style.fontStyle = 'italic';
      } else if (format === 'underline') {
        span.style.textDecoration = 'underline';
      }
      range.surroundContents(span);
      setTempData(document.querySelector('#editableArea').innerHTML);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <aside
        style={{
          width: '200px',
          borderRight: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h3>Menu</h3>
        <ul>
          <li>Rearrange Blocks</li>
          <li>Draw Arrows</li>
        </ul>
      </aside>

      <main style={{ padding: '20px', flexGrow: 1 }}>
        <h1>React Next App: Editable Blocks</h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '66%',
              backgroundColor: '#f7e4e4',
            }}
            onClick={() => {
              setSelectedBlock('Hulpvraag');
              setTempData(blocks['Hulpvraag']);
            }}
          >
            <strong>Hulpvraag</strong>
            <div
              dangerouslySetInnerHTML={{ __html: blocks['Hulpvraag'] || 'Click to edit' }}
            ></div>
          </div>

          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '33%',
              backgroundColor: '#f7e4e4',
            }}
            onClick={() => {
              setSelectedBlock('Gegevens');
              setTempData(blocks['Gegevens']);
            }}
          >
            <strong>Gegevens</strong>
            <div>{blocks.Gegevens.Datum}</div>
            <div>{blocks.Gegevens.Voor || 'Voor not filled'}</div>
            <div>{blocks.Gegevens.Opstellers || 'Opstellers not filled'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {['Persoonsfactoren', 'Leergeschiedenis', 'Gezinsfactoren', 'Hulpverleningsgeschiedenis'].map(
            (block) => (
              <div
                key={block}
                style={{
                  flex: '1',
                  border: '1px solid #ccc',
                  padding: '10px',
                  backgroundColor: '#f4f7e4',
                }}
                onClick={() => {
                  setSelectedBlock(block);
                  setTempData(blocks[block]);
                }}
              >
                <strong>{block}</strong>
                <div
                  dangerouslySetInnerHTML={{ __html: blocks[block] || 'Click to edit' }}
                ></div>
              </div>
            )
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Attitude en beleving', 'Strategie', 'Kennis'].map((block) => (
              <div
                key={block}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  backgroundColor: '#d3e4f7',
                }}
                onClick={() => {
                  setSelectedBlock(block);
                  setTempData(additionalBlocks[block]);
                }}
              >
                <strong>{block}</strong>
                <div
                  dangerouslySetInnerHTML={{ __html: additionalBlocks[block] || 'Click to edit' }}
                ></div>
              </div>
            ))}
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Attitude en beleving omgeving', 'Benadering (strategie) omgeving', 'Kennis omgeving'].map(
              (block) => (
                <div
                  key={block}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    backgroundColor: '#e4d3f7',
                  }}
                  onClick={() => {
                    setSelectedBlock(block);
                    setTempData(additionalBlocks[block]);
                  }}
                >
                  <strong>{block}</strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: additionalBlocks[block] || 'Click to edit',
                    }}
                  ></div>
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '20px',
            backgroundColor: '#e4f7d3',
          }}
        >
          <strong>Klachtgedrag gerelateerd aan de hulpvraag</strong>
          <div
            dangerouslySetInnerHTML={{
              __html: additionalBlocks['Klachtgedrag gerelateerd aan de hulpvraag'] ||
                'Click to edit',
            }}
          ></div>
        </div>

        <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Download PDF
        </button>

        {selectedBlock && (
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
            <button
              onClick={() => setSelectedBlock(null)}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {selectedBlock && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setSelectedBlock(null)}
          ></div>
        )}
      </main>
    </div>
  );
};

export default Home;
