import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface InvoicePDFData {
  invoiceNumber: string;
  issuedAt: Date;
  customerName: string;
  customerEmail: string;
  companyName: string;
  gstNo: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  totalAmount: number;
  pickupDate: Date;
  returnDate: Date;
  status: string;
}

export async function generateInvoicePDF(data: InvoicePDFData): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${data.invoiceNumber.replace(/\//g, '_')}.pdf`;
  const filePath = path.join(uploadsDir, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Header
    doc.fontSize(24).fillColor('#1E293B').text('TwinSix Rentals', { align: 'left' });
    doc.fontSize(10).fillColor('#64748B').text('Official Multi-Vendor Rental Invoice', { align: 'left' });
    doc.moveDown();

    // Invoice Meta Box
    doc.fontSize(16).fillColor('#0F172A').text(`INVOICE: ${data.invoiceNumber}`);
    doc.fontSize(10).fillColor('#475569')
       .text(`Status: ${data.status.toUpperCase()}`)
       .text(`Issued Date: ${new Date(data.issuedAt).toLocaleDateString()}`)
       .text(`Rental Period: ${new Date(data.pickupDate).toLocaleDateString()} to ${new Date(data.returnDate).toLocaleDateString()}`);
    doc.moveDown();

    // Vendor & Customer Details
    doc.fontSize(12).fillColor('#1E293B').text('Vendor Information:', { underline: true });
    doc.fontSize(10).fillColor('#334155')
       .text(`Company: ${data.companyName}`)
       .text(`GST No: ${data.gstNo}`);
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#1E293B').text('Billed To:', { underline: true });
    doc.fontSize(10).fillColor('#334155')
       .text(`Customer Name: ${data.customerName}`)
       .text(`Email: ${data.customerEmail}`);
    doc.moveDown();

    // Line Items Table Header
    doc.fontSize(11).fillColor('#0F172A').text('Items & Rental Charges', { underline: true });
    doc.moveDown(0.5);

    data.items.forEach((item, index) => {
      doc.fontSize(10).fillColor('#1E293B')
         .text(`${index + 1}. ${item.name} | Qty: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.lineTotal.toFixed(2)}`);
    });

    doc.moveDown();
    doc.fontSize(14).fillColor('#059669').text(`Total Amount: $${data.totalAmount.toFixed(2)}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#94A3B8').text('Thank you for renting with TwinSix Rentals Marketplace!', { align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve(`/uploads/invoices/${filename}`);
    });

    writeStream.on('error', (err) => {
      reject(err);
    });
  });
}
