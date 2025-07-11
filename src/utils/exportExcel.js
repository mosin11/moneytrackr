import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export function exportToExcel(data, fromDate, toDate) {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    // Title
    wsData.push(['Cash Book App']);
    wsData.push([]); // empty row
    wsData.push(['Date', 'Description', 'Cash In', 'Cash Out']);

    let totalIn = 0;
    let totalOut = 0;

    data.forEach((t) => {
    
        const cashIn = t.cashIn;
        const cashOut = t.cashOut;
        totalIn += cashIn;
        totalOut += cashOut;

        wsData.push([
            formatDate(parseCustomDate(t.date)),
            t.description,
            cashIn,
            cashOut,
        ]);
    });

    // Totals and balance
    wsData.push(['', 'Total Cash In', totalIn || '', '']);
    wsData.push(['', 'Total Cash Out', totalOut || '', '']);
    wsData.push([
        '',
        'Balance',
        totalIn - totalOut,
        ''
    ]);


    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Totals styling (yellow)
    const totalInRow = wsData.length - 3;
    const totalOutRow = wsData.length - 2;
    const balanceRow = wsData.length - 1;

    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },// Merge title
        { s: { r: balanceRow, c: 2 }, e: { r: balanceRow, c: 3 } },
        { s: { r: totalOutRow, c: 2 }, e: { r: totalOutRow, c: 3 } },
        { s: { r: totalInRow, c: 2 }, e: { r: totalInRow, c: 3 } }
    ];

    ws['!cols'] = [
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 }
    ];

    // Style rows
    Object.keys(ws).forEach((cell) => {
        if (!cell.startsWith('!')) {
            ws[cell].s = {
                font: { name: 'Calibri', sz: 12 },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: borderStyle()
            };
        }
    });

    // Title style
    ws['A1'].s = {
        font: { bold: true, sz: 14, name: 'Calibri' },
        alignment: { horizontal: 'center' },
        fill: { fgColor: { rgb: '12AAF1' } }
    };

    // Header row (row 3 = A3:D3)
    ['A3', 'B3', 'C3', 'D3'].forEach((cell) => {
        if (ws[cell]) {
            ws[cell].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: '12AAF1' } },
                alignment: { horizontal: 'center' },
                border: borderStyle()
            };
        }
    });



    [`B${totalInRow + 1}`, `C${totalInRow + 1}`, `D${totalInRow + 1}`,
    `B${totalOutRow + 1}`, `C${totalOutRow + 1}`, `D${totalOutRow + 1}`].forEach((cell) => {
        if (ws[cell]) {
            ws[cell].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: 'FFFFCC' } }, // Yellow
                alignment: { horizontal: 'center' },
                border: borderStyle()
            };
        }
    });

    // Balance styling (green or red)
    const isNegative = totalIn - totalOut < 0;
    [`B${balanceRow + 1}`, `C${balanceRow + 1}`, `D${balanceRow + 1}`].forEach((cell) => {
        if (ws[cell]) {
            ws[cell].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: isNegative ? 'FFCCCC' : 'CCFFCC' } }, // Red or Green
                alignment: { horizontal: 'center' },
                border: borderStyle()
            };
        }
    });

    // Export
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const filename =
        fromDate && toDate
            ? `Cashbook_${fromDate}_to_${toDate}.xlsx`
            : `Cashbook_${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xff;

    saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}

// Helpers
function borderStyle() {
    return {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
    };
}

function formatDate(d) {
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const yyyy = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 => 12

  const hh = String(hours).padStart(2, '0');

  return `${dd}-${month}-${yyyy} ${hh}:${minutes} ${ampm}`;
}


function parseCustomDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr.includes("T")) return new Date(dateStr); // ISO case

  const [datePart, timePart] = dateStr.split(" ");
  const [dd, mm, yyyy] = datePart.split("-").map(Number);
  const [HH, MM] = timePart ? timePart.split(":").map(Number) : [0, 0];
  return new Date(yyyy, mm - 1, dd, HH, MM);
}

