import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  fundCluster: string;
  accountableFrom: string;
  accountableTo: string;
  itrNo: string;
  date: string;
  transferType: string;
  transferReason: string;
  approvedBy: string;
  releasedBy: string;
  receivedBy: string;
  details: detailData[];
}

class detailData {
  acquiredDate: string;
  itemNo: string;
  icsNo: string;
  description: string;
  amount: string;
  inventoryCondition: string;
}

export class InventoryTransferXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("InventoryTransfer");
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'Annex A.5'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.addRow([''])

    worksheet.mergeCells('A3:F3');
    worksheet.getCell('A3').value = 'INVENTORY TRANSFER REPORT'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }
    worksheet.addRow([''])

    worksheet.mergeCells('A5:D5');
    worksheet.getCell('A5').value = 'Entity Name:'
    worksheet.getCell('A5').font = { bold: true }

    worksheet.mergeCells('E5:F5');
    worksheet.getCell('E5').value = 'Fund Cluster'
    worksheet.getCell('E5').font = { bold: true }
    
    worksheet.addRow([''])

    worksheet.mergeCells('A7:D7');
    worksheet.getCell('A7').value = 'From Accountable Officer/Agency/Fund Cluster:'
    worksheet.getCell('A7').font = { bold: true }

    worksheet.mergeCells('E7:F7');
    worksheet.getCell('E7').value = 'ITR No.:'
    worksheet.getCell('E7').font = { bold: true }

    worksheet.mergeCells('A8:D8');
    worksheet.getCell('A8').value = 'To Accountable Officer/Agency/Fund Cluster:'
    worksheet.getCell('A8').font = { bold: true }

    worksheet.mergeCells('E8:F8');
    worksheet.getCell('E8').value = 'Date:'
    worksheet.getCell('E8').font = { bold: true }
    
    worksheet.addRow([''])

    worksheet.mergeCells('A10:F10');
    worksheet.getCell('A10').value = 'Transfer Type: (check only one)'
    worksheet.getCell('A10').font = { bold: true }
    
    worksheet.addRow([''])

    worksheet.mergeCells('B12:C12');
    worksheet.getCell('B12').value = '☐ Donation'

    worksheet.mergeCells('D12:E12');
    worksheet.getCell('D12').value = '☐ Relocate'

    worksheet.mergeCells('B13:C13');
    worksheet.getCell('B13').value = '☐ Reassignment'

    worksheet.mergeCells('D13:E13');
    worksheet.getCell('D13').value = '☐ Others (Specify)'
    
    worksheet.addRow([''])

    worksheet.getCell('A15').value = 'Date Acquired'
    worksheet.getCell('A15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A15').font = { bold: true }

    worksheet.getCell('B15').value = 'ItemNo.'
    worksheet.getCell('B15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('B15').font = { bold: true }

    worksheet.getCell('C15').value = 'ICS No./Date'
    worksheet.getCell('C15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('C15').font = { bold: true }

    worksheet.getCell('D15').value = 'Description'
    worksheet.getCell('D15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('D15').font = { bold: true }

    worksheet.getCell('E15').value = 'Amount'
    worksheet.getCell('E15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('E15').font = { bold: true }

    worksheet.getCell('F15').value = 'Condition of Inventory'
    worksheet.getCell('F15').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('F15').font = { bold: true }
    
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

    worksheet.mergeCells('A31:F31');
    worksheet.getCell('A31').value = 'Reason for Transfer:'
    worksheet.getCell('A31').font = { bold: true }
    
    worksheet.mergeCells('B32:F32');
    worksheet.mergeCells('B33:F33');
    worksheet.mergeCells('B34:F34');
    worksheet.mergeCells('B35:F35');
    worksheet.mergeCells('B36:F36');

    worksheet.addRow([''])

    worksheet.mergeCells('B38:C38');
    worksheet.getCell('B38').value = 'Approved by:'
    worksheet.getCell('B38').font = { bold: true }

    worksheet.getCell('D38').value = 'Relesed/Issued by:'
    worksheet.getCell('D38').font = { bold: true }

    worksheet.mergeCells('E38:F38');
    worksheet.getCell('E38').value = 'Received by:'
    worksheet.getCell('E38').font = { bold: true }

    worksheet.getCell('A39').value = 'Signature:'
    worksheet.getCell('A39').font = { bold: true }
    worksheet.mergeCells('B39:C39');
    worksheet.mergeCells('E39:F39');

    worksheet.getCell('A40').value = 'Printed Name:'
    worksheet.getCell('A40').font = { bold: true }
    worksheet.mergeCells('B40:C40');
    worksheet.mergeCells('E40:F40');

    worksheet.getCell('A41').value = 'Designation:'
    worksheet.getCell('A41').font = { bold: true }
    worksheet.mergeCells('B41:C41');
    worksheet.mergeCells('E41:F41');

    worksheet.getCell('A42').value = 'Date:'
    worksheet.getCell('A42').font = { bold: true }
    worksheet.mergeCells('B42:C42');
    worksheet.mergeCells('E42:F42');
    
    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F']
    for (let row = 1; row < 43; row++) {
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
      FileSaver.saveAs(blob, 'Inventory-Transfer-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}