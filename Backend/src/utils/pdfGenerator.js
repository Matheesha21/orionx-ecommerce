import fs from 'fs';
import path from 'path';

const QUOTATIONS_DIR = path.join(process.cwd(), 'backend', 'uploads', 'quotations');

const ensureQuotationsDir = () => {
  if (!fs.existsSync(QUOTATIONS_DIR)) {
    fs.mkdirSync(QUOTATIONS_DIR, { recursive: true });
  }
};

const escapePdfText = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const buildPdfContentStream = (quotation) => {
  const lines = [
    'ORIONX QUOTATION REQUEST CONFIRMATION',
    '',
    `Date: ${new Date().toLocaleDateString()}`,
    '',
    'CUSTOMER DETAILS:',
    `Name: ${quotation.firstName || ''} ${quotation.lastName || ''}`.trim(),
    `Email: ${quotation.email || ''}`,
    `Phone: ${quotation.phone || ''}`,
    `Company: ${quotation.company || 'N/A'}`,
    '',
    'QUOTATION DETAILS:',
    `Product: ${quotation.productsOfInterest || ''}`,
    `Quantity: ${quotation.quantity || ''}`,
    '',
    'ADDITIONAL DETAILS:',
    quotation.additionalDetails || 'None',
    '',
    'Thank you for your interest in ORIONX.',
    'Our sales team will review your request and contact you shortly.',
    '',
    'ORIONX Sales Team',
    'orionx2101@gmail.com',
    '+94 756498525',
    'Panagoda, Colombo, Sri Lanka',
  ];

  let y = 780;
  const parts = ['BT', '/F1 14 Tf', '50 790 Td'];

  for (let index = 0; index < lines.length; index += 1) {
    const line = escapePdfText(lines[index]);
    if (index === 0) {
      parts.push(`(${line}) Tj`);
      parts.push('0 -22 Td');
      y -= 22;
      continue;
    }

    if (line === '') {
      parts.push('0 -12 Td');
      y -= 12;
      continue;
    }

    parts.push(`/F1 ${index < 5 ? 12 : 10} Tf`);
    parts.push(`(${line}) Tj`);
    parts.push('0 -14 Td');
    y -= 14;

    if (y < 60) {
      break;
    }
  }

  parts.push('ET');
  return parts.join('\n');
};

const buildMinimalPdf = (quotation) => {
  const contentStream = buildPdfContentStream(quotation);
  const contentLength = Buffer.byteLength(contentStream, 'utf8');

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n',
    `5 0 obj << /Length ${contentLength} >> stream\n${contentStream}\nendstream endobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = ['0000000000 65535 f \n'];
  let currentOffset = Buffer.byteLength(pdf, 'utf8');

  for (const object of objects) {
    offsets.push(`${String(currentOffset).padStart(10, '0')} 00000 n \n`);
    pdf += object;
    currentOffset += Buffer.byteLength(object, 'utf8');
  }

  const xrefOffset = currentOffset;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += offsets.join('');
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
};

export const generateQuotationPdf = async (quotation) => {
  ensureQuotationsDir();

  const id = quotation._id || new Date().getTime();
  const outPath = path.join(QUOTATIONS_DIR, `quotation_${id}.pdf`);
  const pdfBytes = buildMinimalPdf(quotation);
  fs.writeFileSync(outPath, pdfBytes);
  return outPath;
};

export const getQuotationPdfPath = (id) => {
  const p = path.join(QUOTATIONS_DIR, `quotation_${id}.pdf`);
  return fs.existsSync(p) ? p : null;
};
