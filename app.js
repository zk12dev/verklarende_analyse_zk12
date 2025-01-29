'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import Xarrow, { Xwrapper } from 'react-xarrows'; // <-- For arrows

/** Returns a random pastel color. */
function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  // 70% saturation, 85% lightness => generally readable pastel
  return `hsl(${hue}, 70%, 85%)`;
}

const Home = () => {
  // -------------------- Block Data --------------------
  const [blocks, setBlocks] = useState({
    Hulpvraag: '',
    Gegevens: { Datum: '', Voor: '', Opstellers: '' },
    Persoonfactoren: '',
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

  // Because you want “Persoonfactoren”, “Leergeschiedenis”, “Gezinsfactoren”,
  // and “Hulpverleningsgeschiedenis” in a *single row* below “Hulpvraag/Gegevens,”
  // we'll treat them as pinned (but you could also make them draggable if desired).
  // We'll remove them from the "leftColumn" or "rightColumn".
  // For the two main columns, we only keep “Attitude en beleving”, “Strategie”, “Kennis” in left,
  // and “Attitude en beleving omgeving”, “Benadering (strategie) omgeving”, “Kennis omgeving” in right.

  // These two arrays hold the blocks for the main two columns:
  const [leftColumn, setLeftColumn] = useState([
    { id: 'Attitude en beleving', from: 'additionalBlocks' },
    { id: 'Strategie', from: 'additionalBlocks' },
    { id: 'Kennis', from: 'additionalBlocks' },
  ]);

  const [rightColumn, setRightColumn] = useState([
    { id: 'Attitude en beleving omgeving', from: 'additionalBlocks' },
    { id: 'Benadering (strategie) omgeving', from: 'additionalBlocks' },
    { id: 'Kennis omgeving', from: 'additionalBlocks' },
  ]);

  // Pastel colors for blocks
  const [blockColors, setBlockColors] = useState({});

  // On mount, set date & assign random colors
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setBlocks((prev) => ({
      ...prev,
      Gegevens: { ...prev.Gegevens, Datum: formattedDate },
    }));

    // Generate pastel colors for each relevant block ID
    // (including pinned row block IDs).
    const allBlockIds = [
      // Pinned top row
      'Hulpvraag',
      'Gegevens',
      // Pinned second row
      'Persoonfactoren',
      'Leergeschiedenis',
      'Gezinsfactoren',
      'Hulpverleningsgeschiedenis',
      // Left column
      ...leftColumn.map((b) => b.id),
      // Right column
      ...rightColumn.map((b) => b.id),
      // Bottom pinned
      'Klachtgedrag gerelateerd aan de hulpvraag',
    ];

    const colorMap = {};
    allBlockIds.forEach((id) => {
      colorMap[id] = getRandomPastelColor();
    });
    setBlockColors(colorMap);
  }, []);

  // ------------------ Drag-and-Drop for the two columns ------------------
  const [draggingId, setDraggingId] = useState(null);
  const [draggingColumn, setDraggingColumn] = useState(null);

  const handleDragStart = (blockId, column) => {
    setDraggingId(blockId);
    setDraggingColumn(column);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (targetId, targetColumn) => {
    if (!draggingId || draggingColumn !== targetColumn) return;
    const columnArray = targetColumn === 'left' ? [...leftColumn] : [...rightColumn];
    const fromIndex = columnArray.findIndex((b) => b.id === draggingId);
    const toIndex = columnArray.findIndex((b) => b.id === targetId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      setDraggingId(null);
      return;
    }
    // Swap
    [columnArray[fromIndex], columnArray[toIndex]] = [columnArray[toIndex], columnArray[fromIndex]];
    if (targetColumn === 'left') setLeftColumn(columnArray);
    else setRightColumn(columnArray);
    setDraggingId(null);
  };

  // ------------------ Modal Editing ------------------
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [tempData, setTempData] = useState('');
  const editableRef = useRef(null);

  const handleBlockClick = (blockName, isGegevens = false) => {
    setSelectedBlock(blockName);
    if (isGegevens) {
      setTempData(JSON.stringify(blocks.Gegevens, null, 2));
    } else if (blockName in blocks) {
      setTempData(blocks[blockName] || '');
    } else {
      setTempData(additionalBlocks[blockName] || '');
    }
  };

  // Load content into the modal’s contentEditable
  useEffect(() => {
    if (selectedBlock && editableRef.current) {
      editableRef.current.innerHTML = tempData;
    }
  }, [selectedBlock, tempData]);

  // Save data from the modal
  const saveData = () => {
    if (!selectedBlock || !editableRef.current) return;
    const newHtml = editableRef.current.innerHTML;
    if (selectedBlock === 'Gegevens') {
      try {
        const parsed = JSON.parse(newHtml);
        setBlocks((prev) => ({
          ...prev,
          Gegevens: { ...prev.Gegevens, ...parsed },
        }));
      } catch {
        alert('Ongeldig JSON-formaat voor Gegevens');
      }
    } else if (selectedBlock in blocks) {
      setBlocks((prev) => ({ ...prev, [selectedBlock]: newHtml }));
    } else {
      setAdditionalBlocks((prev) => ({ ...prev, [selectedBlock]: newHtml }));
    }
    setSelectedBlock(null);
    setTempData('');
  };

  // Rich text formatting
  const applyFormatting = (format) => {
    let selection = window.getSelection();
    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (!range) return;
    const span = document.createElement('span');
    if (format === 'bold') {
      span.style.fontWeight = 'bold';
    } else if (format === 'italic') {
      span.style.fontStyle = 'italic';
    } else if (format === 'underline') {
      span.style.textDecoration = 'underline';
    }
    range.surroundContents(span);
  };

  // ------------------ Arrows Using react-xarrows ------------------
  const [arrowFrom, setArrowFrom] = useState(null);
  const [connections, setConnections] = useState([]);

  const handleAddArrowClick = (blockId) => {
    if (!arrowFrom) {
      // first click => set arrowFrom
      setArrowFrom(blockId);
    } else {
      // second click => create connection arrowFrom -> blockId
      if (arrowFrom !== blockId) {
        setConnections((prev) => [...prev, { from: arrowFrom, to: blockId }]);
      }
      setArrowFrom(null);
    }
  };

  const removeArrow = (index) => {
    setConnections((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------ PDF (Hide Button + Screenshot) ------------------
  const generatePDF = async () => {
    // Temporarily hide the PDF button so it doesn't appear in the screenshot
    const pdfButton = document.getElementById('pdf-button');
    if (pdfButton) pdfButton.style.visibility = 'hidden';

    const content = document.getElementById('printable-content');
    if (!content) return;

    // screenshot
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale image
    const imgAspectRatio = canvas.width / canvas.height;
    let renderWidth = pdfWidth;
    let renderHeight = pdfWidth / imgAspectRatio;
    if (renderHeight > pdfHeight) {
      renderHeight = pdfHeight;
      renderWidth = pdfHeight * imgAspectRatio;
    }
    pdf.addImage(imgData, 'PNG', 0, 0, renderWidth, renderHeight);
    pdf.save('blocks.pdf');

    // Show the button again
    if (pdfButton) pdfButton.style.visibility = 'visible';
  };

  // ------------------ Render Helpers ------------------
  const blockStyle = {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    border: '1px solid #ccc',
    padding: '10px',
    cursor: 'move',
    marginBottom: '40px',
    minHeight: '80px',
    minWidth: '220px',
    position: 'relative',
  };

  const pinnedBlockStyle = {
    ...blockStyle,
    cursor: 'default', // pinned blocks aren't draggable in this example
  };

  const renderDraggableBlock = (blockObj, column) => {
    const { id, from } = blockObj;
    const content = from === 'blocks' ? blocks[id] || '' : additionalBlocks[id] || '';
    return (
      <div
        key={id}
        id={id} // for Xarrow
        draggable
        onDragStart={() => handleDragStart(id, column)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(id, column)}
        style={{
          ...blockStyle,
          backgroundColor: blockColors[id] || '#eee',
        }}
      >
        <strong>{id}</strong>
        <button
          style={{ float: 'right', fontSize: '0.8em' }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddArrowClick(id);
          }}
        >
          Pijl toevoegen
        </button>
        <div
          onClick={() => handleBlockClick(id)}
          style={{ cursor: 'pointer' }}
          dangerouslySetInnerHTML={{ __html: content || 'Klik om aan te passen' }}
        />
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <Xwrapper>
        {/* We wrap everything in Xwrapper so Xarrow can track positions */}
        <div id="printable-content">
          <main style={{ padding: '20px' }}>
            <h1>Zorgkracht 12 Verklarende Analyse</h1>

            {/* 
              1) Pinned Top Row:
                 "Hulpvraag" (links) & "Gegevens" (rechts)
            */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
              {/* Hulpvraag */}
              <div
                id="Hulpvraag"
                style={{
                  ...pinnedBlockStyle,
                  width: '66%',
                  backgroundColor: '#f7e4e4',
                }}
              >
                <strong>Hulpvraag</strong>
                <button
                  style={{ float: 'right', fontSize: '0.8em', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddArrowClick('Hulpvraag');
                  }}
                >
                  Pijl toevoegen
                </button>
                <div
                  onClick={() => handleBlockClick('Hulpvraag')}
                  style={{ cursor: 'pointer' }}
                  dangerouslySetInnerHTML={{
                    __html: blocks.Hulpvraag || 'Klik om aan te passen',
                  }}
                />
              </div>

              {/* Gegevens */}
              <div
                id="Gegevens"
                style={{
                  ...pinnedBlockStyle,
                  width: '33%',
                  backgroundColor: '#f7e4e4',
                }}
              >
                <strong>Gegevens</strong>
                <button
                  style={{ float: 'right', fontSize: '0.8em', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddArrowClick('Gegevens');
                  }}
                >
                  Pijl toevoegen
                </button>
                <div onClick={() => handleBlockClick('Gegevens', true)} style={{ cursor: 'pointer' }}>
                  <div>{blocks.Gegevens.Datum}</div>
                  <div>{blocks.Gegevens.Voor || 'Voor niet ingevuld'}</div>
                  <div>{blocks.Gegevens.Opstellers || 'Opstellers niet ingevuld'}</div>
                </div>
              </div>
            </div>

            {/* 
              2) Second pinned row with 4 blocks:
                 "Persoonfactoren", "Leergeschiedenis", "Gezinsfactoren", "Hulpverleningsgeschiedenis"
                 all in one row
            */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
              {['Persoonfactoren', 'Leergeschiedenis', 'Gezinsfactoren', 'Hulpverleningsgeschiedenis'].map(
                (id) => {
                  return (
                    <div
                      key={id}
                      id={id}
                      style={{
                        ...pinnedBlockStyle,
                        backgroundColor: blockColors[id] || '#eee',
                        width: '25%', // 4 blocks in one row
                      }}
                    >
                      <strong>{id}</strong>
                      <button
                        style={{ float: 'right', fontSize: '0.8em', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddArrowClick(id);
                        }}
                      >
                        Pijl toevoegen
                      </button>
                      <div
                        onClick={() => handleBlockClick(id)}
                        style={{ cursor: 'pointer' }}
                        dangerouslySetInnerHTML={{
                          __html: blocks[id] || 'Klik om aan te passen',
                        }}
                      />
                    </div>
                  );
                }
              )}
            </div>

            {/* 3) Two columns below */}
            <div style={{ display: 'flex', gap: '80px', marginBottom: '50px' }}>
              {/* Left column */}
              <div style={{ flex: '1' }}>
                {leftColumn.map((blockObj) => renderDraggableBlock(blockObj, 'left'))}
              </div>

              {/* Right column */}
              <div style={{ flex: '1' }}>
                {rightColumn.map((blockObj) => renderDraggableBlock(blockObj, 'right'))}
              </div>
            </div>

            {/* 4) Bottom pinned block: "Klachtgedrag gerelateerd aan de hulpvraag" */}
            <div
              id="Klachtgedrag gerelateerd aan de hulpvraag"
              style={{
                ...pinnedBlockStyle,
                backgroundColor: '#e4f7d3',
                marginBottom: '60px',
              }}
            >
              <strong>Klachtgedrag gerelateerd aan de hulpvraag</strong>
              <button
                style={{ float: 'right', fontSize: '0.8em', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddArrowClick('Klachtgedrag gerelateerd aan de hulpvraag');
                }}
              >
                Pijl toevoegen
              </button>
              <div
                onClick={() => handleBlockClick('Klachtgedrag gerelateerd aan de hulpvraag')}
                style={{ cursor: 'pointer' }}
                dangerouslySetInnerHTML={{
                  __html:
                    additionalBlocks['Klachtgedrag gerelateerd aan de hulpvraag'] ||
                    'Klik om aan te passen',
                }}
              />
            </div>

            {/* 5) PDF Button (hidden during screenshot) */}
            <button
              id="pdf-button"
              onClick={generatePDF}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#fa8072',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              PDF Afdrukken
            </button>
          </main>

          {/* 
            Arrows with <Xarrow>. We pass a "middleLabel" that says "Verwijder pijl"
            to let the user remove them.
          */}
          {connections.map((conn, i) => (
            <Xarrow
              key={i}
              start={conn.from}
              end={conn.to}
              color="red"
              strokeWidth={2}
              showHead={true}
              headSize={6}
              startAnchor="auto"
              endAnchor="auto"
              middleLabel={
                <div
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid red',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => removeArrow(i)}
                >
                  Verwijder pijl
                </div>
              }
            />
          ))}
        </div>
      </Xwrapper>

      {/* Modal (Bewerken) */}
      {selectedBlock && (
        <>
          {/* Modal Overlay */}
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
          />

          {/* Modal Content */}
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
              width: '500px',
              maxWidth: '90%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            <h2>Bewerk: {selectedBlock}</h2>
            <div
              id="editableArea"
              ref={editableRef}
              contentEditable
              style={{
                width: '100%',
                height: '100px',
                border: '1px solid #ccc',
                padding: '5px',
                overflow: 'auto',
                borderRadius: '4px',
              }}
            />
            <br />
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => applyFormatting('bold')}>
                <FaBold />
              </button>
              <button onClick={() => applyFormatting('italic')} style={{ marginLeft: '10px' }}>
                <FaItalic />
              </button>
              <button onClick={() => applyFormatting('underline')} style={{ marginLeft: '10px' }}>
                <FaUnderline />
              </button>
            </div>
            <br />
            <button
              onClick={saveData}
              style={{
                backgroundColor: '#4caf50',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Opslaan
            </button>
            <button
              onClick={() => setSelectedBlock(null)}
              style={{
                backgroundColor: '#aaa',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Annuleren
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
=======
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Serve static files
  server.use('/static', express.static(path.join(__dirname, 'public')));

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
