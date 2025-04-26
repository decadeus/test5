// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">Privacy Policy - GDPR Compliance</h1>
        <p className="text-sm text-gray-500">Last updated: [DATE OF UPDATE]</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          This Privacy Policy explains how <strong>HOOMGE</strong> (the “Application”),
          operated by <strong>DEBEAUMONT Johann</strong> (“we”, “us”), collects, uses,
          and protects your personal data in compliance with Regulation (EU) 2016/679
          (the “GDPR”).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Definitions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Personal data:</strong> any information relating to an identified or identifiable natural person.</li>
          <li><strong>Processing:</strong> any operation performed on personal data (collection, storage, etc.).</li>
          <li><strong>Data subject:</strong> the individual whose personal data are processed.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Data Controller</h2>
        <p>
          <strong>DEBEAUMONT Johann</strong><br />
          Piaseczno, Poland<br />
          <a href="mailto:debeaumont@decadeus.com" className="underline hover:text-blue-600">
            debeaumont@decadeus.com
          </a>
        </p>
      </section>

      <section className="space-y-4 overflow-x-auto">
        <h2 className="text-2xl font-semibold">4. Data We Collect</h2>
        <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Examples</th>
              <th className="p-2 text-left">Legal Basis</th>
              <th className="p-2 text-left">Retention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Identification</td>
              <td className="p-2">E-mail address</td>
              <td className="p-2">Contract performance</td>
              <td className="p-2">3 years after last interaction</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Connection</td>
              <td className="p-2">IP address, logs</td>
              <td className="p-2">Legitimate interest (security)</td>
              <td className="p-2">13 months</td>
            </tr>
            <tr>
              <td className="p-2">Developer Account Data</td>
              <td className="p-2">E-mail address</td>
              <td className="p-2">Contract performance</td>
              <td className="p-2">Lifetime + 3 years</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Favourites Cookie</td>
              <td className="p-2">Cookie ID & project IDs</td>
              <td className="p-2">Legitimate interest (functionality)</td>
              <td className="p-2">12 months</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Purposes of Processing</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide and operate the Application</li>
          <li>Manage customer relations and support</li>
          <li>Improve services and user experience</li>
          <li>Ensure security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Legal Bases</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Consent, where required</li>
          <li>Performance of a contract</li>
          <li>Legitimate interests</li>
          <li>Compliance with legal obligations</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Data Recipients</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Internal teams (need-to-know basis)</li>
          <li>Hosting and service providers under confidentiality</li>
          <li>Authorities when required by law</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Transfers Outside the EU</h2>
        <p>Transfers are protected by standard contractual clauses or adequacy decisions.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Security Measures</h2>
        <p>We implement encryption, access controls, backups and pseudonymisation.</p>
      </section>

      <section className="space-y-4 overflow-x-auto">
        <h2 className="text-2xl font-semibold">10. Cookies &amp; Trackers</h2>
        <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Purpose</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Consent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Necessary cookies</td>
              <td className="p-2">Site functionality</td>
              <td className="p-2">Session</td>
              <td className="p-2">Not required</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Analytics cookies</td>
              <td className="p-2">Not in use</td>
              <td className="p-2">–</td>
              <td className="p-2">–</td>
            </tr>
            <tr>
              <td className="p-2">Favourites cookie</td>
              <td className="p-2">Saves visitor favourites</td>
              <td className="p-2">12 months</td>
              <td className="p-2">Not required</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">11. Your Rights</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Access your personal data</li>
          <li>Rectify incorrect data</li>
          <li>Erase data (“right to be forgotten”)</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Object to processing based on legitimate interests</li>
          <li>Withdraw consent at any time</li>
          <li>Not be subject to automated decisions</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">12. Changes to This Policy</h2>
        <p>We may update this policy for legal or technical changes and will notify you accordingly.</p>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-semibold">13. Contact</h2>
        <p>
          For any questions regarding this policy, contact{' '}
          <a href="mailto:debeaumont@decadeus.com" className="underline hover:text-blue-600">
            debeaumont@decadeus.com
          </a>.
        </p>
      </section>
    </main>
  );
}
