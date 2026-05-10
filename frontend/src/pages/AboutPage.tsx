import React from 'react';
import { ShieldCheckIcon, ZapIcon, CpuIcon, UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}>

            Powering the <span className="gradient-text">Future</span>
          </motion.h1>
          <motion.p
            className="text-xl text-text-secondary max-w-3xl mx-auto"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}>

            ORIONX is the premier destination for high-performance computing,
            gaming gear, and professional workstations.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}>

              <h2 className="text-3xl font-bold text-text-primary mb-6">
                Our Mission
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Founded in 2025, ORIONX was born from a simple idea: technology
                should be accessible, powerful, and beautifully designed. We
                believe that whether you're a hardcore gamer, a creative
                professional, or a tech enthusiast, you deserve the best
                hardware available.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We partner directly with top manufacturers like NVIDIA, AMD,
                Intel, and ASUS to bring you the latest innovations before
                anyone else. Our team of experts rigorously tests every product
                we sell to ensure it meets our exacting standards for
                performance and reliability.
              </p>
            </motion.div>
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden border border-border"
              initial={{
                opacity: 0,
                x: 20
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}>

              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"
                alt="High performance computing"
                className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Why Choose ORIONX
            </h2>
            <p className="text-text-secondary">
              The core values that drive everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            {
              icon: ZapIcon,
              title: 'Uncompromising Performance',
              description:
              'We only stock hardware that meets our strict performance benchmarks.'
            },
            {
              icon: ShieldCheckIcon,
              title: 'Guaranteed Quality',
              description:
              'Every product comes with our comprehensive 2-year warranty.'
            },
            {
              icon: CpuIcon,
              title: 'Latest Technology',
              description:
              'Get access to next-generation components as soon as they launch.'
            },
            {
              icon: UsersIcon,
              title: 'Expert Support',
              description:
              'Our support team consists of real PC builders and enthusiasts.'
            }].
            map((value, index) =>
            <motion.div
              key={value.title}
              className="p-6 bg-surface/50 border border-border rounded-xl text-center hover:border-primary/50 transition-colors"
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
                delay: index * 0.1
              }}>

                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>);

}