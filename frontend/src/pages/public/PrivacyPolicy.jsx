import React from 'react';
import { Lock, Calendar } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
    <div className="text-neutral-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <PublicPageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-16 border-b border-neutral-100">
        <div className="max-w-content mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Privacy Policy</h1>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
            <p className="text-blue-800 text-sm font-medium">
              Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have. We do not sell your personal data to third parties.
            </p>
          </div>

          <Section title="1. Introduction">
            <p>OrderIQ ("we," "us," or "our") operates an AI-powered food ordering platform. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our website, mobile experience, and related services (the "Service").</p>
            <p>By using OrderIQ, you consent to the data practices described in this policy. If you have questions, please contact our Data Protection team at privacy@orderiq.pk.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong className="text-neutral-800">Information you provide directly:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account registration details (name, email, phone number, password)</li>
              <li>Delivery addresses</li>
              <li>Payment information (processed securely via third-party payment providers; we do not store raw card numbers)</li>
              <li>Order history and preferences</li>
              <li>Communications with our support team</li>
              <li>Reviews and ratings you submit</li>
            </ul>
            <p className="mt-3"><strong className="text-neutral-800">Information collected automatically:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and approximate location</li>
              <li>Usage data (pages visited, features used, click patterns)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Order and interaction timestamps</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfil your orders</li>
              <li>Provide customer support</li>
              <li>Send order confirmations, updates, and receipts</li>
              <li>Power our AI-based food recommendations</li>
              <li>Calculate and apply loyalty rewards</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Improve our platform through analytics</li>
              <li>Comply with legal obligations</li>
              <li>Send promotional communications (with your consent; you may opt out at any time)</li>
            </ul>
          </Section>

          <Section title="4. Sharing Your Information">
            <p>We share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-neutral-800">Restaurant partners:</strong> We share order details (name, delivery address, order items) with the restaurant fulfilling your order.</li>
              <li><strong className="text-neutral-800">Payment processors:</strong> We use Stripe and JazzCash to process payments securely. These providers have their own privacy policies.</li>
              <li><strong className="text-neutral-800">Analytics providers:</strong> Aggregated, anonymised usage data may be shared with analytics services.</li>
              <li><strong className="text-neutral-800">Legal requirements:</strong> We may disclose data when required by law, regulation, or court order.</li>
              <li><strong className="text-neutral-800">Business transfers:</strong> If OrderIQ is acquired, your data may be transferred as part of that transaction.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data to advertisers or third-party marketers.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting privacy@orderiq.pk. We will respond within 30 days.</p>
            <p>Certain data may be retained for longer periods where required by law (e.g., transaction records for tax compliance — typically 7 years).</p>
          </Section>

          <Section title="6. Security">
            <p>We implement industry-standard security measures including encryption in transit (TLS), secure password hashing (bcrypt), and access controls. However, no system is 100% secure. We encourage you to use a strong, unique password and to notify us immediately of any suspected breach.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time.</li>
              <li><strong>Restrict processing:</strong> Ask us to limit how we use your data in certain circumstances.</li>
            </ul>
            <p>To exercise any right, email privacy@orderiq.pk. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Cookies">
            <p>We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how you use our platform. See our Cookie Policy for full details.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such data, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent platform notice at least 14 days before the change takes effect. Continued use of the Service after the effective date constitutes acceptance.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For privacy-related questions or to exercise your rights:</p>
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

export default PrivacyPolicy;
