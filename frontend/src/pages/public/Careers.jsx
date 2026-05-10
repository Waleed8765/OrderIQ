import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ChevronRight, Users, Zap, Heart, Star } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const openings = [
  { title: 'Frontend Engineer (React)', team: 'Engineering', location: 'Lahore / Remote', type: 'Full-time', level: 'Mid-Senior' },
  { title: 'Backend Engineer (Node.js)', team: 'Engineering', location: 'Lahore / Remote', type: 'Full-time', level: 'Mid-Senior' },
  { title: 'Product Designer (UI/UX)', team: 'Design', location: 'Lahore / Remote', type: 'Full-time', level: 'Mid' },
  { title: 'Data Scientist / ML Engineer', team: 'AI & Data', location: 'Remote', type: 'Full-time', level: 'Senior' },
  { title: 'Restaurant Partnership Manager', team: 'Business', location: 'Lahore', type: 'Full-time', level: 'Mid' },
  { title: 'Customer Support Lead', team: 'Operations', location: 'Lahore', type: 'Full-time', level: 'Junior-Mid' },
  { title: 'Marketing & Growth Intern', team: 'Marketing', location: 'Lahore / Remote', type: 'Internship', level: 'Entry' },
];

const perks = [
  { icon: Zap, title: 'Competitive Salary', desc: 'Market-leading salaries with regular performance reviews.' },
  { icon: Heart, title: 'Health Coverage', desc: 'Full medical, dental, and vision coverage for you and your family.' },
  { icon: Star, title: 'Learning Budget', desc: 'Rs 50,000/year for courses, conferences, and books.' },
  { icon: Users, title: 'Great Team', desc: 'Work alongside passionate, talented people who care deeply.' },
  { icon: Clock, title: 'Flexible Hours', desc: 'We trust you to manage your time and deliver results.' },
  { icon: MapPin, title: 'Hybrid Work', desc: 'Work from our Lahore office or remotely — your choice.' },
];

const teamColors = { Engineering: 'bg-primary-100 text-primary-700', Design: 'bg-accent-100 text-accent-700', 'AI & Data': 'bg-secondary-100 text-secondary-700', Business: 'bg-green-100 text-green-700', Operations: 'bg-orange-100 text-orange-700', Marketing: 'bg-pink-100 text-pink-700' };
const typeColors = { 'Full-time': 'bg-green-100 text-green-700', Internship: 'bg-yellow-100 text-yellow-700' };

const Careers = () => {
  const [filter, setFilter] = useState('All');
  const teams = ['All', ...new Set(openings.map(o => o.team))];
  const filtered = filter === 'All' ? openings : openings.filter(o => o.team === filter);

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
            <Briefcase className="w-4 h-4" /> Join Our Team
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Build the Future of{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
              Food Tech
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            We're a small, fast-moving team on a mission to transform how Pakistan orders food. Come build something meaningful.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {openings.length} open positions
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why OrderIQ?</h2>
            <p className="text-neutral-600">We take care of our team so they can take care of our customers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{p.title}</h3>
                <p className="text-sm text-neutral-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Open Positions</h2>
          </div>
          {/* Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {teams.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === t ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-400'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {filtered.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${teamColors[job.team] || 'bg-neutral-100 text-neutral-600'}`}>{job.team}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[job.type] || 'bg-neutral-100 text-neutral-600'}`}>{job.type}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{job.location}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600">{job.level}</span>
                  </div>
                </div>
                <a href="mailto:careers@orderiq.pk" className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex-shrink-0">
                  Apply <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't see the right role?</h2>
          <p className="text-primary-100 mb-8">Send us your CV anyway. We're always looking for great talent.</p>
          <a href="mailto:careers@orderiq.pk" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
            Email Us <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default Careers;
