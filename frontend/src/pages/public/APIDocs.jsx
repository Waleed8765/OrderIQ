import React, { useState } from 'react';
import { Code2, ChevronRight, Copy, Check, Terminal, Package, Shield, Zap } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const endpoints = [
  { method: 'GET', path: '/api/v1/restaurants', desc: 'List all available restaurants with optional filtering.', badge: 'Public' },
  { method: 'GET', path: '/api/v1/restaurants/:id', desc: 'Get full details of a specific restaurant including menu.', badge: 'Public' },
  { method: 'POST', path: '/api/v1/orders', desc: 'Place a new order for authenticated customers.', badge: 'Auth' },
  { method: 'GET', path: '/api/v1/orders/:id', desc: 'Get live status and details of a specific order.', badge: 'Auth' },
  { method: 'GET', path: '/api/v1/menu/:restaurantId', desc: 'Retrieve menu items for a restaurant.', badge: 'Public' },
  { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate a user and receive an access token.', badge: 'Public' },
  { method: 'GET', path: '/api/v1/customer/profile', desc: 'Get the authenticated customer\'s profile.', badge: 'Auth' },
  { method: 'GET', path: '/api/v1/customer/rewards', desc: 'Get current loyalty points and tier.', badge: 'Auth' },
];

const codeExample = `// Example: List Restaurants
const response = await fetch(
  'https://api.orderiq.pk/v1/restaurants?city=Lahore&cuisine=Pakistani',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.restaurants);
// [{ id: '...', name: 'Spice Symphony', rating: 4.8, ... }]`;

const methodColors = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
};
const badgeColors = {
  Public: 'bg-neutral-100 text-neutral-600',
  Auth: 'bg-primary-100 text-primary-700',
};

const APIDocs = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-900 to-neutral-900 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white/80 rounded-full text-sm font-semibold mb-6">
            <Code2 className="w-4 h-4" /> Developer API
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build with the{' '}
            <span className="bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent">
              OrderIQ API
            </span>
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
            A RESTful API for integrating OrderIQ's restaurant data, menus, orders, and customer management into your own applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:api@orderiq.pk" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
              Request API Access <ChevronRight className="ml-2 w-5 h-5" />
            </a>
            <a href="mailto:api@orderiq.pk" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/60 transition-all">
              Contact Dev Team
            </a>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Terminal, title: 'REST API', desc: 'Standard HTTP REST endpoints with JSON responses.', color: 'from-primary-500 to-accent-500' },
              { icon: Shield, title: 'JWT Auth', desc: 'Secure token-based authentication for all private endpoints.', color: 'from-secondary-500 to-primary-500' },
              { icon: Zap, title: 'Real-Time Events', desc: 'WebSocket support for live order status updates.', color: 'from-accent-500 to-secondary-500' },
              { icon: Package, title: 'Versioned', desc: 'All endpoints versioned at /api/v1 for backwards compatibility.', color: 'from-primary-600 to-secondary-600' },
            ].map((c, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 group hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">{c.title}</h3>
                <p className="text-sm text-neutral-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-content mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
            <div className="relative bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700">
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-neutral-400">JavaScript</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-6 text-sm text-green-300 overflow-x-auto leading-relaxed">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-10">API Endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 hover:shadow-md transition-shadow">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${methodColors[ep.method]}`}>{ep.method}</span>
                <code className="text-sm font-mono text-neutral-800 flex-shrink-0">{ep.path}</code>
                <span className="text-sm text-neutral-600 flex-1">{ep.desc}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${badgeColors[ep.badge]}`}>{ep.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-neutral-900 to-primary-900">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to integrate?</h2>
          <p className="text-neutral-300 mb-8">Request API credentials and get building today.</p>
          <a href="mailto:api@orderiq.pk" className="inline-flex items-center px-10 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-xl">
            Request Access <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default APIDocs;
