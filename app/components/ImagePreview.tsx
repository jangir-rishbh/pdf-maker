'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface ImagePreviewProps {
  images: { url: string; name: string }[];
  onDownload: (index: number) => void;
}

export default function ImagePreview({ images, onDownload }: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Generated Images
      </h3>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.url}
              alt={`Page ${index + 1}`}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
              Page {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Download Options */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => onDownload(-1)} // Download all
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Download All as ZIP
        </Button>
        
        {images.map((_, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onDownload(index)} // Download individual
            className="text-sm"
          >
            <Download className="mr-1 h-3 w-3" />
            Page {index + 1}
          </Button>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <img
              src={images[selectedImage].url}
              alt={`Page ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <span className="font-medium">Page {selectedImage + 1}</span>
              <Button
                onClick={() => onDownload(selectedImage)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
