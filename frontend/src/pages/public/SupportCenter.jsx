import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Search, ChevronRight, MessageCircle, Mail, Phone, ChevronDown, CheckCircle } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const categories = [
  { label: 'Orders & Delivery', icon: '📦' },
  { label: 'Account & Profile', icon: '👤' },
  { label: 'Payments & Refunds', icon: '💳' },
  { label: 'Restaurant Partners', icon: '🍽️' },
  { label: 'QR Menus', icon: '📱' },
  { label: 'Loyalty & Rewards', icon: '🎁' },
];

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order is placed, go to "My Orders" in your profile and tap on the active order. You\'ll see a live status update and map tracking for delivery orders.' },
  { q: 'Can I cancel my order after placing it?', a: 'Orders can be cancelled within 2 minutes of placement before the restaurant accepts. After acceptance, please contact our support team via chat.' },
  { q: 'How do I get a refund?', a: 'Refunds are processed automatically for cancelled orders within 3–5 business days. For issues with delivered orders, contact support within 24 hours with a photo.' },
  { q: 'How do I add a new delivery address?', a: 'Go to Profile → Addresses → Add New Address. You can save multiple addresses and set a default for quicker checkout.' },
  { q: 'How do I redeem my loyalty points?', a: 'At checkout, if you have eligible points, you\'ll see an option to apply them as a discount. Minimum 500 points required for redemption.' },
  { q: 'How do I register my restaurant?', a: 'Visit our Partner Portal page or click "For Restaurants" in the footer. Fill in your business details and we\'ll verify your restaurant within 24 hours.' },
  { q: 'Why is my payment failing?', a: 'Check your card details and billing address. If the issue persists, try a different payment method or contact your bank. You can also contact our support team for help.' },
  { q: 'How does the QR dine-in feature work?', a: 'Scan the QR code on your restaurant table with your phone camera. The digital menu will open in your browser — no app needed. Order and pay directly from your phone.' },
];

const SupportCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState('');
  const filteredFaqs = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-secondary-400/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-6">
            <Headphones className="w-4 h-4" /> Support Center
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            How Can We{' '}
            <span className="bg-gradient-to-r from-secondary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-xl mx-auto mb-8">
            Search our knowledge base or get in touch with our support team directly.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white text-lg"
            />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <button key={i} onClick={() => setSearch(c.label.split(' ')[0])} className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 hover:shadow-md hover:border-primary-300 transition-all group text-center">
                <span className="text-3xl mb-2 block">{c.icon}</span>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-neutral-500">Find quick answers to common questions.</p>
          </div>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-semibold text-neutral-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-neutral-400">No results found. Try different keywords or contact support below.</div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Still Need Help?</h2>
            <p className="text-neutral-600">Our support team is available 7 days a week.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team in real time. Average response: under 2 minutes.', action: 'Start Chat', color: 'from-primary-500 to-accent-500' },
              { icon: Mail, title: 'Email Support', desc: 'Send us an email and we\'ll respond within 4 hours on business days.', action: 'support@orderiq.pk', href: 'mailto:support@orderiq.pk', color: 'from-secondary-500 to-primary-500' },
              { icon: Phone, title: 'Phone Support', desc: 'Call us Mon–Fri 9am–7pm, Sat 10am–4pm. Premium plan partners get 24/7 access.', action: '+92 21 000 0000', href: 'tel:+922100000000', color: 'from-accent-500 to-secondary-500' },
            ].map((opt, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-7 border border-neutral-200 hover:shadow-lg transition-shadow text-center group">
                <div className={`w-14 h-14 bg-gradient-to-br ${opt.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <opt.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-2">{opt.title}</h3>
                <p className="text-neutral-600 text-sm mb-5">{opt.desc}</p>
                {opt.href ? (
                  <a href={opt.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all text-sm">
                    {opt.action}
                  </a>
                ) : (
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all text-sm">
                    {opt.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default SupportCenter;
