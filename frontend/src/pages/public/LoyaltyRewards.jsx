import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Star, Crown, ChevronRight, Check, TrendingUp, Heart } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const tiers = [
  {
    name: 'Bronze',
    icon: Star,
    color: 'from-orange-400 to-amber-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    points: '0 – 999 pts',
    perks: ['5% cashback on orders', 'Birthday bonus points', 'Early access to promotions'],
  },
  {
    name: 'Silver',
    icon: TrendingUp,
    color: 'from-neutral-400 to-neutral-500',
    bg: 'bg-neutral-50',
    border: 'border-neutral-300',
    points: '1,000 – 4,999 pts',
    perks: ['8% cashback on orders', 'Free delivery on weekends', 'Priority customer support', 'Exclusive restaurant deals'],
  },
  {
    name: 'Gold',
    icon: Crown,
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    points: '5,000+ pts',
    perks: ['12% cashback on orders', 'Free delivery every day', 'Dedicated VIP support', 'Surprise gifts monthly', 'Early new restaurant access'],
    featured: true,
  },
];

const howItWorks = [
  { step: '1', title: 'Order & Earn', desc: 'Earn 10 points for every Rs 100 spent on any order.' },
  { step: '2', title: 'Unlock Tiers', desc: 'Accumulate points to reach Silver and Gold status for bigger perks.' },
  { step: '3', title: 'Redeem Rewards', desc: 'Use points for discounts, free delivery, and exclusive offers.' },
  { step: '4', title: 'Stay Rewarded', desc: 'Points never expire as long as you order at least once every 90 days.' },
];

const LoyaltyRewards = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-primary-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-6">
            <Gift className="w-4 h-4" /> Loyalty Programme
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Every Order{' '}
            <span className="bg-gradient-to-r from-yellow-500 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Earns You More
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            OrderIQ Rewards turns your food orders into points, perks, and savings. The more you order, the better your benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
              Join Rewards Free <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/customer/profile/rewards" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-300 text-primary-700 font-semibold rounded-xl hover:border-primary-500 transition-all">
              View My Points
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <p className="text-neutral-600">Simple, transparent, and rewarding from day one.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((h, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {h.step}
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{h.title}</h3>
                <p className="text-sm text-neutral-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Reward Tiers</h2>
            <p className="text-neutral-600">Unlock bigger rewards as you climb the ranks.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((t, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border-2 ${t.bg} ${t.border} ${t.featured ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : 'hover:shadow-lg'} transition-all`}>
                {t.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-bold rounded-full">Most Popular</span>
                )}
                <div className={`w-14 h-14 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center mb-4 shadow`}>
                  <t.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">{t.name}</h3>
                <p className="text-sm text-neutral-500 mb-6">{t.points}</p>
                <ul className="space-y-3">
                  {t.perks.map((p, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 text-sm">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <Heart className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Start earning rewards today</h2>
          <p className="text-primary-100 mb-8">Create your free account and get 100 welcome bonus points.</p>
          <Link to="/register" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
            Join Now — It's Free <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default LoyaltyRewards;
