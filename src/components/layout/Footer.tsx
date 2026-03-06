import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon } from
'lucide-react';
const LOGO_URL = "/WhatsApp_Image_2025-08-21_at_12.50.56_(1).jpg";

const footerLinks = {
  shop: [
  {
    label: 'All Products',
    href: '/shop'
  },
  {
    label: 'Laptops',
    href: '/shop?category=laptops'
  },
  {
    label: 'Desktop PCs',
    href: '/shop?category=desktops'
  },
  {
    label: 'Graphics Cards',
    href: '/shop?category=gpus'
  },
  {
    label: 'Processors',
    href: '/shop?category=cpus'
  },
  {
    label: 'Monitors',
    href: '/shop?category=monitors'
  }],

  support: [
  {
    label: 'Contact Us',
    href: '/contact'
  },
  {
    label: 'FAQs',
    href: '/contact#faq'
  },
  {
    label: 'Shipping Info',
    href: '/contact'
  },
  {
    label: 'Returns',
    href: '/contact'
  },
  {
    label: 'Warranty',
    href: '/contact'
  }],

  company: [
  {
    label: 'About ORIONX',
    href: '/about'
  },
  {
    label: 'Careers',
    href: '/about'
  },
  {
    label: 'Press',
    href: '/about'
  },
  {
    label: 'Blog',
    href: '/about'
  }],

  legal: [
  {
    label: 'Privacy Policy',
    href: '/about'
  },
  {
    label: 'Terms of Service',
    href: '/about'
  },
  {
    label: 'Cookie Policy',
    href: '/about'
  }]

};
const socialLinks = [
{
  icon: FacebookIcon,
  href: '#',
  label: 'Facebook'
},
{
  icon: TwitterIcon,
  href: '#',
  label: 'Twitter'
},
{
  icon: InstagramIcon,
  href: '#',
  label: 'Instagram'
},
{
  icon: YoutubeIcon,
  href: '#',
  label: 'YouTube'
}];

export function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={LOGO_URL} alt="ORIONX" className="h-10 w-auto" />
            </Link>
            <p className="text-white/60 text-sm mb-6 max-w-sm">
              Your premier destination for cutting-edge technology. From gaming
              rigs to professional workstations, we power your digital life.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:orionx2101@gmail.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                <MailIcon className="w-4 h-4" />
                orionx2101@gmail.com
              </a>
              <a
                href="tel:+94756498525"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                <PhoneIcon className="w-4 h-4" />
                +94 756498525
              </a>
              <p className="flex items-center gap-3 text-sm text-white/60">
                <MapPinIcon className="w-4 h-4" />
                Panagoda, Colombo, Sri Lanka 🇱🇰
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) =>
              <li key={link.label}>
                  <Link
                  to={link.href}
                  className="text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) =>
              <li key={link.label}>
                  <Link
                  to={link.href}
                  className="text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) =>
              <li key={link.label}>
                  <Link
                  to={link.href}
                  className="text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) =>
              <li key={link.label}>
                  <Link
                  to={link.href}
                  className="text-sm text-white/60 hover:text-[#339DFF] transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} ORIONX. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) =>
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#339DFF] hover:border-[#339DFF]/40 transition-colors"
                aria-label={social.label}>

                  <social.icon className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-white/40">
              <span className="text-xs">We accept:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white/60">
                  Visa
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white/60">
                  MC
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white/60">
                  Amex
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white/60">
                  PayPal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>);

}