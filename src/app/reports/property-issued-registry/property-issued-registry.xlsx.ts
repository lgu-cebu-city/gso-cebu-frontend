import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  fundCluster: string;
  propertyType: string;
  sheetNo: string;
  details: detailData[];
}

class detailData {
  date: string;
  icsNo: string;
  propertyNo: string;
  itemDescription: string;
  estimatedUsefulLife: string;
  issuedQty: string;
  issuedOffice: string;
  returnedQty: string;
  returnedOffice: string;
  reissuedQty: string;
  reissuedOffice: string;
  disposedQty: string;
  balanceQty: string;
  amount: string;
  remarks: string;
}

export class PropertyIssuedRegistryXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("PropertyIssuedRegistry");
    worksheet.mergeCells('A1:O1');
    worksheet.getCell('A1').value = 'Annex A.4'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.addRow([''])

    worksheet.mergeCells('A3:O3');
    worksheet.getCell('A3').value = 'REGISTRY OF SEMI-EXPENDABLE PROPERTY ISSUED'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }
    worksheet.addRow([''])

    const line2 = ['Entity Name:', '', '', '', '', '', '', '', '', '', '', 'Fund Cluster:']
    const line3 = ['Semi Expendable Property:', '', '', '', '', '', '', '', '', '', '', 'Semi Expendable Property No:']
    let line2Row = worksheet.addRow(line2);
    let line3Row = worksheet.addRow(line3);
    line2Row.font = { bold: true }
    line3Row.font = { bold: true }
    worksheet.addRow([''])

    worksheet.mergeCells('A8:A9');
    worksheet.mergeCells('D8:D9');
    worksheet.mergeCells('E8:E9');
    worksheet.mergeCells('N8:N9');
    worksheet.mergeCells('O8:O9');
    worksheet.mergeCells('B8:C8');
    worksheet.mergeCells('F8:G8');
    worksheet.mergeCells('H8:I8');
    worksheet.mergeCells('J8:K8');

    let cellA8 = worksheet.getCell('A8')
    let cellB8 = worksheet.getCell('B8')
    let cellD8 = worksheet.getCell('D8')
    let cellE8 = worksheet.getCell('E8')
    let cellF8 = worksheet.getCell('F8')
    let cellH8 = worksheet.getCell('H8')
    let cellJ8 = worksheet.getCell('J8')
    let cellL8 = worksheet.getCell('L8')
    let cellM8 = worksheet.getCell('M8')
    let cellN8 = worksheet.getCell('N8')
    let cellO8 = worksheet.getCell('O8')

    let cellB9 = worksheet.getCell('B9')
    let cellC9 = worksheet.getCell('C9')
    let cellF9 = worksheet.getCell('F9')
    let cellG9 = worksheet.getCell('G9')
    let cellH9 = worksheet.getCell('H9')
    let cellI9 = worksheet.getCell('E9')
    let cellJ9 = worksheet.getCell('E9')
    let cellK9 = worksheet.getCell('K9')
    let cellL9 = worksheet.getCell('E9')
    let cellM9 = worksheet.getCell('M9')

    cellA8.value = 'Date'
    cellA8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellA8.font = { bold: true }

    cellB8.value = 'Reference'
    cellB8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellB8.font = { bold: true }

    cellD8.value = 'Item Description'
    cellD8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellD8.font = { bold: true }

    cellE8.value = 'Estimated Useful Life'
    cellE8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellE8.font = { bold: true }

    cellF8.value = 'Issued'
    cellF8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellF8.font = { bold: true }

    cellH8.value = 'Returned'
    cellH8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellH8.font = { bold: true }

    cellJ8.value = 'Re-issued'
    cellJ8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellJ8.font = { bold: true }

    cellL8.value = 'Disposed'
    cellL8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellL8.font = { bold: true }

    cellM8.value = 'Balance'
    cellM8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellM8.font = { bold: true }

    cellN8.value = 'Amount'
    cellN8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellN8.font = { bold: true }

    cellO8.value = 'Remarks'
    cellO8.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellO8.font = { bold: true }

    
    cellB9.value = 'ICS/RRSP No.'
    cellB9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellB9.font = { bold: true }
    
    cellC9.value = 'Semi-expendable Property No'
    cellC9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellC9.font = { bold: true }
    
    cellF9.value = 'Qty'
    cellF9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellF9.font = { bold: true }
    
    cellG9.value = 'Office/Officer'
    cellG9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellG9.font = { bold: true }
    
    cellH9.value = 'Qty'
    cellH9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellH9.font = { bold: true }
    
    cellI9.value = 'Office/Officer'
    cellI9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellI9.font = { bold: true }
    
    cellJ9.value = 'Qty'
    cellJ9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellJ9.font = { bold: true }
    
    cellK9.value = 'Office/Officer'
    cellK9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellK9.font = { bold: true }
    
    cellL9.value = 'Qty'
    cellL9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellL9.font = { bold: true }
    
    cellM9.value = 'Qty'
    cellM9.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cellM9.font = { bold: true }

    // Data Rows Start
    // for (let rows of data.details) {
    //   let cols = Object.keys(rows);
    //   let temp = []
    //   for (let col of cols) {
    //     temp.push(col);
    //   }
    //   worksheet.addRow(temp)
    // }
    // Data Rows End
    
    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
    for (let row = 1; row < 30; row++) {
      cols.forEach(col => {
        const cellrow = worksheet.getCell(`${col + row}` + '')
        cellrow.border = {
          top: { style: 'thin', color: { argb: '00000000' } },
          left: { style: 'thin', color: { argb: '00000000' } },
          bottom: { style: 'thin', color: { argb: '00000000' } },
          right: { style: 'thin', color: { argb: '00000000' } }
        }
      });
    }
    // Border End

    // Save File Start
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Property-Issued-Registry-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}