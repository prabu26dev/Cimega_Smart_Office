const fs = require('fs');
const path = require('path');

// Library imports (assuming nodeIntegration is true in Electron)
const pdfMake = require('pdfmake');
const docx = require('docx');
const ExcelJS = require('exceljs');

/**
 * CIMEGA SMART OFFICE - DOCUMENT GENERATOR
 * Lokasi: src/services/document_service.js
 * Deskripsi: Utility untuk generate PDF, Word, dan Excel menggunakan font standar offline (Arial & Times New Roman)
 */
window.DocumentService = {
  getFontPaths: function () {
    const fontsDir = path.join(__dirname, '..', 'assets', 'fonts');
    return {
      Arial: {
        normal: path.join(fontsDir, 'Arial-Regular.ttf'),
        bold: path.join(fontsDir, 'Arial-Bold.ttf'),
        italics: path.join(fontsDir, 'Arial-Italic.ttf'),
        bolditalics: path.join(fontsDir, 'Arial-BoldItalic.ttf')
      },
      'Times New Roman': {
        normal: path.join(fontsDir, 'TimesNewRoman-Regular.ttf'),
        bold: path.join(fontsDir, 'TimesNewRoman-Bold.ttf'),
        italics: path.join(fontsDir, 'TimesNewRoman-Italic.ttf'),
        bolditalics: path.join(fontsDir, 'TimesNewRoman-BoldItalic.ttf')
      }
    };
  },

  /**
   * MENGHASILKAN PDF DENGAN PDFMAKE
   */
  generatePDF: async function (docDefinition, fontChoice = 'Arial', savePath) {
    return new Promise((resolve, reject) => {
      try {
        const fonts = this.getFontPaths();
        
        // Memastikan font pilihan tersedia, jika tidak fallback ke Arial
        if (!fonts[fontChoice]) {
          console.warn(`Font ${fontChoice} tidak ditemukan, fallback ke Arial.`);
          fontChoice = 'Arial';
        }

        const printer = new pdfMake(fonts);
        // Default style ke font yang dipilih
        if (!docDefinition.defaultStyle) docDefinition.defaultStyle = {};
        docDefinition.defaultStyle.font = fontChoice;

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const writeStream = fs.createWriteStream(savePath);
        
        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        writeStream.on('finish', () => resolve(true));
        writeStream.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * MENGHASILKAN WORD DENGAN DOCX
   */
  generateWord: async function (sections, fontChoice = 'Arial', savePath) {
    try {
      const doc = new docx.Document({
        styles: {
          default: {
            document: {
              run: {
                font: fontChoice,
                size: 24, // 12pt
              },
            },
          },
        },
        sections: sections
      });

      const buffer = await docx.Packer.toBuffer(doc);
      fs.writeFileSync(savePath, buffer);
      return true;
    } catch (err) {
      console.error('Word Generation Error:', err);
      throw err;
    }
  },

  /**
   * MENGHASILKAN EXCEL DENGAN EXCELJS
   */
  generateExcel: async function (columns, rows, fontChoice = 'Arial', savePath) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Laporan Cimega');

      worksheet.columns = columns;
      worksheet.addRows(rows);

      // Menerapkan styling font secara global pada sheet
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          // Standard style
          cell.font = { name: fontChoice, size: 11 };
          if (rowNumber === 1) { // Header row
            cell.font = { name: fontChoice, size: 12, bold: true };
          }
        });
      });

      await workbook.xlsx.writeFile(savePath);
      return true;
    } catch (err) {
      console.error('Excel Generation Error:', err);
      throw err;
    }
  }
};
