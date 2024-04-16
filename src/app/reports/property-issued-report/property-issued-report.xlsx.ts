import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  fundCluster: string;
  serialNo: string;
  date: string;
  propertyCustodian: string;
  accountingStaff: string;
  details: detailData[];
}

class detailData {
  icsNo: string;
  responsibilityCenterCode: string;
  propertyNo: string;
  itemDescription: string;
  unit: string;
  quantityIssued: string;
  unitCost: string;
  amount: string;
}

export class PropertyIssuedReportXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("PropertyIssuedReport");
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = 'Annex A.7'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.addRow([''])

    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').value = 'REPORT OF SEMI-EXPENDABLE PROPERTY ISSUED'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }
    worksheet.addRow([''])

    worksheet.mergeCells('A5:E5');
    worksheet.getCell('A5').value = 'Entity Name:'
    worksheet.getCell('A5').font = { bold: true }

    worksheet.mergeCells('F5:H5');
    worksheet.getCell('F5').value = 'Serial No.:'
    worksheet.getCell('F5').font = { bold: true }

    worksheet.mergeCells('A6:E6');
    worksheet.getCell('A6').value = 'Fund Cluster:'
    worksheet.getCell('A6').font = { bold: true }

    worksheet.mergeCells('F6:H6');
    worksheet.getCell('F6').value = 'Date:'
    worksheet.getCell('F6').font = { bold: true }

    worksheet.addRow([''])

    worksheet.mergeCells('A8:F8');
    worksheet.getCell('A8').value = 'This is to acknowledge receipt of the returned Semi-expendable Property'
    worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A8').font = { italic: true }

    worksheet.mergeCells('G8:H8');
    worksheet.getCell('G8').value = 'This is to acknowledge receipt of the returned Semi-expendable Property'
    worksheet.getCell('G8').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('G8').font = { italic: true }

    worksheet.getCell('A9').value = 'ICS No.'
    worksheet.getCell('A9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('A9').font = { bold: true }

    worksheet.getCell('B9').value = 'Responsibity Center Code'
    worksheet.getCell('B9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('B9').font = { bold: true }

    worksheet.getCell('C9').value = 'Semi-expendable Property No.'
    worksheet.getCell('C9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('C9').font = { bold: true }

    worksheet.getCell('D9').value = 'Item Description'
    worksheet.getCell('D9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('D9').font = { bold: true }

    worksheet.getCell('E9').value = 'Unit'
    worksheet.getCell('E9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('E9').font = { bold: true }

    worksheet.getCell('F9').value = 'Quantity Issued'
    worksheet.getCell('F9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('F9').font = { bold: true }

    worksheet.getCell('G9').value = 'Unit Cost'
    worksheet.getCell('G9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('G9').font = { bold: true }

    worksheet.getCell('H9').value = 'Amount'
    worksheet.getCell('H9').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('H9').font = { bold: true }
    
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
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])
    worksheet.addRow([''])

    worksheet.mergeCells('A31:E33');
    worksheet.getCell('A31').value = 'I hereby certify to the correctness of the above information.'
    worksheet.getCell('A31').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('F31:H33');
    worksheet.getCell('F31').value = 'Posted by:'
    worksheet.getCell('F31').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('A34:E34');
    worksheet.getCell('A34').value = 'Signature over Printed Name of Property and/or Supply Custodian'
    worksheet.getCell('A34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('F34:H34');
    worksheet.getCell('F34').value = 'Signature over Printed Name of Designated Accounting Staff'
    worksheet.getCell('F34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    for (let row = 1; row < 35; row++) {
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
      FileSaver.saveAs(blob, 'Property-Issued-Report-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}