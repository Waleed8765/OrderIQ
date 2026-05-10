import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Users, Zap, Globe, ChevronRight, Sparkles } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const teamMembers = [
  { name: 'Ahmed Waleed', role: 'Co-Founder & CEO', initials: 'AW', color: 'from-primary-500 to-accent-500' },
  { name: 'Sara Khan', role: 'Co-Founder & CTO', initials: 'SK', color: 'from-secondary-500 to-primary-500' },
  { name: 'Usman Ali', role: 'Head of Product', initials: 'UA', color: 'from-accent-500 to-secondary-500' },
  { name: 'Fatima Noor', role: 'Head of Design', initials: 'FN', color: 'from-primary-600 to-secondary-600' },
];

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision starts with the question: does this make life easier for our customers?', color: 'from-accent-500 to-primary-500' },
  { icon: Target, title: 'Precision', desc: 'We obsess over accuracy — from ETAs to menu availability to order delivery.', color: 'from-primary-500 to-secondary-500' },
  { icon: Zap, title: 'Speed', desc: 'Fast products for fast food. We move quickly and ship constantly.', color: 'from-secondary-500 to-accent-500' },
  { icon: Globe, title: 'Accessibility', desc: 'Great food tech should work for everyone — from Lahore to Karachi to Islamabad.', color: 'from-primary-600 to-accent-600' },
];

const milestones = [
  { year: '2023', event: 'OrderIQ founded as a Final Year Project at FAST-NUCES' },
  { year: 'Early 2024', event: 'First 10 restaurant partners onboarded in Lahore' },
  { year: 'Mid 2024', event: 'Launched AI-powered recommendation engine' },
  { year: 'Late 2024', event: 'WhatsApp chatbot integration launched' },
  { year: '2025', event: 'QR dine-in feature rolled out to 50+ restaurants' },
];

const AboutUs = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Built by Food Lovers,{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
              for Food Lovers
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            OrderIQ started as a final year project at FAST-NUCES with a simple mission: make ordering food smarter, faster, and more delightful — for both customers and restaurant owners.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-600 mb-6">
                To democratise great dining experiences by connecting customers with local restaurants through intelligent technology — making discovery, ordering, and delivery seamless for everyone.
              </p>
              <p className="text-neutral-500">
                We believe local restaurants are the backbone of every community. Our platform gives them the tools to compete in the digital age while helping customers discover amazing food right in their neighbourhood.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-primary-100 text-lg">
                To become Pakistan's most trusted food technology platform — where every meal ordered is a great experience and every restaurant partner thrives.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[['500+', 'Restaurants'], ['10K+', 'Orders Delivered'], ['4.8★', 'Avg. Rating'], ['3 Cities', 'And Growing']].map(([val, label]) => (
                  <div key={label} className="bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{val}</p>
                    <p className="text-primary-200 text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow group">
                <div className={`w-12 h-12 bg-gradient-to-br ${v.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Meet the Team</h2>
            <p className="text-neutral-600">The passionate people building OrderIQ.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((m, i) => (
              <div key={i} className="text-center group">
                <div className={`w-24 h-24 bg-gradient-to-br ${m.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-2xl font-bold">{m.initials}</span>
                </div>
                <h3 className="font-bold text-neutral-900">{m.name}</h3>
                <p className="text-sm text-neutral-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Journey</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 shadow">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-neutral-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <span className="text-sm font-bold text-primary-600">{m.year}</span>
                  <p className="text-neutral-700 mt-1">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to be part of our story?</h2>
          <p className="text-primary-100 mb-8">Join us as a customer, restaurant partner, or team member.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
              Get Started <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/careers" className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:border-white transition-all">
              View Careers
            </Link>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default AboutUs;
