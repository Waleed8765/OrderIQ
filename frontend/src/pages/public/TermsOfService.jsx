import React from 'react';
import { Scale, Calendar } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
    <div className="text-neutral-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const TermsOfService = () => {
  return (
    <PublicPageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-white py-16 border-b border-neutral-100">
        <div className="max-w-content mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Terms of Service</h1>
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
            <p className="text-amber-800 text-sm font-medium">
              Please read these Terms of Service carefully before using OrderIQ. By accessing or using our platform, you agree to be bound by these terms.
            </p>
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using the OrderIQ platform — including our website, mobile experience, and related services (collectively, the "Service") — you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the Service.</p>
            <p>These Terms constitute a legally binding agreement between you ("User," "you," or "your") and OrderIQ ("we," "us," or "our"), a product developed in Pakistan.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>OrderIQ is an AI-powered food ordering and restaurant management platform that facilitates connections between customers and restaurant partners. Our services include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Online food ordering and delivery coordination</li>
              <li>QR code-based dine-in ordering</li>
              <li>Restaurant management tools and dashboards</li>
              <li>Loyalty rewards programmes</li>
              <li>AI-powered food discovery and recommendations</li>
              <li>Real-time order tracking</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <p>To access certain features of OrderIQ, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain the security of your account password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorised access to your account</li>
            </ul>
            <p>You must be at least 13 years of age to create an account. Users under 18 require parental consent.</p>
          </Section>

          <Section title="4. Orders and Payments">
            <p>When you place an order through OrderIQ:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are entering into a contract directly with the restaurant for the supply of food and beverage</li>
              <li>OrderIQ acts as a technology intermediary and is not a party to the food supply contract</li>
              <li>Payment is processed securely at the time of order placement</li>
              <li>Prices displayed include applicable taxes unless otherwise stated</li>
              <li>Delivery fees are shown at checkout before payment</li>
            </ul>
          </Section>

          <Section title="5. Cancellations and Refunds">
            <p>Orders may be cancelled within 2 minutes of placement if not yet accepted by the restaurant. After acceptance, cancellation is subject to the restaurant's discretion. Refunds for eligible cancellations are processed within 3–5 business days to the original payment method.</p>
            <p>In the event of incorrect, missing, or significantly delayed orders, please contact our support team within 24 hours with evidence. OrderIQ will assess each case individually and may offer a refund, credit, or replacement at our discretion.</p>
          </Section>

          <Section title="6. Restaurant Partner Obligations">
            <p>Restaurants that partner with OrderIQ agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain accurate, up-to-date menu information including allergen data</li>
              <li>Fulfil orders placed through the platform in a timely manner</li>
              <li>Maintain all required food safety licences and certifications</li>
              <li>Comply with all applicable local health and safety regulations</li>
              <li>Not engage in discriminatory practices against any customer</li>
            </ul>
          </Section>

          <Section title="7. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Submit false, misleading, or fraudulent orders or reviews</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Scrape, crawl, or otherwise extract data from the platform without permission</li>
              <li>Harass, abuse, or harm other users or restaurant staff</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content on the OrderIQ platform — including but not limited to text, graphics, logos, icons, images, and software — is the property of OrderIQ or its content suppliers and is protected by applicable copyright and intellectual property laws.</p>
            <p>You are granted a limited, non-exclusive, non-transferable licence to access and use the Service for personal, non-commercial purposes.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, OrderIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the Service.</p>
            <p>OrderIQ's total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid to OrderIQ in the 90 days preceding the claim.</p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes via email or a prominent notice on our platform. Your continued use of the Service after such notification constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Lahore, Pakistan.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> legal@orderiq.pk</li>
              <li><strong>Address:</strong> OrderIQ, FAST-NUCES Campus, Block B, Faisal Town, Lahore, Pakistan</li>
            </ul>
          </Section>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default TermsOfService;
