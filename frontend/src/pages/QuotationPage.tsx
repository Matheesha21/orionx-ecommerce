import React, { useState } from 'react';
import {
  FileTextIcon,
  SendIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  PackageIcon,
  MessageSquareIcon,
  CheckCircleIcon } from
'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const COMPANY_NAME = 'ORIONX';
const COMPANY_ADDRESS = 'Panagoda, Colombo, Sri Lanka';
const COMPANY_EMAIL = 'orionx2101@gmail.com';
const COMPANY_PHONE = '+94 756498525';

export function QuotationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    productsOfInterest: '',
    quantity: '',
    additionalDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5050/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity) || 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quotation');
      }

      // capture submitted data for PDF generation
      const submittedData = { ...formData, quantity: parseInt(formData.quantity) || 1 };

      // generate PDF and trigger download for the user
      try {
        generateQuotationPdf(submittedData);
      } catch (pdfErr) {
        console.error('PDF generation failed:', pdfErr);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        productsOfInterest: '',
        quantity: '',
        additionalDetails: ''
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to submit quotation request');
      console.error('Quotation submission error:', err);
    }
  };
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  // Generate a simple letterhead-style PDF and trigger download
  const generateQuotationPdf = (data: any) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Header / Letterhead
    doc.setFontSize(18);
    doc.setTextColor(20, 40, 60);
    doc.text(COMPANY_NAME, 20, 20);
    doc.setFontSize(10);
    doc.text(COMPANY_ADDRESS, 20, 26);
    doc.text(`Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`, 20, 31);

    // Title
    doc.setFontSize(14);
    doc.text('Quotation', 150, 20, { align: 'right' });
    doc.setFontSize(10);
    const now = new Date();
    doc.text(`Date: ${now.toLocaleDateString()}`, 150, 26, { align: 'right' });

    // Customer info
    doc.setFontSize(11);
    doc.text('Customer Details:', 20, 45);
    doc.setFontSize(10);
    doc.text(`${data.firstName || ''} ${data.lastName || ''}`, 20, 52);
    doc.text(`${data.company || ''}`, 20, 58);
    doc.text(`${data.email || ''} • ${data.phone || ''}`, 20, 64);

    // Quotation details box
    doc.setDrawColor(200);
    doc.rect(20, 72, 170, 40);
    doc.setFontSize(11);
    doc.text('Product / Service', 24, 80);
    doc.text('Quantity', 120, 80);
    doc.setFontSize(10);
    doc.text(String(data.productsOfInterest || ''), 24, 90);
    doc.text(String(data.quantity || ''), 120, 90);

    // Additional details
    doc.setFontSize(11);
    doc.text('Additional Details:', 20, 122);
    doc.setFontSize(10);
    const splitDetails = doc.splitTextToSize(data.additionalDetails || '', 170);
    doc.text(splitDetails, 20, 130);

    // Footer / signature
    doc.setFontSize(10);
    doc.text('Thank you for your interest. This is an initial quotation request.', 20, 270);
    doc.text('ORIONX Sales Team', 20, 277);

    const filename = `Quotation_${(data.firstName || 'customer')}_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">

            <FileTextIcon className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-text-primary mb-4"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}>

            Request a Quotation
          </motion.h1>
          <motion.p
            className="text-text-secondary max-w-2xl mx-auto text-lg"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}>

            Looking for bulk orders, custom builds, or enterprise solutions?
            Fill out the form below and our sales team will get back to you with
            a customized quote within 24 hours.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {isSubmitted ?
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="text-center py-12">

              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Quotation Request Received!
              </h3>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Thank you for your interest. Our sales team is reviewing your
                request and will contact you shortly with a detailed quotation.
              </p>
              <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">

                Submit Another Request
              </button>
            </motion.div> :

          <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      First Name *
                    </label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="John" />

                  </div>
                  <div>
                    <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Last Name *
                    </label>
                    <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Doe" />

                  </div>
                  <div>
                    <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Email Address *
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="john@company.com" />

                    </div>
                  </div>
                  <div>
                    <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Phone Number *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="+1 (555) 000-0000" />

                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <BuildingIcon className="w-5 h-5 text-primary" />
                  Company Details (Optional)
                </h3>
                <div>
                  <label
                  htmlFor="company"
                  className="block text-sm font-medium text-text-secondary mb-2">

                    Company Name
                  </label>
                  <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Acme Corp" />

                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-primary" />
                  Quotation Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Product Selection */}
  <div>
    <label
      htmlFor="productsOfInterest"
      className="block text-sm font-medium text-text-secondary mb-2"
    >
      Select Product *
    </label>

    <input
      list="product-options"
      id="productsOfInterest"
      name="productsOfInterest"
      required
      value={formData.productsOfInterest}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      placeholder="Select or type a product"
    />

    <datalist id="product-options">
      <option value="ORIONX Phantom Pro Laptop" />
      <option value="Dell XPS 15" />
      <option value="RTX 4090 Graphics Card" />
      <option value="AMD Ryzen 9 Processor" />
      <option value="Corsair DDR5 RAM" />
      <option value="Samsung NVMe SSD" />
      <option value="Gaming Monitor 27 inch" />
      <option value="Mechanical Keyboard" />
    </datalist>

    <p className="text-xs text-text-muted mt-2">
      You can select from the list or type a custom product manually.
    </p>
  </div>

  {/* Quantity */}
  <div>
    <label
      htmlFor="quantity"
      className="block text-sm font-medium text-text-secondary mb-2"
    >
      Quantity *
    </label>

    <input
      type="number"
      id="quantity"
      name="quantity"
      required
      min="1"
      value={(formData as any).quantity || ""}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      placeholder="Enter quantity"/>
              </div>
                  </div>
                  
                  <div>
                    <label
                    htmlFor="additionalDetails"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Additional Details
                    </label>
                    <div className="relative">
                      <MessageSquareIcon className="absolute left-3 top-4 w-5 h-5 text-text-muted" />
                      <textarea
                      id="additionalDetails"
                      name="additionalDetails"
                      rows={4}
                      value={formData.additionalDetails}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
                      placeholder="Any specific requirements, timeline, or budget constraints?">
                    </textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md shadow-primary/20">

                  {isSubmitting ?
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                <>
                      Request Quotation
                      <SendIcon className="w-4 h-4" />
                    </>
                }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>);

}