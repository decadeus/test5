import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-sm mb-2">Last updated: April 26, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          We attach great importance to protecting your personal data and privacy. This privacy policy aims to clearly inform you about how your information is processed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Types of Data Collected</h2>
        <ul className="list-disc list-inside">
          <li>Contact information (name, email address)</li>
          <li>Professional information related to real estate projects</li>
          <li>Connection data (IP address, connection logs)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Use of Data</h2>
        <ul className="list-disc list-inside">
          <li>Manage business relationships</li>
          <li>Optimize your user experience</li>
          <li>Communicate information about real estate projects and partner agencies</li>
          <li>Implement a tracking and emailing module for professional users</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Data Storage and Security</h2>
        <p>
          Data is stored on the Supabase platform, selected for its reliability and security guarantees. We implement all necessary technical measures to protect your data from unauthorized access, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Absolute Confidentiality</h2>
        <ul className="list-disc list-inside">
          <li>Your exchanges with us are strictly confidential.</li>
          <li>No resale or rental of your data to third parties.</li>
          <li>Access to personal information is restricted to authorized personnel only.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Data Retention Period</h2>
        <p>
          Data is kept for as long as necessary for the purposes mentioned above, unless a longer legal retention period is required.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Your Rights</h2>
        <p>
          In accordance with the applicable European regulation (GDPR), you have the following rights:
        </p>
        <ul className="list-disc list-inside">
          <li>Access to your data</li>
          <li>Rectification of your data</li>
          <li>Deletion of your data</li>
          <li>Restriction of processing</li>
          <li>Objection to processing</li>
          <li>Data portability</li>
        </ul>
        <p className="mt-2">To exercise your rights, please contact us at: <a href="mailto:debeaumont@decadeus.com" className="text-blue-600 underline">debeaumont@decadeus.com</a></p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Changes to This Policy</h2>
        <p>
          This privacy policy may be modified at any time to reflect legal, regulatory, and technical changes. We invite you to consult it regularly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">9. Contact</h2>
        <p>
          Debeaumont Johann<br />
          Piaseczno, Poland<br />
          Email: <a href="mailto:debeaumont@decadeus.com" className="text-blue-600 underline">debeaumont@decadeus.com</a><br />
          (Phone: not available)
        </p>
      </section>
    </div>
  );
}
