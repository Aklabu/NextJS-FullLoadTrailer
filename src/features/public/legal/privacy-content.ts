// Draft privacy policy — awaiting final legal review before launch.

export const privacyContent = {
  badge: 'LEGAL',
  title: 'Privacy Policy',
  effectiveDate: 'September 19, 2026',
  intro:
    'FullTrailerLoad ("we", "us", or "our") is committed to protecting the privacy of the businesses and individuals who use our freight exchange platform. This Privacy Policy explains what information we collect, how we use and protect it, and the choices you have regarding your data. By using the Platform you agree to the practices described here.',
  sections: [
    {
      heading: 'Information We Collect',
      body: 'We collect information in three ways. First, information you provide directly during registration and use: company name, business address, email address, phone number, company role (Shipper, Broker, or Carrier), compliance documents (USDOT number, MC authority letter, Certificate of Insurance, business licence), password credentials, load and capacity listings, bid amounts and notes, in-platform messages, attachments, and post-job reviews. Second, information generated automatically by your use of the Platform: login timestamps, pages visited, searches performed, bid activity, job history, IP address, device type, and browser information. Third, information from third-party sources: FMCSA SAFER database lookups used to verify carrier authority and insurance status.',
    },
    {
      heading: 'How We Use Your Information',
      body: 'We use your information to create and manage your account and verify your identity and company credentials; to operate the Bulletin Board and Marketplace, including matching loads and capacity, processing bids and counteroffers, and generating booking confirmations with unique Master Job IDs; to facilitate in-platform messaging between transaction parties; to send transactional emails including bid notifications, booking confirmations, verification status updates, and account alerts; to enforce our Terms of Service, including anti-disintermediation rules; to detect and prevent fraud, abuse, and unauthorised access; to improve the Platform through analytics and usage data; and to comply with applicable legal obligations.',
    },
    {
      heading: 'Information Sharing',
      body: 'We share your information only in the following circumstances. With counterparties: we disclose the contact and company details necessary to facilitate a confirmed booking — typically after a bid is accepted and a Master Job ID is generated. With service providers: we engage vetted third-party vendors (hosting, email delivery, payment processing, analytics) who process data on our behalf under strict confidentiality obligations. With regulatory bodies: we may disclose information when required by law, court order, or FMCSA regulation. In connection with a business transfer: if FullTrailerLoad is acquired or merges with another entity, your data may be transferred as part of that transaction, subject to equivalent privacy protections. We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.',
    },
    {
      heading: 'Data Retention',
      body: 'We retain your account information and activity data for as long as your account remains active. Transaction records, booking confirmations, bid history, and audit logs are retained for a minimum of seven years for legal, accounting, and dispute resolution purposes even after account closure. Verification documents are retained for the period required by applicable regulatory obligations. You may request deletion of non-essential personal data at any time; however, we may retain data we are legally required to keep.',
    },
    {
      heading: 'Authentication and Security',
      body: 'The Platform uses JSON Web Token (JWT) authentication to manage user sessions. Tokens are short-lived and refreshed automatically. Passwords are hashed using industry-standard algorithms and are never stored in plain text. All data transmission between your browser and our servers is encrypted using TLS. Verification documents are stored in encrypted object storage with access restricted to authorised personnel. We conduct regular security reviews and follow responsible disclosure practices. Despite these measures, no system is completely immune to breach; we will notify affected users promptly in the event of a data security incident.',
    },
    {
      heading: 'Cookies and Tracking',
      body: 'We use strictly necessary cookies to maintain your authenticated session and remember your preferences. We use analytics cookies to understand how users interact with the Platform so we can improve it. We do not use advertising or cross-site tracking cookies. You can disable non-essential cookies through your browser settings; doing so will not prevent you from using the Platform but may affect certain preference features. We do not currently respond to Do Not Track browser signals, as no uniform standard for such signals exists.',
    },
    {
      heading: 'Your Rights',
      body: 'Depending on your jurisdiction, you may have the right to: access a copy of the personal data we hold about your account; request correction of inaccurate data; request deletion of your data, subject to our retention obligations; restrict or object to certain processing; and receive a portable copy of your data in a structured, machine-readable format. To exercise any of these rights, contact us at privacy@FullTrailerLoad.com. We will respond within 30 days. We may need to verify your identity before fulfilling a request.',
    },
    {
      heading: 'Third-Party Services and Links',
      body: 'The Platform integrates with the FMCSA SAFER database for carrier verification. We may also link to third-party resources for reference purposes. We are not responsible for the privacy practices of those third parties and encourage you to review their policies directly. Payment processing, where applicable, is handled by a PCI-compliant third-party provider; FullTrailerLoad does not store full payment card numbers.',
    },
    {
      heading: "Children's Privacy",
      body: 'FullTrailerLoad is a business-to-business platform intended exclusively for commercial use by adults aged 18 and over. We do not knowingly collect personal information from individuals under 18. If we become aware that a minor has provided personal information, we will delete it promptly. If you believe we have inadvertently collected such information, please contact us immediately.',
    },
    {
      heading: 'Changes to This Privacy Policy',
      body: 'We may update this Privacy Policy as our practices evolve or in response to changes in applicable law. When we make material changes, we will update the effective date at the top of this page and notify active users by email and through a notice on the Platform. Your continued use of the Platform after the updated policy takes effect constitutes acceptance of the revised terms.',
    },
  ],
};
