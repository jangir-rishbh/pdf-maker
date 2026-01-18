import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const tool = formData.get('tool') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (tool === 'pdf-to-image') {
      return NextResponse.json({ error: 'Client-side processing required' }, { status: 400 });
    }

    let result: Uint8Array;
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
      default:
        return NextResponse.json({ error: 'Unsupported tool' }, { status: 400 });
    }

    const response = new NextResponse(result as any);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', 'attachment; filename="generated.pdf"');
    return response;
  } catch (error: any) {
    console.error('PDF processing error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process PDF' }, { status: 500 });
  }
}

async function convertImagesToPDF(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    let image = file.type === 'image/jpeg' ? await pdfDoc.embedJpg(imageBytes) : await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return pdfDoc.save();
}

async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const existingPdfBytes = await file.arrayBuffer();
    const existingPdf = await PDFDocument.load(existingPdfBytes);
    const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }
  return mergedPdf.save();
}

async function convertTextToPDF(file: File): Promise<Uint8Array> {
  const text = await file.text();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  page.drawText(text, { x: 50, y: 842 - 50, size: 12, color: rgb(0, 0, 0), maxWidth: 595 - 100 });
  return pdfDoc.save();
}
