import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const QUOTATIONS_DIR = path.join(process.cwd(), 'backend', 'uploads', 'quotations');

export const ensureQuotationsDir = () => {
  if (!fs.existsSync(QUOTATIONS_DIR)) {
    fs.mkdirSync(QUOTATIONS_DIR, { recursive: true });
  }
};

// Convert DOCX letterhead (frontend/public/Letterheadformat.docx) to PDF using LibreOffice
const convertDocxToPdf = (docxPath) => {
  try {
    const outDir = path.dirname(docxPath);
    const result = spawnSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', outDir, docxPath], {
      stdio: 'ignore',
      timeout: 20000,
    });

    const baseName = path.basename(docxPath, path.extname(docxPath));
    const generatedPdf = path.join(outDir, `${baseName}.pdf`);

    if (fs.existsSync(generatedPdf)) {
      return generatedPdf;
    }
  } catch (err) {
    console.warn('LibreOffice conversion failed:', err?.message || err);
  }

  return null;
};

// Overlay quotation details onto a PDF (letterhead) or create a new PDF if no template
export const generateQuotationPdf = async (quotation) => {
  ensureQuotationsDir();

  const id = quotation._id || new Date().getTime();
  const outPath = path.join(QUOTATIONS_DIR, `quotation_${id}.pdf`);

  // Try to use letterhead template from frontend/public
  const docxTemplate = path.join(process.cwd(), 'frontend', 'public', 'Letterheadformat.docx');
  let basePdfPath = null;

  if (fs.existsSync(docxTemplate)) {
    basePdfPath = convertDocxToPdf(docxTemplate);
  }

  if (basePdfPath && fs.existsSync(basePdfPath)) {
    // Load the base PDF and add text
    const existingPdfBytes = fs.readFileSync(basePdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const marginLeft = 40;
    let y = height - 120;

    firstPage.drawText(`${quotation.firstName || ''} ${quotation.lastName || ''}`, {
      x: marginLeft,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 16;
    firstPage.drawText(`${quotation.company || ''}`, { x: marginLeft, y, size: fontSize, font });
    y -= 16;
    firstPage.drawText(`${quotation.email || ''} • ${quotation.phone || ''}`, { x: marginLeft, y, size: fontSize, font });

    y -= 26;
    firstPage.drawText('Product / Service:', { x: marginLeft, y, size: fontSize, font });
    firstPage.drawText(String(quotation.productsOfInterest || ''), { x: marginLeft + 100, y, size: fontSize, font });

    y -= 16;
    firstPage.drawText('Quantity:', { x: marginLeft, y, size: fontSize, font });
    firstPage.drawText(String(quotation.quantity || ''), { x: marginLeft + 100, y, size: fontSize, font });

    y -= 26;
    firstPage.drawText('Additional Details:', { x: marginLeft, y, size: fontSize, font });
    const details = (quotation.additionalDetails || '').toString();
    const wrapped = font.splitTextToSize ? font.splitTextToSize(details, 400) : [details];
    // pdf-lib doesn't provide splitTextToSize on font; fallback to simple drawing
    firstPage.drawText(details, { x: marginLeft, y: y - 12, size: 10, font });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outPath, pdfBytes);
    return outPath;
  }

  // If no template, create a fresh PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('ORIONX', { x: 40, y: height - 40, size: 18, font });
  page.drawText('Panagoda, Colombo, Sri Lanka', { x: 40, y: height - 56, size: 10, font });
  page.drawText(`Email: orionx2101@gmail.com | Phone: +94 756498525`, { x: 40, y: height - 70, size: 10, font });

  let y = height - 110;
  page.drawText(`Quotation Date: ${new Date().toLocaleDateString()}`, { x: 420, y, size: 10, font });

  page.drawText('Customer Details:', { x: 40, y: y - 24, size: 11, font });
  page.drawText(`${quotation.firstName || ''} ${quotation.lastName || ''}`, { x: 40, y: y - 40, size: 10, font });
  page.drawText(`${quotation.company || ''}`, { x: 40, y: y - 56, size: 10, font });
  page.drawText(`${quotation.email || ''} • ${quotation.phone || ''}`, { x: 40, y: y - 72, size: 10, font });

  page.drawText('Product / Service:', { x: 40, y: y - 100, size: 11, font });
  page.drawText(String(quotation.productsOfInterest || ''), { x: 160, y: y - 100, size: 10, font });
  page.drawText('Quantity:', { x: 40, y: y - 116, size: 11, font });
  page.drawText(String(quotation.quantity || ''), { x: 160, y: y - 116, size: 10, font });

  page.drawText('Additional Details:', { x: 40, y: y - 140, size: 11, font });
  page.drawText((quotation.additionalDetails || '').toString(), { x: 40, y: y - 156, size: 10, font, maxWidth: 500 });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);
  return outPath;
};

export const getQuotationPdfPath = (id) => {
  const p = path.join(QUOTATIONS_DIR, `quotation_${id}.pdf`);
  return fs.existsSync(p) ? p : null;
};
