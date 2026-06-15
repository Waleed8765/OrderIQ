import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Smartphone, CheckCircle, ChevronRight, Zap, UtensilsCrossed, Wallet } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const steps = [
  { icon: QrCode, title: 'Scan the QR Code', desc: 'Use your phone camera to scan the QR code on your table — no app download required.', color: 'from-primary-500 to-accent-500' },
  { icon: UtensilsCrossed, title: 'Browse the Menu', desc: 'View the full digital menu with photos, descriptions, allergens, and live availability.', color: 'from-secondary-500 to-primary-500' },
  { icon: Smartphone, title: 'Place Your Order', desc: 'Add items to your cart and place your order directly from your phone.', color: 'from-accent-500 to-secondary-500' },
  { icon: Wallet, title: 'Pay Your Way', desc: 'Pay online instantly via Google Pay, or choose pay-at-counter — fully flexible.', color: 'from-primary-600 to-secondary-600' },
];

const benefits = [
  { title: 'For Diners', items: ['No app install needed', 'Browse at your own pace', 'Split bills easily', 'Contactless & hygienic'] },
  { title: 'For Restaurants', items: ['Reduce order errors', 'Faster table turnover', 'Real-time menu updates', 'Analytics on popular items'] },
];

const QRMenusInfo = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-400/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <QrCode className="w-4 h-4" /> Dine-In Innovation
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Menus That Live{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
              on Your Phone
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            OrderIQ QR Menus bring the full restaurant experience to your smartphone — scan, browse, order and pay without leaving your seat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scan" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
              Try Scanning Now <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/register/restaurant" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-300 text-primary-700 font-semibold rounded-xl hover:border-primary-500 transition-all">
              Add QR to My Restaurant
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <p className="text-neutral-600">Four simple steps from scan to satisfaction.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Benefits for Everyone</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-neutral-900 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </span>
                  {b.title}
                </h3>
                <ul className="space-y-3">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-neutral-700">
                      <Zap className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to go contactless?</h2>
          <p className="text-primary-100 mb-8">Get your restaurant's QR menu live in minutes.</p>
          <Link to="/register/restaurant" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
            Partner With Us <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default QRMenusInfo;
