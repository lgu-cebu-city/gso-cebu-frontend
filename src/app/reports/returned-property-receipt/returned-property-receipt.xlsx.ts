import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  date: string;
  RRSPNo: string;
  returnedBy: string;
  receivedBy: string;
  details: detailData[];
}

class detailData {
  itemDescription: string;
  quantity: string;
  icsNo: string;
  user: string;
  remarks: string;
}

export class ReturnedPropertyReceiptXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("ReturnedPropertyReceipt");
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Annex A.6'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.addRow([''])

    worksheet.mergeCells('A3:E3');
    worksheet.getCell('A3').value = 'RECEIPT OF RETURNED SEMI-EXPANDABLE PROPERTY'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }
    worksheet.addRow([''])

    worksheet.mergeCells('A5:D6');
    worksheet.getCell('A5').value = 'Entity Name:'
    worksheet.getCell('A5').font = { bold: true }

    worksheet.getCell('E5').value = 'Date:'
    worksheet.getCell('E5').font = { bold: true }

    worksheet.getCell('E6').value = 'RRSP No.:'
    worksheet.getCell('E6').font = { bold: true }

    worksheet.mergeCells('A7:E7');
    worksheet.getCell('A7').value = 'This is to acknowledge receipt of the returned Semi-expendable Property'
    worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A7').font = { bold: true }

    worksheet.getCell('A8').value = 'Item Description'
    worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A8').font = { bold: true }

    worksheet.getCell('B8').value = 'Quantity'
    worksheet.getCell('B8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('B8').font = { bold: true }

    worksheet.getCell('C8').value = 'ICS No.'
    worksheet.getCell('C8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('C8').font = { bold: true }

    worksheet.getCell('D8').value = 'End-user'
    worksheet.getCell('D8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('D8').font = { bold: true }

    worksheet.getCell('E8').value = 'Remarks'
    worksheet.getCell('E8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('E8').font = { bold: true }
    
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

    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])

    worksheet.mergeCells('A18:E18');

    worksheet.mergeCells('A19:C19');
    worksheet.getCell('A19').value = 'Returned by:'

    worksheet.mergeCells('D19:E19');
    worksheet.getCell('D19').value = 'Received by:'
    
    worksheet.mergeCells('A20:C21');
    worksheet.mergeCells('D20:E21');

    worksheet.mergeCells('A22:C22');
    worksheet.getCell('A22').value = 'End User'
    worksheet.getCell('A22').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('D22:E22');
    worksheet.getCell('D22').value = 'Head, Property and/or Supply Division/Unit'
    worksheet.getCell('D22').alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells('A23:C24');
    worksheet.mergeCells('D23:E24');

    worksheet.mergeCells('A25:C25');
    worksheet.getCell('A25').value = 'Date'
    worksheet.getCell('A25').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('D25:E25');
    worksheet.getCell('D25').value = 'Date'
    worksheet.getCell('D25').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('B26:E26');
    
    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E']
    for (let row = 1; row < 27; row++) {
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
      FileSaver.saveAs(blob, 'Returned-Property-Receipt-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}