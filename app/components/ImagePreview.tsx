'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, CheckCircle2, Circle, Hash } from 'lucide-react';
import JSZip from 'jszip';

interface ImagePreviewProps {
  images: { url: string; name: string }[];
  onDownload: (index: number) => void;
}

export default function ImagePreview({ images, onDownload }: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [pageRange, setPageRange] = useState('');

  const parseRange = (range: string) => {
    const indices = new Set<number>();
    const parts = range.split(',');

    parts.forEach(part => {
      const trimPart = part.trim();
      if (trimPart.includes('-')) {
        const [start, end] = trimPart.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= images.length) indices.add(i - 1);
          }
        }
      } else {
        const num = parseInt(trimPart);
        if (!isNaN(num) && num >= 1 && num <= images.length) {
          indices.add(num - 1);
        }
      }
    });
    return indices;
  };

  const handleRangeDownload = async () => {
    const indices = parseRange(pageRange);
    if (indices.size === 0) {
      alert('Please enter valid page numbers (e.g. 1, 2-4)');
      return;
    }

    const zip = new JSZip();
    for (const index of Array.from(indices)) {
      const img = images[index];
      const response = await fetch(img.url);
      const blob = await response.blob();
      zip.file(img.name, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pages-${pageRange.replace(/\s+/g, '')}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Generated Pages ({images.length})
          </h3>
          <p className="text-sm text-gray-500">Pick pages to download</p>
        </div>

        {/* Page Range Selector */}
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 text-gray-400">
            <Hash className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="e.g. 1, 3-5"
            className="bg-transparent border-none focus:ring-0 text-sm w-32 md:w-48 outline-none"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
          />
          <Button
            size="sm"
            onClick={handleRangeDownload}
            disabled={!pageRange.trim()}
            className="bg-gray-900 hover:bg-black text-white rounded-lg h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${selectedIndices.has(index) ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => setSelectedImage(index)}
          >
            <div
              className="absolute top-2 right-2 z-10 p-1"
              onClick={(e) => toggleSelection(index, e)}
            >
              {selectedIndices.has(index) ? (
                <CheckCircle2 className="h-6 w-6 text-blue-500 fill-white" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 opacity-60 hover:opacity-100 fill-white/80" />
              )}
            </div>

            <img
              src={image.url}
              alt={`Page ${index + 1}`}
              className="w-full aspect-[1/1.414] object-contain bg-gray-50 p-2"
            />

            <div className={`absolute bottom-0 left-0 right-0 py-2 text-xs font-bold text-center transition-colors ${selectedIndices.has(index) ? 'bg-blue-500 text-white' : 'bg-gray-800 bg-opacity-60 text-white'
              }`}>
              PAGE {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-6 flex justify-center w-full">
        <div className="bg-white px-6 py-4 rounded-full shadow-2xl border flex gap-4 items-center">
          <Button
            onClick={() => onDownload(-1)}
            variant="outline"
            className="rounded-full px-6 border-gray-200 hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Zip (All)
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setSelectedImage(null)}
            >
              ✕ Close
            </Button>

            <img
              src={images[selectedImage].url}
              alt={`Page ${selectedImage + 1}`}
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
            />

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => onDownload(selectedImage)}
                className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-xl"
              >
                <Download className="mr-2 h-6 w-6" />
                Download Page {selectedImage + 1}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
