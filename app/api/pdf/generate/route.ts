import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const tool = formData.get('tool') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (tool === 'pdf-to-image') {
      return await convertPDFToImagesPuppeteer(files[0]);
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

async function convertPDFToImagesPuppeteer(file: File): Promise<Response> {
  const pdfBytes = await file.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Inject PDF.js and process all pages in one go inside the browser
    const images = await page.evaluate(async (base64) => {
      // Load PDF.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      document.head.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument({ data: atob(base64) });
      const pdf = await loadingTask.promise;
      const pagesData = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Balanced quality/speed

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d')!;

        // Fill white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport }).promise;

        pagesData.push({
          name: `page-${i}.png`,
          content: canvas.toDataURL('image/png').split(',')[1] // Base64 part
        });
      }

      return pagesData;
    }, pdfBase64);

    const zip = new JSZip();
    for (const img of images) {
      zip.file(img.name, img.content, { base64: true });
    }

    const zipContent = await zip.generateAsync({ type: 'uint8array' });
    const response = new NextResponse(zipContent as any);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', 'attachment; filename="pdf-images.zip"');

    return response;

  } catch (error) {
    console.error('Puppeteer conversion error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
