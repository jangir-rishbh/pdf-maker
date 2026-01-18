'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Shield, Zap } from 'lucide-react';

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleGeneratePDF = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('tool', 'image-to-pdf');

      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Processing',
      description: 'Convert files to PDF in seconds'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Private',
      description: 'Files are automatically deleted after processing'
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'High Quality',
      description: 'Professional PDF output every time'
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create PDFs Instantly
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Convert images, documents, and text to professional PDFs in one click
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <FileUpload
            onFileSelect={handleFileSelect}
            multiple={true}
          />

          {uploadedFiles.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleGeneratePDF}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Tools */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick PDF Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Image to PDF',
              'Word to PDF',
              'PDF Merge',
              'PDF Split',
              'Add Password',
              'PDF to Image',
              'Text to PDF'
            ].map((tool, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 justify-center"
                asChild
              >
                <a href={`/tools?tool=${tool.toLowerCase().replace(/\s+/g, '-')}`}>
                  {tool}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
