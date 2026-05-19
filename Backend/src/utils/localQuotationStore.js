import fs from 'fs';
import path from 'path';

const QUOTATIONS_FILE = path.join(process.cwd(), 'backend', 'uploads', 'quotations.json');

const ensureStore = () => {
  const dir = path.dirname(QUOTATIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(QUOTATIONS_FILE)) {
    fs.writeFileSync(QUOTATIONS_FILE, JSON.stringify([]), 'utf8');
  }
};

const readAll = () => {
  ensureStore();
  try {
    const raw = fs.readFileSync(QUOTATIONS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
};

const writeAll = (quotations) => {
  ensureStore();
  fs.writeFileSync(QUOTATIONS_FILE, JSON.stringify(quotations, null, 2), 'utf8');
};

export const createLocalQuotation = async (quotationData) => {
  const quotations = readAll();
  const now = new Date().toISOString();
  const quotation = {
    _id: `local_${Date.now()}`,
    ...quotationData,
    status: quotationData.status || 'pending',
    createdAt: quotationData.createdAt || now,
    updatedAt: now,
  };

  quotations.unshift(quotation);
  writeAll(quotations);
  return quotation;
};

export const listLocalQuotations = async () => readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getLocalQuotationById = async (id) => readAll().find((quotation) => quotation._id === id) || null;

export const updateLocalQuotationStatus = async (id, status) => {
  const quotations = readAll();
  const index = quotations.findIndex((quotation) => quotation._id === id);
  if (index === -1) return null;

  quotations[index] = {
    ...quotations[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  writeAll(quotations);
  return quotations[index];
};

export const deleteLocalQuotation = async (id) => {
  const quotations = readAll();
  const nextQuotations = quotations.filter((quotation) => quotation._id !== id);
  if (nextQuotations.length === quotations.length) return null;
  writeAll(nextQuotations);
  return true;
};
