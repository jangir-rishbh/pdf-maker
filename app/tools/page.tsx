'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  FileText, 
  Lock, 
  Scissors, 
  Merge, 
  Type,
  Download,
  Upload
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  acceptedTypes?: string[];
}

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ url: string; name: string }[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      id: 'image-to-pdf',
      name: 'Image to PDF',
      icon: <Image className="h-6 w-6" />,
      description: 'Convert JPG, PNG, and other images to PDF',
      acceptedTypes: ['image/*']
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      icon: <FileText className="h-6 w-6" />,
      description: 'Convert Word documents to PDF',
      acceptedTypes: ['.doc', '.docx']
    },
    {
      id: 'pdf-merge',
      name: 'PDF Merge',
      icon: <Merge className="h-6 w-6" />,
      description: 'Combine multiple PDFs into one',
      acceptedTypes: ['.pdf']
    },
    {
      id: 'pdf-split',
      name: 'PDF Split',
      icon: <Scissors className="h-6 w-6" />,
      description: 'Split PDF into multiple files',
      acceptedTypes: ['.pdf']
    },
    {
      id: 'pdf-password',
      name: 'Add Password',
      icon: <Lock className="h-6 w-6" />,
      description: 'Protect PDF with password',
      acceptedTypes: ['.pdf']
    },
    {
      id: 'pdf-to-image',
      name: 'PDF to Image',
      icon: <Upload className="h-6 w-6" />,
      description: 'Convert PDF pages to images',
      acceptedTypes: ['.pdf']
    },
    {
      id: 'text-to-pdf',
      name: 'Text to PDF',
      icon: <Type className="h-6 w-6" />,
      description: 'Convert text files to PDF',
      acceptedTypes: ['.txt']
    }
  ];

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setUploadedFiles([]);
  };

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleProcess = async () => {
    if (!selectedTool || uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('tool', selectedTool.id);

      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF processing failed');
      }

      if (selectedTool.id === 'pdf-to-image') {
        // Handle ZIP file with HTML pages
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create sample images for preview (in real implementation, extract from ZIP)
        const sampleImages = [];
        const pageCount = 3; // Estimate or get from PDF
        
        for (let i = 1; i <= pageCount; i++) {
          // Create a simple preview image
          sampleImages.push({
            url: `data:image/svg+xml;base64,${btoa(`
              <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#ffffff" stroke="#333333" stroke-width="2"/>
                <text x="50%" y="40%" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#333333">
                  PDF Page ${i}
                </text>
                <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="#666666">
                  Click to download HTML file
                </text>
                <rect x="10" y="10" width="60" height="20" fill="#3b82f6" rx="2"/>
                <text x="40" y="24" text-anchor="middle" font-family="Arial" font-size="10" fill="white">
                  Page ${i}
                </text>
              </svg>
            `)}`,
            name: `page-${i}.html`
          });
        }
        setGeneratedImages(sampleImages);
        
        // Store ZIP URL for download
        setZipUrl(url);
      } else {
        // Download the PDF for other tools
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTool.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (index: number) => {
    if (index === -1) {
      // Download all as ZIP
      if (zipUrl) {
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'pdf-images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      // Download individual image
      const image = generatedImages[index];
      const a = document.createElement('a');
      a.href = image.url;
      a.download = image.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF Tools
          </h1>
          <p className="text-xl text-gray-600">
            Professional PDF conversion and editing tools
          </p>
        </div>

        {!selectedTool ? (
          /* Tools Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleToolSelect(tool)}
              >
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center text-blue-600">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Tool Interface */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                  {selectedTool.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.name}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedTool(null)}
              >
                Back to Tools
              </Button>
            </div>

            <FileUpload 
              onFileSelect={handleFileSelect}
              acceptedTypes={selectedTool.acceptedTypes}
              multiple={selectedTool.id === 'pdf-merge'}
            />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Process {selectedTool.name}
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Show Image Preview for PDF to Image */}
            {selectedTool?.id === 'pdf-to-image' && generatedImages.length > 0 && (
              <div className="mt-8">
                <ImagePreview 
                  images={generatedImages}
                  onDownload={handleDownload}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
