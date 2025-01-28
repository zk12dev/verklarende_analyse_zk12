// page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Block from './Block';
import EditorModal from './EditorModal';
import PDFGenerator from './PDFGenerator';

const Home = () => {
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

  const generatePDF = PDFGenerator(blocks, additionalBlocks);

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
          <Block
            title="Hulpvraag"
            content={blocks['Hulpvraag']}
            onClick={() => {
              setSelectedBlock('Hulpvraag');
              setTempData(blocks['Hulpvraag']);
            }}
            style={{ width: '66%', backgroundColor: '#f7e4e4' }}
          />
          <Block
            title="Gegevens"
            content={`Datum: ${blocks.Gegevens.Datum}<br/>Voor: ${blocks.Gegevens.Voor || 'Voor not filled'}<br/>Opstellers: ${blocks.Gegevens.Opstellers || 'Opstellers not filled'}`}
            onClick={() => {
              setSelectedBlock('Gegevens');
              setTempData(blocks['Gegevens']);
            }}
            style={{ width: '33%', backgroundColor: '#f7e4e4' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {['Persoonsfactoren', 'Leergeschiedenis', 'Gezinsfactoren', 'Hulpverleningsgeschiedenis'].map(
            (block) => (
              <Block
                key={block}
                title={block}
                content={blocks[block]}
                onClick={() => {
                  setSelectedBlock(block);
                  setTempData(blocks[block]);
                }}
                style={{ flex: '1', backgroundColor: '#f4f7e4' }}
              />
            )
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Attitude en beleving', 'Strategie', 'Kennis'].map((block) => (
              <Block
                key={block}
                title={block}
                content={additionalBlocks[block]}
                onClick={() => {
                  setSelectedBlock(block);
                  setTempData(additionalBlocks[block]);
                }}
                style={{ backgroundColor: '#d3e4f7' }}
              />
            ))}
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Attitude en beleving omgeving', 'Benadering (strategie) omgeving', 'Kennis omgeving'].map(
              (block) => (
                <Block
                  key={block}
                  title={block}
                  content={additionalBlocks[block]}
                  onClick={() => {
                    setSelectedBlock(block);
                    setTempData(additionalBlocks[block]);
                  }}
                  style={{ backgroundColor: '#e4d3f7' }}
                />
              )
            )}
          </div>
        </div>

        <Block
          title="Klachtgedrag gerelateerd aan de hulpvraag"
          content={additionalBlocks['Klachtgedrag gerelateerd aan de hulpvraag']}
          onClick={() => {
            setSelectedBlock('Klachtgedrag gerelateerd aan de hulpvraag');
            setTempData(additionalBlocks['Klachtgedrag gerelateerd aan de hulpvraag']);
          }}
          style={{ marginTop: '20px', backgroundColor: '#e4f7d3' }}
        />

        <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Download PDF
        </button>

        {selectedBlock && (
          <EditorModal
            selectedBlock={selectedBlock}
            tempData={tempData}
            setTempData={setTempData}
            saveData={saveData}
            applyFormatting={applyFormatting}
            closeModal={() => setSelectedBlock(null)}
          />
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