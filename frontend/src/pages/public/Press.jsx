import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Download, ChevronRight, Mail, Calendar } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const pressReleases = [
  { date: 'May 1, 2025', title: 'OrderIQ Surpasses 500 Restaurant Partners Across Pakistan', source: 'Company Announcement' },
  { date: 'Apr 14, 2025', title: 'OrderIQ Launches AI-Powered Recommendation Engine for Personalised Food Discovery', source: 'Company Announcement' },
  { date: 'Mar 20, 2025', title: 'QR Dine-In Feature Now Live at 100+ Restaurants in Lahore and Karachi', source: 'Company Announcement' },
  { date: 'Feb 5, 2025', title: 'OrderIQ Raises Pre-Seed Funding to Expand to 3 Major Pakistani Cities', source: 'Company Announcement' },
  { date: 'Jan 10, 2025', title: 'OrderIQ Integrates WhatsApp for Seamless Food Ordering via Chat', source: 'Company Announcement' },
];

const coverage = [
  { outlet: 'TechJuice', headline: '"OrderIQ is Redefining the Food Delivery Experience in Pakistan"', date: 'Apr 2025' },
  { outlet: 'Aurora Magazine', headline: '"How OrderIQ\'s AI Cuts Ordering Time in Half"', date: 'Mar 2025' },
  { outlet: 'Dawn Business', headline: '"Local Startups Disrupting the Food Tech Sector"', date: 'Feb 2025' },
  { outlet: 'ProPakistani', headline: '"OrderIQ QR Menus: The Future of Dine-In is Here"', date: 'Jan 2025' },
];

const mediaAssets = [
  { name: 'OrderIQ Logo Pack (PNG & SVG)', size: '2.1 MB' },
  { name: 'Brand Guidelines PDF', size: '4.7 MB' },
  { name: 'Product Screenshots (ZIP)', size: '18.3 MB' },
  { name: 'Founder Headshots (ZIP)', size: '6.2 MB' },
  { name: 'Company Fact Sheet PDF', size: '1.4 MB' },
];

const Press = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-900 to-neutral-900 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Newspaper className="w-4 h-4" /> Press Room
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            OrderIQ in the{' '}
            <span className="bg-gradient-to-r from-primary-300 via-accent-300 to-secondary-300 bg-clip-text text-transparent">
              News
            </span>
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-8">
            Latest press releases, media coverage, and resources for journalists and media partners.
          </p>
          <a href="mailto:press@orderiq.pk" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 transition-all">
            <Mail className="w-4 h-4" /> press@orderiq.pk
          </a>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-10">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((pr, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-neutral-50 rounded-2xl border border-neutral-200 hover:shadow-md transition-shadow group">
                <div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                    <Calendar className="w-4 h-4" />{pr.date} · {pr.source}
                  </div>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{pr.title}</h3>
                </div>
                <button className="mt-3 sm:mt-0 flex items-center gap-1 text-sm text-primary-600 font-semibold hover:text-primary-700 flex-shrink-0">
                  Read more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-10">Media Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {coverage.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">{c.outlet}</span>
                  <span className="text-sm text-neutral-400">{c.date}</span>
                </div>
                <p className="text-neutral-700 font-medium italic">"{c.headline}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Media Kit</h2>
          <p className="text-neutral-600 mb-10">Download official assets for press use. Please review our brand guidelines before publishing.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaAssets.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow group">
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{a.name}</p>
                  <p className="text-xs text-neutral-400">{a.size}</p>
                </div>
                <button className="w-9 h-9 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Media Enquiries</h2>
          <p className="text-primary-100 mb-8">For interviews, quotes, or press information, reach out to our communications team.</p>
          <a href="mailto:press@orderiq.pk" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl">
            <Mail className="mr-2 w-5 h-5" /> press@orderiq.pk
          </a>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default Press;
