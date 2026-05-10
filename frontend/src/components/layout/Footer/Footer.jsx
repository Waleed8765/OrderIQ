import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Facebook, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerLinks = {
    Product: [
      { label: 'Discovery', href: '/discovery' },
      { label: 'Order Tracking', href: '/how-it-works/tracking' },
      { label: 'Loyalty Rewards', href: '/loyalty' },
      { label: 'QR Menus', href: '/qr-menus' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
    Partner: [
      { label: 'For Restaurants', href: '/register/restaurant' },
      { label: 'Partner Portal', href: '/partner-portal' },
      { label: 'Support Center', href: '/support' },
      { label: 'API Docs', href: '/api-docs' },
    ],
    Legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Data Protection (PDPA)', href: '/data-protection' },
    ],
  };

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-content mx-auto px-6 pt-14 pb-8">
        <div className="grid md:grid-cols-6 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OQ</span>
              </div>
              <span className="text-2xl font-bold">OrderIQ</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              AI-powered food ordering platform connecting restaurants with customers across Pakistan — faster, smarter, and more delightfully.
            </p>

            {/* Newsletter */}
            {subscribed ? (
              <div className="bg-primary-900/50 border border-primary-700 rounded-xl p-4 text-sm text-primary-300">
                🎉 Thanks for subscribing! You'll hear from us soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button type="submit" className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5 text-sm font-semibold flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-primary-600 hover:text-white transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-300 mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">© 2025 OrderIQ. All rights reserved.</p>
          <p className="text-neutral-500 text-sm">Made with ❤️ in Lahore, Pakistan.</p>
          <div className="flex gap-5">
            <Link to="/terms" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">Terms</Link>
            <Link to="/privacy" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
