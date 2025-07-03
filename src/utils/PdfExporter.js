// src/utils/PdfExporter.js

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import logo from '../assets/logo.png';

export async function exportPDF(transactions) {
    const doc = new jsPDF();
    debugger
    const pageWidth = doc.internal.pageSize.getWidth();


    const toBase64 = async (fileUrl) => {
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // base64 string
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const base64Logo = await toBase64(logo); // logo comes from import!

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    };

    const addHeader = () => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Logo;

            img.onload = () => {
                doc.addImage(img, 'SVG', 14, 10, 30, 20); // Adjust size and position
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
    };

    const generatePDF = () => {
        const tableColumn = ["Date", "Type", "Description", "Amount"];
        let totalIn = 0;
        let totalOut = 0;

        const tableRows = transactions.map(txn => {
            const amount = txn.amount;
            const type = txn.type === 'in' ? 'Cash In' : 'Cash Out';
            if (txn.type === 'in') totalIn += amount;
            else totalOut += amount;

            return [
                formatDate(txn.date),
                type,
                txn.desc || '',
                `INR ${amount}`
            ];
        });

        autoTable(doc, {
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                lineWidth: 0.2,
                lineColor: [0, 0, 0],
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [18, 170, 241],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            }
        });

        const netBalance = totalIn - totalOut;
        const formatAmount = (num) =>
            Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2 });

        const summaryRows = [
            ['Total Cash In', `INR ${formatAmount(totalIn)}`],
            ['Total Cash Out', `INR ${formatAmount(totalOut)}`],
            [
                { content: 'Net Balance', styles: { fontStyle: 'bold' } },
                {
                    content: `INR ${formatAmount(netBalance)}`,
                    styles: { textColor: netBalance >= 0 ? 'green' : 'red', fontStyle: 'bold' }
                }
            ]
        ];

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Summary', 'Amount']],
            body: summaryRows,
            theme: 'grid',
            styles: {
                fontStyle: 'bold',
                fontSize: 10,
                halign: 'center',
                lineWidth: 0.2,
                lineColor: [0, 0, 0]
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0
            }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Generated on ${formatDate(new Date())}`, 14, doc.internal.pageSize.getHeight() - 10);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save("Cashbook_Report.pdf");
    };

    addHeader().then(() => {
        generatePDF();
    });
}
