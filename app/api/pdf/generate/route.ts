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

    let pdfBytes: Uint8Array;

    switch (tool) {
      case 'image-to-pdf':
        pdfBytes = await convertImagesToPDF(files);
        break;
      case 'pdf-merge':
        pdfBytes = await mergePDFs(files);
        break;
      case 'text-to-pdf':
        pdfBytes = await convertTextToPDF(files[0]);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported tool' },
          { status: 400 }
        );
    }

    // Create response with PDF
    const response = new NextResponse(pdfBytes as any);
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
