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
export function QuotationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    productsOfInterest: '',
    additionalDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      productsOfInterest: '',
      additionalDetails: ''
    });
  };
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
                  <div>
                    <label
                    htmlFor="productsOfInterest"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Products of Interest *
                    </label>
                    <textarea
                    id="productsOfInterest"
                    name="productsOfInterest"
                    required
                    rows={3}
                    value={formData.productsOfInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
                    placeholder="E.g., 10x ORIONX Phantom Pro Laptops, 5x Dell XPS 15">
                  </textarea>
                    <p className="text-xs text-text-muted mt-2">
                      Please list the specific products and quantities you are
                      interested in.
                    </p>
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