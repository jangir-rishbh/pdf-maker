import Layout from '@/components/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 6, 2024</p>
            
            <p className="text-lg text-gray-600 mb-6">
              At PDF Maker, we take your privacy seriously. This Privacy Policy explains 
              how we collect, use, and protect your information when you use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Files You Upload</h3>
            <p className="text-gray-600 mb-4">
              When you use our PDF conversion tools, you may upload files to our servers. 
              We process these files temporarily to generate your PDFs.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic Data Collection</h3>
            <p className="text-gray-600 mb-6">
              We may automatically collect certain technical information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Usage statistics and analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>To provide and improve our PDF conversion services</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To ensure security and prevent abuse</li>
              <li>To communicate with you about our services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Security and Privacy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic Deletion</h3>
            <p className="text-gray-600 mb-4">
              <strong>Your uploaded files are automatically deleted within 1 hour after processing.</strong> 
              We do not store your files permanently on our servers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Processing</h3>
            <p className="text-gray-600 mb-6">
              All file transfers are encrypted using HTTPS. Our servers use industry-standard 
              security measures to protect your data during processing.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-600 mb-6">
              We do not sell, rent, or share your personal information with third parties for 
              marketing purposes. We may share data only when:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Required by law or legal process</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With trusted service providers who assist in operating our service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600 mb-6">
              We use cookies to improve your experience and analyze website traffic. You can 
              disable cookies in your browser settings, but this may affect some features of our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Access information we have about you</li>
              <li>Request deletion of your data</li>
              <li>Opt out of data collection</li>
              <li>File a complaint with data protection authorities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our service is not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> privacy@pdfmaker.com<br />
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
