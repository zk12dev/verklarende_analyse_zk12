// PDFGenerator.js
import jsPDF from 'jspdf';

// TODO Print PDF moet er visueel uit zien zoals op het scherm.

const PDFGenerator = (blocks, additionalBlocks) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 10;

    Object.entries(blocks).forEach(([key, value]) => {
      doc.text(`${key}:`, 10, yPosition);
      yPosition += 10;
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          doc.text(`${subKey}: ${subValue || 'Niks ingevoerd.'}`, 10, yPosition);
          yPosition += 10;
        });
      } else {
        doc.text(value || 'Niks ingevoerd.', 10, yPosition);
        yPosition += 10;
      }
      yPosition += 10;
    });

    Object.entries(additionalBlocks).forEach(([key, value]) => {
      doc.text(`${key}:`, 10, yPosition);
      yPosition += 10;
      doc.text(value || 'Niks ingevoerd.', 10, yPosition);
      yPosition += 10;
    });

    doc.save('blocks.pdf');
  };

  return generatePDF;
};

export default PDFGenerator;
