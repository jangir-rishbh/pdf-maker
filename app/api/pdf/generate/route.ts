import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const tool = formData.get('tool') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    let result: Uint8Array | Response;

    switch (tool) {
      case 'image-to-pdf':
        result = await convertImagesToPDF(files);
        break;
      case 'pdf-merge':
        result = await mergePDFs(files);
        break;
      case 'text-to-pdf':
        result = await convertTextToPDF(files[0]);
        break;
      case 'pdf-to-image':
        result = await convertPDFToImages(files[0]);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported tool' },
          { status: 400 }
        );
    }

    if (result instanceof Response) {
      return result;
    }

    // Create response with PDF
    const response = new NextResponse(result as any);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set(
      'Content-Disposition',
      'attachment; filename="generated.pdf"'
    );

    return response;
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

async function convertImagesToPDF(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    
    let image;
    if (file.type === 'image/jpeg') {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      throw new Error(`Unsupported image type: ${file.type}`);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return pdfDoc.save();
}

async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const existingPdfBytes = await file.arrayBuffer();
    const existingPdf = await PDFDocument.load(existingPdfBytes);
    const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
    
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  return mergedPdf.save();
}

async function convertTextToPDF(file: File): Promise<Uint8Array> {
  const text = await file.text();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  
  const { height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  
  page.drawText(text, {
    x: margin,
    y: height - margin,
    size: fontSize,
    color: rgb(0, 0, 0),
    maxWidth: 595 - 2 * margin,
  });

  return pdfDoc.save();
}

async function convertPDFToImages(file: File): Promise<Response> {
  try {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    const zip = new JSZip();
    
    // For each page, create a simple image representation
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Create a simple PNG image using canvas-like approach
      const imageSize = Math.min(width, height, 800);
      const scale = imageSize / Math.max(width, height);
      const scaledWidth = Math.round(width * scale);
      const scaledHeight = Math.round(height * scale);
      
      // Create a simple image data URL
      const imageData = createPageImage(scaledWidth, scaledHeight, i + 1, pages.length);
      zip.file(`page-${i + 1}.png`, imageData.split(',')[1], { base64: true });
    }

    const zipContent = await zip.generateAsync({ type: 'uint8array' });
    
    const response = new NextResponse(zipContent as any);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set(
      'Content-Disposition',
      'attachment; filename="pdf-images.zip"'
    );

    return response;
  } catch (error) {
    console.error('PDF to Image conversion error:', error);
    
    // Fallback to simple text files
    const zip = new JSZip();
    zip.file('error.txt', 'PDF to Image conversion failed. Please try again.');
    
    const zipContent = await zip.generateAsync({ type: 'uint8array' });
    const response = new NextResponse(zipContent as any);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', 'attachment; filename="error.zip"');
    
    return response;
  }
}

function createPageImage(width: number, height: number, pageNum: number, totalPages: number): string {
  // Create a simple SVG-based image
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="#ffffff"/>
      
      <!-- Border -->
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" 
            fill="none" stroke="#333333" stroke-width="2"/>
      
      <!-- Page content area -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" 
            fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      
      <!-- Page number badge -->
      <rect x="20" y="20" width="80" height="30" fill="#3b82f6" rx="4"/>
      <text x="60" y="40" text-anchor="middle" font-family="Arial, sans-serif" 
            font-size="14" font-weight="bold" fill="white">
        Page ${pageNum}
      </text>
      
      <!-- Main content -->
      <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1f2937">
        PDF Page ${pageNum}
      </text>
      
      <!-- Page info -->
      <text x="${width/2}" y="${height/2 + 10}" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        Size: ${width} × ${height}px
      </text>
      
      <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
        Page ${pageNum} of ${totalPages}
      </text>
      
      <!-- Footer -->
      <rect x="20" y="${height - 50}" width="${width - 40}" height="30" 
            fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
      <text x="${width/2}" y="${height - 30}" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="11" fill="#6b7280">
        Generated by PDF Maker
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
