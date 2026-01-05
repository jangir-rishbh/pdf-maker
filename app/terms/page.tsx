import Layout from '@/components/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 6, 2024</p>
            
            <p className="text-lg text-gray-600 mb-6">
              Welcome to PDF Maker! These Terms & Conditions govern your use of our 
              PDF conversion and editing services. By using our website, you agree to these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using PDF Maker, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              PDF Maker provides online tools for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Converting images, documents, and text files to PDF</li>
              <li>Merging multiple PDFs into one document</li>
              <li>Splitting PDFs into multiple files</li>
              <li>Adding password protection to PDFs</li>
              <li>Other PDF editing and conversion tools</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 mb-6">
              As a user of our service, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Only upload files that you have the right to process</li>
              <li>Not use our service for illegal or unauthorized purposes</li>
              <li>Not upload malicious files or viruses</li>
              <li>Not attempt to harm or disrupt our service</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. File Processing and Privacy</h2>
            <p className="text-gray-600 mb-6">
              <strong>Important:</strong> Your uploaded files are processed temporarily and 
              automatically deleted within 1 hour. We do not store your files permanently. 
              Please refer to our Privacy Policy for more details.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              The content, features, and functionality of PDF Maker are owned by us and are 
              protected by copyright, trademark, and other intellectual property laws. You may 
              not copy, modify, distribute, or create derivative works without our permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
            <p className="text-gray-600 mb-6">
              We strive to maintain high service availability, but we cannot guarantee that 
              the service will be uninterrupted or error-free. We may temporarily suspend or 
              modify the service for maintenance, updates, or other reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              PDF Maker is provided "as is" without warranties of any kind. We are not liable 
              for any damages arising from your use of our service, including but not limited 
              to data loss, business interruption, or any other consequential damages.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. File Size and Usage Limits</h2>
            <p className="text-gray-600 mb-6">
              To ensure fair usage and service quality, we may impose limits on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Maximum file size (typically 20-50MB per file)</li>
              <li>Number of files processed per day</li>
              <li>Concurrent processing limits</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Prohibited Content</h2>
            <p className="text-gray-600 mb-6">
              You may not use our service to process content that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Violates any laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains malicious code or viruses</li>
              <li>Is defamatory, obscene, or offensive</li>
              <li>Violates privacy rights of others</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Account Termination</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to suspend or terminate your access to our service if you 
              violate these terms or engage in prohibited activities.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may update these Terms & Conditions from time to time. Changes will be 
              effective immediately upon posting on our website. Your continued use of the 
              service constitutes acceptance of any changes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms are governed by and construed in accordance with the laws of India. 
              Any disputes will be resolved in the courts of Delhi, India.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms & Conditions, please contact us:
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> legal@pdfmaker.com<br />
              <strong>Phone:</strong> +91 98765 43210<br />
              <strong>Address:</strong> 123, Business Park, Delhi, India 110001
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
