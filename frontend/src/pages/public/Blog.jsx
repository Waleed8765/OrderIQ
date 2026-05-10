import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, Tag, Search, TrendingUp, Zap, Users } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const posts = [
  {
    id: 1,
    category: 'Product',
    title: 'Introducing AI-Powered Restaurant Recommendations',
    excerpt: 'We built a machine learning model that learns your food preferences over time. Here\'s how it works under the hood and why we think it changes food discovery forever.',
    author: 'Sara Khan',
    date: 'May 8, 2025',
    readTime: '6 min read',
    color: 'from-primary-500 to-accent-500',
    featured: true,
  },
  {
    id: 2,
    category: 'Engineering',
    title: 'How We Built Real-Time Order Tracking with WebSockets',
    excerpt: 'A deep-dive into our real-time infrastructure, from Socket.io setup to managing connections across thousands of concurrent users.',
    author: 'Usman Ali',
    date: 'Apr 22, 2025',
    readTime: '9 min read',
    color: 'from-secondary-500 to-primary-500',
  },
  {
    id: 3,
    category: 'Business',
    title: '5 Ways QR Menus Increased Table Turnover by 30%',
    excerpt: 'Our restaurant partners are seeing real results from QR dine-in. We break down the data and share the stories behind the numbers.',
    author: 'Ahmed Waleed',
    date: 'Apr 10, 2025',
    readTime: '4 min read',
    color: 'from-accent-500 to-secondary-500',
  },
  {
    id: 4,
    category: 'Design',
    title: 'Designing for Speed: Lessons from Building OrderIQ\'s UI',
    excerpt: 'Fast products need fast interfaces. Here are the design principles we use to keep the OrderIQ experience snappy and intuitive.',
    author: 'Fatima Noor',
    date: 'Mar 28, 2025',
    readTime: '5 min read',
    color: 'from-primary-600 to-secondary-600',
  },
  {
    id: 5,
    category: 'Engineering',
    title: 'Integrating WhatsApp as an Order Channel with Baileys',
    excerpt: 'How we extended OrderIQ to accept orders via WhatsApp, handling session management, media, and multi-step conversations.',
    author: 'Usman Ali',
    date: 'Mar 15, 2025',
    readTime: '8 min read',
    color: 'from-secondary-600 to-accent-600',
  },
  {
    id: 6,
    category: 'Product',
    title: 'The Loyalty Rewards System: Design Decisions & Trade-offs',
    excerpt: 'Points, tiers, redemption — we made a lot of decisions building our loyalty programme. This post walks through the ones that mattered most.',
    author: 'Ahmed Waleed',
    date: 'Mar 3, 2025',
    readTime: '7 min read',
    color: 'from-accent-600 to-primary-600',
  },
];

const catColors = {
  Product: 'bg-primary-100 text-primary-700',
  Engineering: 'bg-secondary-100 text-secondary-700',
  Business: 'bg-green-100 text-green-700',
  Design: 'bg-accent-100 text-accent-700',
};

const Blog = () => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const filtered = posts.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );
  const featured = posts.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured || catFilter !== 'All' || search);

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary-400/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" /> OrderIQ Blog
          </span>
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Stories from the{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Kitchen Table</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Product updates, engineering deep-dives, restaurant success stories and more.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!search && catFilter === 'All' && featured && (
        <section className="py-12 bg-white border-b border-neutral-100">
          <div className="max-w-content mx-auto px-6">
            <div className={`bg-gradient-to-br ${featured.color} rounded-3xl p-10 text-white`}>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">Featured Post</span>
              <h2 className="text-3xl font-bold mb-4 max-w-2xl">{featured.title}</h2>
              <p className="text-white/80 max-w-2xl mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>By {featured.author}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span><Clock className="inline w-4 h-4 mr-1" />{featured.readTime}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${catFilter === c ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-400'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(search || catFilter !== 'All' ? filtered : rest).map(post => (
              <article key={post.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className={`h-3 bg-gradient-to-r ${post.color}`} />
                <div className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catColors[post.category] || 'bg-neutral-100 text-neutral-600'}`}>{post.category}</span>
                  <h3 className="font-bold text-neutral-900 text-lg mt-3 mb-3 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>By {post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <div className="mt-4 text-xs text-neutral-400">{post.date}</div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-neutral-400">No posts found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in the loop</h2>
          <p className="text-primary-100 mb-8">Get the latest OrderIQ updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-5 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button className="px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-lg">Subscribe</button>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default Blog;
