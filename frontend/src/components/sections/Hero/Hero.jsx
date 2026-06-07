import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, Clock, Shield, QrCode } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredCards, setFeaturedCards] = useState([
    { id: 1, name: 'Savour Foods', rating: 4.9, cuisine: 'Pakistani • Desi', prepTime: '20-25 min', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop' },
    { id: 2, name: 'New Tikka', rating: 4.8, cuisine: 'Pakistani • BBQ', prepTime: '15-20 min', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
    { id: 3, name: 'Burger Lab', rating: 4.7, cuisine: 'Pakistani • Burgers', prepTime: '10-15 min', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop' },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const trustMetrics = [
    { value: '4.8', label: 'avg rating', icon: Star },
    { value: '500+', label: 'restaurants', icon: '' },
    { value: '14 min', label: 'avg prep time', icon: Clock },
    { value: 'Secure', label: 'payments', icon: Shield },
  ];

  return (
    <section className="relative isolate overflow-hidden pt-48 md:pt-32 pb-20 md:pb-24">
      {/* Animated mesh — isolate + z-0 keeps layers above parent bg-white (negative z-index was hidden behind the page) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-neutral-50/95" />
        {/* Slow rotating color wash — obvious directional motion */}
        <div
          className="absolute -inset-[45%] opacity-70 motion-safe:animate-hero-aurora motion-reduce:animate-none bg-[conic-gradient(from_200deg_at_50%_50%,rgba(155,93,229,0.22)_0deg,rgba(241,91,181,0.18)_100deg,rgba(0,187,249,0.16)_200deg,rgba(155,93,229,0.2)_360deg)] blur-3xl"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/[0.18] via-accent-500/[0.14] to-secondary-500/[0.16] bg-[length:300%_200%] motion-safe:animate-hero-shimmer motion-reduce:animate-none"
        />
        <div className="absolute inset-0 motion-safe:animate-hero-spot-purple motion-reduce:animate-none bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(155,93,229,0.32),transparent_58%)]" />
        <div className="absolute inset-0 motion-safe:animate-hero-spot-pink motion-reduce:animate-none bg-[radial-gradient(ellipse_60%_45%_at_100%_55%,rgba(241,91,181,0.22),transparent_52%)]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(126,60,194,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(126,60,194,0.1)_1px,transparent_1px)] bg-[size:2.25rem_2.25rem] sm:bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_78%_68%_at_50%_35%,black_22%,transparent_75%)] opacity-80 sm:opacity-100 motion-safe:animate-hero-grid-drift motion-reduce:animate-none"
        />
        <div className="absolute top-[8%] -left-[8%] h-[min(28rem,55vw)] w-[min(28rem,55vw)] rounded-full bg-primary-400/50 blur-3xl motion-safe:animate-hero-blob motion-reduce:animate-none will-change-transform" />
        <div className="absolute top-[22%] -right-[12%] h-[min(26rem,50vw)] w-[min(26rem,50vw)] rounded-full bg-accent-400/45 blur-3xl motion-safe:animate-hero-blob-reverse motion-safe:[animation-delay:-4s] motion-reduce:animate-none will-change-transform" />
        <div className="absolute -bottom-[10%] left-[10%] h-[min(22rem,45vw)] w-[min(22rem,45vw)] rounded-full bg-secondary-400/40 blur-3xl motion-safe:animate-hero-blob-slow motion-safe:[animation-delay:-9s] motion-reduce:animate-none will-change-transform" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-[min(36rem,85vw)] w-[min(52rem,120vw)] rounded-full bg-gradient-to-tr from-primary-300/50 via-accent-200/40 to-secondary-300/45 blur-[80px] md:blur-[100px] motion-safe:animate-hero-pulse-glow motion-reduce:animate-none will-change-transform" />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-content mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Column: Value Prop & CTAs */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Order smarter across{' '}
              <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
                delivery, pickup, and dine‑in
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl">
              Discover great food, reorder instantly, and track every order—while restaurants run operations faster.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => {
                  const el = document.getElementById('restaurants');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    navigate('/customer/home');
                  }
                }}
                className="inline-flex items-center justify-center px-5 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Find restaurants
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/scan')}
                className="inline-flex items-center justify-center px-5 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-600 transition-colors w-full sm:w-auto"
              >
                <QrCode className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Scan QR for dine‑in
              </button>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center gap-6">
              {trustMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {metric.icon && <metric.icon className="w-4 h-4 text-success" />}
                  <div>
                    <span className="font-bold text-neutral-900">{metric.value}</span>
                    <span className="text-sm text-neutral-500 ml-1">{metric.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Cards */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Featured Card */}
              <div
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-1 transition-transform duration-300 hover:rotate-0"
                style={{ animationDelay: '200ms' }}
              >
                <div className="relative">
                  <img
                    src={featuredCards[0].image}
                    alt={featuredCards[0].name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">{featuredCards[0].name}</h3>
                      <p className="text-neutral-500">{featuredCards[0].cuisine}</p>
                    </div>
                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <span className="ml-1 font-bold text-green-700">{featuredCards[0].rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-500">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {featuredCards[0].prepTime}
                    </div>
                    <button
                      onClick={() => {
                        const el = document.getElementById('restaurants');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                          navigate('/customer/home');
                        }
                      }}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      View menu →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div
                className="absolute -bottom-8 left-2 md:-bottom-6 md:-left-6 bg-white rounded-xl shadow-lg p-4 w-56 md:w-64 motion-safe:animate-hero-card-float-left motion-reduce:-rotate-2"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={featuredCards[1].image} alt={featuredCards[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-neutral-900">{featuredCards[1].name}</h4>
                    <p className="text-xs md:text-sm text-neutral-500">{featuredCards[1].cuisine}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium ml-1">{featuredCards[1].rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-8 right-2 md:-top-6 md:-right-6 bg-white rounded-xl shadow-lg p-4 w-56 md:w-64 motion-safe:animate-hero-card-float-right motion-safe:[animation-delay:0.6s] motion-reduce:rotate-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={featuredCards[2].image} alt={featuredCards[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-neutral-900">{featuredCards[2].name}</h4>
                    <p className="text-xs md:text-sm text-neutral-500">{featuredCards[2].cuisine}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium ml-1">{featuredCards[2].rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
