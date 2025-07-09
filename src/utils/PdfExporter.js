// src/utils/PdfExporter.js

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import logo from '../assets/logo.png';

export async function exportPDF(transactions, options = { download: true }) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const toBase64 = async (fileUrl) => {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const base64Logo = await toBase64(logo);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    };

    await new Promise((resolve) => {
        const img = new Image();
        img.src = base64Logo;
        img.onload = () => {
            doc.addImage(img, 'PNG', 14, 10, 30, 20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text("MoneyTrackr", 50, 18);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text("Personal Cash Flow Report", 50, 25);
            doc.setLineWidth(0.5);
            doc.line(14, 30, pageWidth - 14, 30);
            resolve();
        };
    });

    // Build table...
    const tableColumn = ['S. No.', 'Date', 'Type', 'Description', 'Amount'];

    let totalIn = 0, totalOut = 0;
    
    const tableRows = transactions.map((txn,index) => {
        const amount = txn.amount;
        txn.type === 'in' ? totalIn += amount : totalOut += amount;
        return [
             `${index + 1}`, 
            formatDate(txn.date),
            txn.type === 'in' ? 'Cash In' : 'Cash Out',
            txn.desc || '',
            `INR ${amount}`
        ];
    });

    autoTable(doc, {
        startY: 35,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 10, halign: 'center' },
        headStyles: { fillColor: [18, 170, 241], textColor: [255, 255, 255] }
    });

    const netBalance = totalIn - totalOut;
    const summaryRows = [
        ['Total Cash In', `INR ${totalIn.toFixed(2)}`],
        ['Total Cash Out', `INR ${totalOut.toFixed(2)}`],
        [
            { content: 'Net Balance', styles: { fontStyle: 'bold' } },
            {
                content: `INR ${netBalance.toFixed(2)}`,
                styles: { textColor: netBalance >= 0 ? 'green' : 'red', fontStyle: 'bold' }
            }
        ]
    ];

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Summary', 'Amount']],
        body: summaryRows,
        theme: 'grid',
        styles: { fontSize: 10, fontStyle: 'bold', halign: 'center' },
        headStyles: { fillColor: [200, 200, 200], textColor: 0 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Generated on ${formatDate(new Date())}`, 14, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
    }

    // ✅ Save locally if needed
    if (options.download) {
        doc.save("Cashbook_Report.pdf");
    }

    // ✅ Return Base64 version for email
    // return doc.output('datauristring').split(',')[1]; // base64 only
    return doc;
}

