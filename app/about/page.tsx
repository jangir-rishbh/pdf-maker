import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              PDF Maker is your trusted online platform for all PDF conversion and editing needs. 
              We provide fast, secure, and easy-to-use tools that help you create professional PDFs 
              in just a few clicks.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To make PDF creation and editing accessible to everyone with a simple, reliable, 
              and secure online platform. We believe that document management should be easy 
              and efficient for individuals and businesses alike.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Fast Processing:</strong> Convert files to PDF in seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Secure & Private:</strong> Files are automatically deleted after processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>High Quality:</strong> Professional PDF output every time</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Free to Use:</strong> No registration required for basic features</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Multi-language Support:</strong> Available in Hindi and English</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Features</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Creation</h3>
                <p className="text-gray-600">
                  Convert images, Word documents, and text files to professional PDFs
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Editing</h3>
                <p className="text-gray-600">
                  Merge, split, and password-protect your PDF files
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Batch Processing</h3>
                <p className="text-gray-600">
                  Handle multiple files at once for increased productivity
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">
                  Works seamlessly on all devices and screen sizes
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions or feedback? We'd love to hear from you! Reach out to us at:
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> support@pdfmaker.com<br />
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
