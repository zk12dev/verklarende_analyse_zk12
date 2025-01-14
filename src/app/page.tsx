'use client';
import React, { useState, useEffect } from 'react';
import DraggableContainer from './components/DraggableContainer';
import Block from './components/Block';
import EditorModal from './components/EditorModal';
import PDFGenerator from './components/PDFGenerator';

const Home = () => {
  const [blocks, setBlocks] = useState([
    { id: 'Hulpvraag', title: 'Hulpvraag', content: '' },
    { id: 'Gegevens', title: 'Gegevens', content: 'Datum: ...<br/>Voor: ...<br/>Opstellers: ...' },
    { id: 'Persoonsfactoren', title: 'Persoonsfactoren', content: '' },
    { id: 'Leergeschiedenis', title: 'Leergeschiedenis', content: '' },
    { id: 'Gezinsfactoren', title: 'Gezinsfactoren', content: '' },
    { id: 'Hulpverleningsgeschiedenis', title: 'Hulpverleningsgeschiedenis', content: '' },
    { id: 'AttitudeBeleving', title: 'Attitude en beleving', content: '' },
    { id: 'Strategie', title: 'Strategie', content: '' },
    { id: 'Kennis', title: 'Kennis', content: '' },
    { id: 'AttitudeOmgeving', title: 'Attitude en beleving omgeving', content: '' },
    { id: 'BenaderingOmgeving', title: 'Benadering (strategie) omgeving', content: '' },
    { id: 'KennisOmgeving', title: 'Kennis omgeving', content: '' },
    { id: 'Klachtgedrag', title: 'Klachtgedrag gerelateerd aan de hulpvraag', content: '' },
  ]);

  const [row1, setRow1] = useState(['Hulpvraag', 'Gegevens']);
  const [row2, setRow2] = useState([
    'Persoonsfactoren',
    'Leergeschiedenis',
    'Gezinsfactoren',
    'Hulpverleningsgeschiedenis',
  ]);
  const [column1, setColumn1] = useState(['AttitudeBeleving', 'Strategie', 'Kennis']);
  const [column2, setColumn2] = useState(['AttitudeOmgeving', 'BenaderingOmgeving', 'KennisOmgeving']);
  const [bottomBlock, setBottomBlock] = useState(['Klachtgedrag']);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [tempData, setTempData] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === 'Gegevens' ? { ...block, content: `Datum: ${formattedDate}<br/>Voor: ...<br/>Opstellers: ...` } : block
      )
    );
  }, []);

  const handleDrop = (draggedId, targetId, row, setRow) => {
    const draggedIndex = row.findIndex((id) => id === draggedId);
    const targetIndex = row.findIndex((id) => id === targetId);

    if (draggedIndex >= 0 && targetIndex >= 0) {
      const reorderedRow = [...row];
      const [movedBlock] = reorderedRow.splice(draggedIndex, 1);
      reorderedRow.splice(targetIndex, 0, movedBlock);
      setRow(reorderedRow);
    }
  };

  const saveData = () => {
    if (selectedBlock) {
      setBlocks((prev) =>
        prev.map((block) => (block.id === selectedBlock ? { ...block, content: tempData } : block))
      );
      setSelectedBlock(null);
      setTempData('');
    }
  };

  const getBlockById = (id) => blocks.find((block) => block.id === id);

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
          <li>Blokken herschikken</li>
          <li>Relaties aangeven</li>
        </ul>
      </aside>

      <main style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Zorgkracht 12 App</h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          {row1.map((id) => {
            const block = getBlockById(id);
            if (!block) return null;
            return (
              <DraggableContainer
                key={id}
                id={id}
                onDrop={(draggedId, targetId) => handleDrop(draggedId, targetId, row1, setRow1)}
              >
                <Block
                  title={block.title}
                  content={block.content}
                  onClick={() => {
                    setSelectedBlock(id);
                    setTempData(block.content);
                  }}
                  style={{ width: '50%', backgroundColor: '#f7e4e4' }}
                />
              </DraggableContainer>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {row2.map((id) => {
            const block = getBlockById(id);
            if (!block) return null;
            return (
              <DraggableContainer
                key={id}
                id={id}
                onDrop={(draggedId, targetId) => handleDrop(draggedId, targetId, row2, setRow2)}
              >
                <Block
                  title={block.title}
                  content={block.content}
                  onClick={() => {
                    setSelectedBlock(id);
                    setTempData(block.content);
                  }}
                  style={{ flex: '1', backgroundColor: '#f4f7e4' }}
                />
              </DraggableContainer>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {column1.map((id) => {
              const block = getBlockById(id);
              if (!block) return null;
              return (
                <DraggableContainer
                  key={id}
                  id={id}
                  onDrop={(draggedId, targetId) => handleDrop(draggedId, targetId, column1, setColumn1)}
                >
                  <Block
                    title={block.title}
                    content={block.content}
                    onClick={() => {
                      setSelectedBlock(id);
                      setTempData(block.content);
                    }}
                    style={{ backgroundColor: '#d3e4f7' }}
                  />
                </DraggableContainer>
              );
            })}
          </div>

          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {column2.map((id) => {
              const block = getBlockById(id);
              if (!block) return null;
              return (
                <DraggableContainer
                  key={id}
                  id={id}
                  onDrop={(draggedId, targetId) => handleDrop(draggedId, targetId, column2, setColumn2)}
                >
                  <Block
                    title={block.title}
                    content={block.content}
                    onClick={() => {
                      setSelectedBlock(id);
                      setTempData(block.content);
                    }}
                    style={{ backgroundColor: '#e4d3f7' }}
                  />
                </DraggableContainer>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          {bottomBlock.map((id) => {
            const block = getBlockById(id);
            if (!block) return null;
            return (
              <DraggableContainer
                key={id}
                id={id}
                onDrop={(draggedId, targetId) => handleDrop(draggedId, targetId, bottomBlock, setBottomBlock)}
              >
                <Block
                  title={block.title}
                  content={block.content}
                  onClick={() => {
                    setSelectedBlock(id);
                    setTempData(block.content);
                  }}
                  style={{ backgroundColor: '#e4f7d3' }}
                />
              </DraggableContainer>
            );
          })}
        </div>

        {selectedBlock && (
          <EditorModal
            selectedBlock={selectedBlock}
            tempData={tempData}
            setTempData={setTempData}
            saveData={saveData}
            closeModal={() => setSelectedBlock(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
