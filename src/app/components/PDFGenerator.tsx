// PDFGenerator.js
import jsPDF from 'jspdf';

const PDFGenerator = (blocks, additionalBlocks) => {
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
        doc.text(value || 'No data provided', 10, yPosition);
        yPosition += 10;
      }
      yPosition += 10;
    });

    Object.entries(additionalBlocks).forEach(([key, value]) => {
      doc.text(`${key}:`, 10, yPosition);
      yPosition += 10;
      doc.text(value || 'No data provided', 10, yPosition);
      yPosition += 10;
    });

    doc.save('blocks.pdf');
  };

  return generatePDF;
};

export default PDFGenerator;
