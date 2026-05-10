import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Zap, MapPin, Clock, Star, TrendingUp,
  ChevronRight, Sparkles, Users, Filter
} from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const Discovery = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      desc: 'Our recommendation engine learns your taste preferences and surfaces restaurants and dishes perfectly tailored to you — getting smarter with every order.',
      color: 'from-primary-500 to-accent-500',
    },
    {
      icon: MapPin,
      title: 'Location-Aware Search',
      desc: 'Instantly find restaurants near you. Filter by delivery radius, pick-up availability, or dine-in tables — all on a live map.',
      color: 'from-secondary-500 to-primary-500',
    },
    {
      icon: Filter,
      title: 'Smart Filters',
      desc: 'Narrow results by cuisine, dietary tags (vegan, halal, gluten-free), price range, rating, and current availability in real time.',
      color: 'from-accent-500 to-secondary-500',
    },
    {
      icon: TrendingUp,
      title: 'Trending & New',
      desc: "Explore what's popular in your city today. Trending dishes, new openings, and limited-time offers surface automatically.",
      color: 'from-primary-600 to-secondary-600',
    },
    {
      icon: Star,
      title: 'Curated Collections',
      desc: 'Hand-picked lists like "Best Biryani in Town", "Late-Night Bites", and "Under Rs 500" make browsing effortless.',
      color: 'from-accent-600 to-primary-600',
    },
    {
      icon: Users,
      title: 'Social Proof',
      desc: 'Real reviews from real customers. Photo uploads, ratings breakdowns, and verified order badges so you always know what to expect.',
      color: 'from-secondary-600 to-accent-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Partner Restaurants' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '50+', label: 'Cuisine Types' },
    { value: '14 min', label: 'Avg. Prep Time' },
  ];

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" /> Powered by AI
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Discover Food You'll{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
              Actually Love
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            OrderIQ's discovery engine combines AI recommendations, smart filters, and real-time data to help you find the perfect meal every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/customer/home"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Exploring <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-300 text-primary-700 font-semibold rounded-xl hover:border-primary-500 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-y border-neutral-100">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-neutral-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">How Discovery Works</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Every feature is designed to cut through the noise and connect you with great food fast.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-xl transition-shadow group">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{f.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to discover your next favourite meal?</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands of food lovers already using OrderIQ.</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl"
          >
            Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default Discovery;
