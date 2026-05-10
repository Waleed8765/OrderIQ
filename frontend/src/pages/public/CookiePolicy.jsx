import React, { useState } from 'react';
import { Cookie, Calendar, ChevronDown } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
    <div className="text-neutral-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const cookieTable = [
  { name: 'orderiq_session', type: 'Essential', purpose: 'Keeps you logged in during your session.', duration: 'Session' },
  { name: 'orderiq_auth_token', type: 'Essential', purpose: 'Stores your JWT authentication token securely.', duration: '7 days' },
  { name: 'orderiq_cart', type: 'Functional', purpose: 'Remembers your cart items between visits.', duration: '24 hours' },
  { name: 'orderiq_prefs', type: 'Functional', purpose: 'Stores your cuisine and filter preferences.', duration: '30 days' },
  { name: '_ga, _gid', type: 'Analytics', purpose: 'Google Analytics — tracks usage patterns (anonymised).', duration: '2 years / 24h' },
  { name: 'hotjar_*', type: 'Analytics', purpose: 'Hotjar — records anonymised session replays for UX improvement.', duration: '1 year' },
];

const typeColors = {
  Essential: 'bg-red-100 text-red-700',
  Functional: 'bg-blue-100 text-blue-700',
  Analytics: 'bg-yellow-100 text-yellow-700',
  Marketing: 'bg-purple-100 text-purple-700',
};

const CookiePolicy = () => {
  const [consents, setConsents] = useState({ functional: true, analytics: false, marketing: false });

  return (
    <PublicPageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-50 to-white py-16 border-b border-neutral-100">
        <div className="max-w-content mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Cookie Policy</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: May 1, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work efficiently, to remember your preferences, and to provide information to the owners of the site.</p>
            <p>OrderIQ uses cookies and similar technologies (such as local storage and session storage) to improve your experience on our platform.</p>
          </Section>

          <Section title="2. Types of Cookies We Use">
            <p><strong className="text-neutral-800">Essential Cookies:</strong> These are necessary for the platform to function. They enable core features like authentication and cart management. You cannot opt out of these.</p>
            <p><strong className="text-neutral-800">Functional Cookies:</strong> These remember your preferences (e.g., saved addresses, cuisine filters) to improve your experience. They are optional but recommended.</p>
            <p><strong className="text-neutral-800">Analytics Cookies:</strong> These help us understand how visitors interact with OrderIQ. We use Google Analytics and Hotjar with anonymised data. These are optional.</p>
            <p><strong className="text-neutral-800">Marketing Cookies:</strong> We do not currently use third-party marketing or advertising cookies on our platform.</p>
          </Section>

          <Section title="3. Cookies We Use">
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700">Cookie Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable.map((c, i) => (
                    <tr key={i} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-neutral-800">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColors[c.type]}`}>{c.type}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{c.purpose}</td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Your Cookie Preferences">
            <p>You can manage your cookie preferences below. Note that disabling certain cookies may affect platform functionality.</p>

            {/* Consent Toggles */}
            <div className="mt-4 space-y-3">
              {/* Essential — always on */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">Essential Cookies</p>
                  <p className="text-xs text-neutral-500">Required for the platform to function. Cannot be disabled.</p>
                </div>
                <div className="w-10 h-6 bg-primary-600 rounded-full relative flex-shrink-0">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              {[
                { key: 'functional', label: 'Functional Cookies', desc: 'Remember your preferences and settings.' },
                { key: 'analytics', label: 'Analytics Cookies', desc: 'Help us understand usage patterns (anonymised).' },
                { key: 'marketing', label: 'Marketing Cookies', desc: 'Currently not in use on our platform.' },
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-neutral-500">{opt.desc}</p>
                  </div>
                  <button
                    onClick={() => setConsents(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                    className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors ${consents[opt.key] ? 'bg-primary-600' : 'bg-neutral-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${consents[opt.key] ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}

              <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all">
                Save Preferences
              </button>
            </div>
          </Section>

          <Section title="5. Managing Cookies via Your Browser">
            <p>You can also control cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or cookies from specific sites</li>
              <li>Set preferences for certain types of cookies</li>
            </ul>
            <p>Note that blocking all cookies will affect your ability to use certain features of OrderIQ, including staying logged in.</p>
          </Section>

          <Section title="6. Third-Party Cookies">
            <p>We use Google Analytics and Hotjar for platform analytics. These third-party services have their own cookie and privacy policies. We encourage you to review them:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Google Privacy Policy</a></li>
              <li><a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Hotjar Privacy Policy</a></li>
            </ul>
          </Section>

          <Section title="7. Contact Us">
            <p>For questions about our cookie practices:</p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> privacy@orderiq.pk</li>
              <li><strong>Address:</strong> OrderIQ, FAST-NUCES Campus, Block B, Faisal Town, Lahore, Pakistan</li>
            </ul>
          </Section>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default CookiePolicy;
