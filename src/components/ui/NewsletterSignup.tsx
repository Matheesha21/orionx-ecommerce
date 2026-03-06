import React, { useState } from 'react';
import { SendIcon, CheckCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
  };
  return (
    <section className="relative py-16 overflow-hidden bg-[#0A2540]">
      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />


      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with <span className="text-[#339DFF]">ORIONX</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new product
            launches, and tech news delivered straight to your inbox.
          </p>

          <AnimatePresence mode="wait">
            {isSubmitted ?
            <motion.div
              key="success"
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              className="flex items-center justify-center gap-3 text-green-400">

                <CheckCircleIcon className="w-6 h-6" />
                <span className="text-lg font-medium">
                  Thanks for subscribing!
                </span>
              </motion.div> :

            <motion.form
              key="form"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">

                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#339DFF] focus:ring-1 focus:ring-[#339DFF] transition-colors" />

                <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#007BFF] hover:bg-[#339DFF] text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">

                  {isLoading ?
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                <>
                      <span>Subscribe</span>
                      <SendIcon className="w-4 h-4" />
                    </>
                }
                </button>
              </motion.form>
            }
          </AnimatePresence>

          <p className="text-white/40 text-sm mt-4">
            No spam, unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>);

}