import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Check, Star, TrendingUp, BarChart3, QrCode, Headphones, Zap } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For new restaurants just getting started on OrderIQ.',
    color: 'from-neutral-400 to-neutral-500',
    border: 'border-neutral-200',
    features: ['Online menu listing', 'Receive delivery orders', 'Basic analytics dashboard', 'WhatsApp support'],
  },
  {
    name: 'Growth',
    price: 'Rs 5,000/mo',
    desc: 'For restaurants ready to scale their digital presence.',
    color: 'from-primary-500 to-accent-500',
    border: 'border-primary-300',
    featured: true,
    features: ['Everything in Starter', 'QR dine-in menus', 'Advanced analytics & reports', 'Priority support', 'Loyalty programme integration', 'Custom promotions'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For restaurant chains and multi-branch operations.',
    color: 'from-secondary-500 to-primary-500',
    border: 'border-secondary-200',
    features: ['Everything in Growth', 'Multi-branch management', 'Dedicated account manager', 'API access', 'Custom integrations', 'SLA guarantee'],
  },
];

const benefits = [
  { icon: TrendingUp, title: 'Grow Your Revenue', desc: 'Reach thousands of customers actively searching for food in your area.' },
  { icon: BarChart3, title: 'Data-Driven Insights', desc: 'Real-time analytics on orders, revenue, popular items, and customer trends.' },
  { icon: QrCode, title: 'QR Dine-In Ready', desc: 'Go contactless instantly — generate QR codes for your tables in minutes.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Our restaurant success team is available 7 days a week to help you thrive.' },
  { icon: Zap, title: 'Quick Onboarding', desc: 'Your restaurant can be live on OrderIQ in under 24 hours.' },
  { icon: Star, title: 'Loyalty Integration', desc: 'Reward returning customers and build a loyal base with our rewards programme.' },
];

const steps = [
  { step: '1', title: 'Register Your Restaurant', desc: 'Fill in your restaurant details, upload your menu and photos.' },
  { step: '2', title: 'Get Verified', desc: 'Our team reviews your application and verifies your business within 24 hours.' },
  { step: '3', title: 'Go Live', desc: 'Your restaurant appears on OrderIQ and starts receiving orders immediately.' },
  { step: '4', title: 'Grow & Earn', desc: 'Use insights and promotions to scale your digital revenue consistently.' },
];

const PartnerPortal = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <Building2 className="w-4 h-4" /> Restaurant Partners
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Grow Your Restaurant{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
              with OrderIQ
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Join 500+ restaurants already using OrderIQ to reach more customers, streamline operations, and grow revenue — all from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/restaurant" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
              Register Your Restaurant <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/restaurant" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-300 text-primary-700 font-semibold rounded-xl hover:border-primary-500 transition-all">
              Go to Partner Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Partner with OrderIQ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{b.title}</h3>
                <p className="text-sm text-neutral-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How to Join</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {s.step}
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Plans for Every Restaurant</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border-2 ${plan.border} bg-white ${plan.featured ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : 'hover:shadow-lg'} transition-all`}>
                {plan.featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-bold rounded-full">Most Popular</span>}
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 shadow`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-neutral-900 my-2">{plan.price}</p>
                <p className="text-sm text-neutral-500 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register/restaurant" className={`block text-center px-6 py-3 rounded-xl font-semibold transition-all ${plan.featured ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'border-2 border-neutral-300 text-neutral-700 hover:border-primary-400 hover:text-primary-600'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow with OrderIQ?</h2>
          <p className="text-primary-100 mb-8">Join 500+ restaurant partners already on the platform.</p>
          <Link to="/register/restaurant" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
            Register Now <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default PartnerPortal;
