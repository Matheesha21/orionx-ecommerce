import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  ZapIcon,
  ShieldCheckIcon,
  TruckIcon } from
'lucide-react';
import { motion } from 'framer-motion';
const LOGO_URL = "/WhatsApp_Image_2025-08-21_at_12.50.56_(1).jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2E4D] to-[#0A2540]">
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />


      {/* Soft Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#007BFF]/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#007BFF]/10 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.8
          }}>

          {/* Logo */}
          <motion.img
            src={LOGO_URL}
            alt="ORIONX"
            className="h-16 md:h-24 w-auto mx-auto mb-8"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }} />


          {/* Tagline */}
          <motion.p
            className="text-[#339DFF] font-semibold tracking-widest uppercase mb-4 text-sm"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.3
            }}>

            Your Trusted Technology Partner
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4
            }}>

            Power Your <span className="text-[#339DFF]">Digital World</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.5
            }}>

            Discover cutting-edge computers, components, and accessories. From
            gaming rigs to professional workstations, we have everything you
            need.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.6
            }}>

            <Link
              to="/shop"
              className="group px-8 py-4 bg-[#007BFF] hover:bg-[#339DFF] text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-[#007BFF]/25 hover:shadow-[#007BFF]/40">

              Shop Now
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-colors">

              Learn More
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.7
            }}>

            <div className="flex items-center justify-center gap-3 text-white/70">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                <TruckIcon className="w-5 h-5 text-[#339DFF]" />
              </div>
              <span className="text-sm font-medium">Free Shipping $100+</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/70">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                <ShieldCheckIcon className="w-5 h-5 text-[#339DFF]" />
              </div>
              <span className="text-sm font-medium">2-Year Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/70">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                <ZapIcon className="w-5 h-5 text-[#339DFF]" />
              </div>
              <span className="text-sm font-medium">Expert Support</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 1
          }}>

          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-[#007BFF] rounded-full mt-2"
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }} />

          </div>
        </motion.div>
      </div>
    </section>);

}