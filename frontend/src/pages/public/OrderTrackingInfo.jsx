import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Clock, Bell, MapPin, CheckCircle, ChevronRight, Smartphone, Star
} from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const steps = [
  { step: '01', title: 'Place Your Order', desc: 'Browse the menu and checkout in seconds. Multiple payment methods accepted.', icon: Smartphone },
  { step: '02', title: 'Restaurant Confirms', desc: 'The restaurant acknowledges your order instantly and starts preparing your meal.', icon: CheckCircle },
  { step: '03', title: 'Live Kitchen Updates', desc: 'Real-time status updates: Preparing → Ready → On the Way, right in the app.', icon: Bell },
  { step: '04', title: 'Track on Map', desc: 'Watch your delivery rider move toward you on a live map with accurate ETA.', icon: MapPin },
  { step: '05', title: 'Delivered!', desc: 'Receive your order and instantly leave a review to help the community.', icon: Star },
];

const features = [
  { icon: Bell, title: 'Push Notifications', desc: 'Get notified at every stage — no need to keep the app open.', color: 'from-primary-500 to-accent-500' },
  { icon: MapPin, title: 'Live Map Tracking', desc: 'GPS-powered map shows your rider\'s exact location in real time.', color: 'from-secondary-500 to-primary-500' },
  { icon: Clock, title: 'Accurate ETAs', desc: 'Machine-learning models predict delivery times within ±2 minutes.', color: 'from-accent-500 to-secondary-500' },
  { icon: Truck, title: 'Multi-Stop Orders', desc: 'Track group orders and split deliveries with full visibility.', color: 'from-primary-600 to-secondary-600' },
];

const OrderTrackingInfo = () => {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-6">
            <Truck className="w-4 h-4" /> Real-Time Tracking
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Never Wonder{' '}
            <span className="bg-gradient-to-r from-secondary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              "Where's My Food?"
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            OrderIQ's live tracking gives you complete visibility from the moment you hit "order" to the moment it arrives at your door.
          </p>
          <Link
            to="/customer/home"
            className="inline-flex items-center justify-center px-8 py-4 bg-secondary-600 text-white font-semibold rounded-xl hover:bg-secondary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Order Now <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Your Order's Journey</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Five transparent steps from cart to doorstep — you're in the loop at every stage.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-secondary-200" />
            <div className="grid md:grid-cols-5 gap-6 relative">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex flex-col items-center justify-center mb-4 shadow-lg relative z-10">
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary-500 mb-1">STEP {s.step}</span>
                  <h3 className="font-bold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-neutral-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Tracking Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-shadow group">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-primary-600">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Experience stress-free delivery today</h2>
          <p className="text-secondary-100 mb-8">OrderIQ keeps you informed every step of the way.</p>
          <Link to="/register" className="inline-flex items-center px-10 py-4 bg-white text-secondary-700 font-bold rounded-xl hover:bg-secondary-50 transition-all shadow-xl">
            Sign Up Free <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
};

export default OrderTrackingInfo;
