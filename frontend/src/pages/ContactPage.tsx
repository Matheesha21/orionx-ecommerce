import React, { useState } from 'react';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SendIcon,
  MessageSquareIcon } from
'lucide-react';
import { motion } from 'framer-motion';
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
      name: '',
      email: '',
      subject: '',
      message: ''
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
      <div className="bg-surface/30 border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl font-bold text-text-primary mb-4"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>

            Contact Us
          </motion.h1>
          <motion.p
            className="text-text-secondary max-w-2xl mx-auto"
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

            Have a question about a product, order, or need technical support?
            Our team of experts is here to help.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-1">
                      Phone
                    </h3>
                    <p className="text-text-secondary mb-1">+94 756498525</p>
                    <p className="text-sm text-text-muted">
                      Mon-Sat from 9am to 6pm IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MailIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-1">
                      Email
                    </h3>
                    <p className="text-text-secondary mb-1">
                      orionx2101@gmail.com
                    </p>
                    <p className="text-sm text-text-muted">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-1">
                      Our Location
                    </h3>
                    <p className="text-text-secondary">
                      Panagoda
                      <br />
                      Colombo
                      <br />
                      Sri Lanka 🇱🇰
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <MessageSquareIcon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Looking for quick answers?
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Check out our frequently asked questions for immediate help with
                orders, shipping, and returns.
              </p>
              <a
                href="#faq"
                className="text-primary hover:text-primary-light text-sm font-medium">

                View FAQs &rarr;
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface/50 border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Send us a Message
              </h2>

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

                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SendIcon className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Thank you for reaching out. One of our team members will get
                    back to you shortly.
                  </p>
                  <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors">

                    Send another message
                  </button>
                </motion.div> :

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text-secondary mb-2">

                        Your Name
                      </label>
                      <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      placeholder="John Doe" />

                    </div>
                    <div>
                      <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-secondary mb-2">

                        Email Address
                      </label>
                      <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      placeholder="john@example.com" />

                    </div>
                  </div>

                  <div>
                    <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Subject
                    </label>
                    <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange as any}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary appearance-none">

                      <option value="">Select a subject...</option>
                      <option value="support">Technical Support</option>
                      <option value="order">Order Inquiry</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="sales">Sales Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-secondary mb-2">

                      Message
                    </label>
                    <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary resize-none"
                    placeholder="How can we help you?">
                  </textarea>
                  </div>

                  <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">

                    {isSubmitting ?
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                  <>
                        Send Message
                        <SendIcon className="w-4 h-4" />
                      </>
                  }
                  </button>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

}