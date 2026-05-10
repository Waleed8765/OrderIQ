import React from 'react';
import { Shield, Calendar, Check, ExternalLink, AlertCircle } from 'lucide-react';
import PublicPageLayout from '../../layouts/PublicPageLayout';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
    <div className="text-neutral-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const rights = [
  {
    right: 'Right to Access',
    section: 'Section 10, PDPA 2023',
    desc: 'You may request a copy of the personal data OrderIQ holds about you, along with information about how and why it is processed.',
  },
  {
    right: 'Right to Correction',
    section: 'Section 11, PDPA 2023',
    desc: 'You may ask us to correct inaccurate, incomplete, or outdated personal data held in our systems.',
  },
  {
    right: 'Right to Erasure',
    section: 'Section 12, PDPA 2023',
    desc: 'You may request deletion of your personal data where it is no longer needed for the purpose it was collected, subject to applicable legal retention requirements.',
  },
  {
    right: 'Right to Data Portability',
    section: 'Section 13, PDPA 2023',
    desc: 'You may request your personal data in a structured, commonly used, machine-readable format for transfer to another service provider.',
  },
  {
    right: 'Right to Object',
    section: 'Section 14, PDPA 2023',
    desc: 'You may object to the processing of your personal data for direct marketing, profiling, or where processing is based on our legitimate interests.',
  },
  {
    right: 'Right to Withdraw Consent',
    section: 'Section 9, PDPA 2023',
    desc: 'Where processing is based on your consent, you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal.',
  },
  {
    right: 'Right to Lodge a Complaint',
    section: 'Section 30, PDPA 2023',
    desc: 'You may file a complaint with the National Commission for Personal Data Protection (NCPDP) if you believe your data rights have been violated.',
  },
];

const laws = [
  {
    title: 'Personal Data Protection Act, 2023 (PDPA)',
    body: 'Pakistan\'s primary data protection legislation. The PDPA establishes rights for data subjects, obligations for data controllers and processors, and creates the National Commission for Personal Data Protection (NCPDP) as the regulatory authority.',
    badge: 'Primary Law',
    color: 'bg-primary-100 text-primary-700 border-primary-200',
  },
  {
    title: 'Prevention of Electronic Crimes Act, 2016 (PECA)',
    body: 'Criminalises unauthorised access to data, data interference, electronic fraud, and identity theft. OrderIQ implements technical safeguards in compliance with PECA to protect user data from cyber threats.',
    badge: 'Cybercrime',
    color: 'bg-accent-100 text-accent-700 border-accent-200',
  },
  {
    title: 'Electronic Transactions Ordinance, 2002 (ETO)',
    body: 'Provides legal recognition for electronic records and digital signatures. All electronic contracts, order confirmations, and receipts issued by OrderIQ are valid under the ETO.',
    badge: 'E-Commerce',
    color: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  },
  {
    title: 'Pakistan Telecommunication (Re-organisation) Act, 1996',
    body: 'Regulates electronic communications in Pakistan. OrderIQ\'s use of SMS and electronic communications complies with PTA guidelines issued under this Act.',
    badge: 'Telecom',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
];

const DataProtection = () => {
  return (
    <PublicPageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 border-b border-neutral-100">
        <div className="max-w-content mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Data Protection &amp; Pakistani Law
            </h1>
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

          {/* Notice Banner */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mb-10 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-primary-800 text-sm leading-relaxed">
              OrderIQ is a Pakistani company operating under Pakistani law. This page explains how we comply with
              the <strong>Personal Data Protection Act, 2023 (PDPA)</strong> and other applicable Pakistani regulations.
              Our data practices are governed by these laws, not foreign frameworks.
            </p>
          </div>

          <Section title="1. Our Legal Framework">
            <p>
              As a company incorporated and operating in Pakistan, OrderIQ's data protection obligations are defined
              by Pakistani legislation. The primary law governing how we collect, store, use, and share your personal
              data is the <strong className="text-neutral-800">Personal Data Protection Act, 2023 (PDPA)</strong>,
              enacted by the Parliament of Pakistan and enforced by the
              <strong className="text-neutral-800"> National Commission for Personal Data Protection (NCPDP)</strong>.
            </p>
            <p>
              We also comply with the Prevention of Electronic Crimes Act, 2016 (PECA), the Electronic Transactions
              Ordinance, 2002 (ETO), and all applicable directives issued by the Pakistan Telecommunication Authority (PTA).
            </p>
          </Section>

          <Section title="2. Applicable Laws at a Glance">
            <div className="space-y-4 mt-2">
              {laws.map((law, i) => (
                <div key={i} className={`rounded-xl p-5 border ${law.color.split(' ').slice(2).join(' ')} bg-white`}>
                  <div className="flex items-start gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${law.color}`}>
                      {law.badge}
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900 mb-1">{law.title}</p>
                      <p className="text-sm text-neutral-600">{law.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="3. Data Controller">
            <p>
              Under the PDPA 2023, OrderIQ acts as the <strong className="text-neutral-800">Data Controller</strong> —
              the entity that determines the purpose and means of processing your personal data.
            </p>
            <p>
              We have designated a <strong className="text-neutral-800">Data Protection Officer (DPO)</strong> responsible
              for overseeing compliance with the PDPA. You may contact our DPO directly for any data-related concerns:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Email:</strong> privacy@orderiq.pk</li>
              <li><strong>Response time:</strong> Within 14 working days as required by PDPA Section 17</li>
            </ul>
          </Section>

          <Section title="4. Legal Bases for Processing (PDPA Section 4)">
            <p>Under the PDPA 2023, we process your personal data based on the following lawful grounds:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-neutral-800">Consent:</strong> You have given clear, informed, and freely
                withdrawable consent for a specific purpose (e.g., marketing communications, optional analytics).
              </li>
              <li>
                <strong className="text-neutral-800">Contractual necessity:</strong> Processing is required to fulfil
                your orders, manage your account, or deliver the services you have requested.
              </li>
              <li>
                <strong className="text-neutral-800">Legal obligation:</strong> Processing is necessary to comply
                with applicable Pakistani laws (e.g., tax records, regulatory reporting to PTA or FBR).
              </li>
              <li>
                <strong className="text-neutral-800">Legitimate interests:</strong> Processing for fraud prevention,
                platform security, and improving service quality — balanced against your rights.
              </li>
            </ul>
          </Section>

          <Section title="5. Your Rights Under the PDPA 2023">
            <p>
              As a data subject under the Personal Data Protection Act, 2023, you have the following rights.
              All requests are handled within <strong>14 working days</strong> as mandated by the PDPA.
            </p>
            <div className="mt-4 space-y-3">
              {rights.map((r, i) => (
                <div key={i} className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{r.right}</p>
                    <p className="text-xs text-primary-600 font-medium mb-1">{r.section}</p>
                    <p className="text-sm text-neutral-600">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              To exercise any right, email <a href="mailto:privacy@orderiq.pk" className="text-primary-600 hover:underline">privacy@orderiq.pk</a>.
              We will acknowledge your request within <strong>3 working days</strong> and resolve it within 14 working days.
            </p>
          </Section>

          <Section title="6. Cross-Border Data Transfers (PDPA Section 19)">
            <p>
              The PDPA 2023 regulates the transfer of personal data outside Pakistan. Where we use third-party services
              based outside Pakistan (e.g., cloud hosting, analytics), we ensure that adequate safeguards are in place,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transfer only to countries with an adequate level of protection as approved by the NCPDP</li>
              <li>Standard contractual clauses binding third-party processors to PDPA-equivalent obligations</li>
              <li>Your explicit consent where required for specific sensitive transfers</li>
            </ul>
            <p>
              We do not sell or transfer your personal data to foreign governments or foreign commercial entities
              for marketing purposes.
            </p>
          </Section>

          <Section title="7. Data Retention (PDPA Section 16)">
            <p>
              We retain personal data only for as long as necessary to fulfil the purpose it was collected for,
              or as required by Pakistani law:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Retained while your account is active; deleted within 30 days of closure.</li>
              <li><strong>Order records:</strong> Retained for 6 years for tax compliance under the Income Tax Ordinance, 2001.</li>
              <li><strong>Communication logs:</strong> Retained for 3 years in line with PECA record-keeping requirements.</li>
              <li><strong>Analytics data:</strong> Aggregated and anonymised within 12 months of collection.</li>
            </ul>
          </Section>

          <Section title="8. Data Security (PDPA Section 18)">
            <p>
              OrderIQ implements technical and organisational security measures as required by Section 18 of the PDPA
              2023, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>End-to-end TLS encryption for all data in transit</li>
              <li>AES-256 encryption for sensitive data at rest</li>
              <li>Role-based access control and least-privilege principles</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Incident response plan tested at least annually</li>
            </ul>
          </Section>

          <Section title="9. Data Breach Notification (PDPA Section 21)">
            <p>
              In the event of a personal data breach, OrderIQ will:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Notify the <strong className="text-neutral-800">National Commission for Personal Data Protection (NCPDP)</strong> within
                <strong> 72 hours</strong> of becoming aware of the breach, as required by the PDPA.
              </li>
              <li>
                Notify affected data subjects without undue delay if the breach is likely to result in significant harm
                to their rights or freedoms.
              </li>
              <li>
                Maintain a breach register and cooperate fully with any NCPDP investigation.
              </li>
            </ul>
          </Section>

          <Section title="10. Complaints &amp; Regulatory Authority">
            <p>
              If you believe OrderIQ has not handled your personal data in accordance with the PDPA 2023, you have the
              right to lodge a complaint with the regulatory authority:
            </p>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mt-3">
              <p className="font-bold text-neutral-900 mb-1">National Commission for Personal Data Protection (NCPDP)</p>
              <p className="text-sm text-neutral-600 mb-3">
                The NCPDP is the statutory body established under the PDPA 2023 to enforce data protection
                rights and investigate complaints in Pakistan.
              </p>
              <a
                href="https://www.moitt.gov.pk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700"
              >
                Ministry of IT &amp; Telecom — www.moitt.gov.pk
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-4">
              We strongly encourage you to contact us first — most concerns can be resolved directly and quickly.
            </p>
          </Section>

          <Section title="11. Contact Our Data Protection Officer">
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> privacy@orderiq.pk</li>
              <li><strong>Subject line:</strong> "Data Protection Request — [Your Name]"</li>
              <li><strong>Response time:</strong> Within 3 working days (acknowledgement), 14 working days (resolution)</li>
              <li><strong>Postal address:</strong> Data Protection Officer, OrderIQ, FAST-NUCES Campus, Block B, Faisal Town, Lahore, 54700, Pakistan</li>
            </ul>
          </Section>

        </div>
      </div>
    </PublicPageLayout>
  );
};

export default DataProtection;
