import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  fundCluster: string;
  department: string;
  accountableOfficer: string;
  designation: string;
  RLSDDSPNo: string;
  RLSDDSPDate: string;
  icsNo: string;
  icsDate: string;
  status: string;
  circumstances: string;
  details: detailData[];
}

class detailData {
  propertyNo: string;
  description: string;
  acquisitionCost: string;
}

export class LSDDPropertyReportXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("PropertyIssuedRegistry");
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'Annex A.9'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.mergeCells('A2:F2');

    worksheet.mergeCells('A3:F3');
    worksheet.getCell('A3').value = 'REPORT OF LOST, STOLEN, DAMAGED OR DESTROYED SEMI-EXPENDABLE PROPERTY'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('A3').font = { bold: true }
    
    worksheet.mergeCells('A4:F4');

    worksheet.mergeCells('A5:D5');
    worksheet.getCell('A5').value = 'Entity Name:'
    worksheet.getCell('A5').font = { bold: true }

    worksheet.mergeCells('E5:F5');
    worksheet.getCell('E5').value = 'Fund Cluster:'
    worksheet.getCell('E5').font = { bold: true }

    worksheet.mergeCells('A6:F6');

    worksheet.mergeCells('A7:D7');
    worksheet.getCell('A7').value = 'Department/Office:'
    worksheet.getCell('A7').font = { bold: true }

    worksheet.mergeCells('E7:F7');
    worksheet.getCell('A7').value = 'RLSDDSP No.:'
    worksheet.getCell('A7').font = { bold: true }

    worksheet.mergeCells('A8:D8');
    worksheet.getCell('A8').value = 'Accountable Officer:'
    worksheet.getCell('A8').font = { bold: true }

    worksheet.mergeCells('E8:F8');
    worksheet.getCell('A8').value = 'RLSDDSP Date:'
    worksheet.getCell('A8').font = { bold: true }

    worksheet.mergeCells('A9:D9');
    worksheet.getCell('A9').value = 'Designation:'
    worksheet.getCell('A9').font = { bold: true }

    worksheet.mergeCells('E9:F9');
    worksheet.getCell('A9').value = 'ICS:'
    worksheet.getCell('A9').font = { bold: true }

    worksheet.getCell('A10').value = 'Police Notified'

    worksheet.getCell('B10').value = '☐ Yes'

    worksheet.mergeCells('C10:D10');
    worksheet.getCell('C10').value = 'Police Station:'
    
    worksheet.mergeCells('E10:F10');
    worksheet.getCell('E10').value = 'ICS Date:'
    worksheet.getCell('E10').font = { bold: true }

    worksheet.getCell('B11').value = '☐ No'

    worksheet.mergeCells('C11:D11');
    worksheet.getCell('C11').value = 'Date:'
    
    worksheet.mergeCells('E11:F11');

    worksheet.mergeCells('A12:F12');
    worksheet.getCell('A12').value = 'Status of Semi-expendable Property: (check applicable box)'

    worksheet.mergeCells('B13:C13');
    worksheet.getCell('B13').value = '☐ Lost'

    worksheet.mergeCells('D13:E13');
    worksheet.getCell('D13').value = '☐ Damaged'

    worksheet.mergeCells('B14:C14');
    worksheet.getCell('B14').value = '☐ Stolen'

    worksheet.mergeCells('D14:E14');
    worksheet.getCell('D14').value = '☐ Destroyed'

    worksheet.mergeCells('A15:F15');

    worksheet.mergeCells('A16:B16');
    worksheet.getCell('A16').value = 'Property No.'
    worksheet.getCell('A16').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('A16').font = { bold: true }

    worksheet.mergeCells('C16:D16');
    worksheet.getCell('C16').value = 'Description'
    worksheet.getCell('C16').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('C16').font = { bold: true }

    worksheet.mergeCells('E16:F16');
    worksheet.getCell('E16').value = 'Acquisition Cost'
    worksheet.getCell('E16').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('E16').font = { bold: true }

    worksheet.mergeCells('A17:B17');
    worksheet.mergeCells('C17:D17');
    worksheet.mergeCells('E17:F17');

    worksheet.mergeCells('A18:B18');
    worksheet.mergeCells('C18:D18');
    worksheet.mergeCells('E18:F18');

    worksheet.mergeCells('A19:B19');
    worksheet.mergeCells('C19:D19');
    worksheet.mergeCells('E19:F19');

    worksheet.mergeCells('A20:B20');
    worksheet.mergeCells('C20:D20');
    worksheet.mergeCells('E20:F20');

    worksheet.mergeCells('A21:B21');
    worksheet.mergeCells('C21:D21');
    worksheet.mergeCells('E21:F21');

    worksheet.mergeCells('A22:B22');
    worksheet.mergeCells('C22:D22');
    worksheet.mergeCells('E22:F22');

    worksheet.mergeCells('A23:B23');
    worksheet.mergeCells('C23:D23');
    worksheet.mergeCells('E23:F23');

    worksheet.mergeCells('A24:F24');
    worksheet.getCell('A24').value = 'Circumstances:'
    worksheet.getCell('A24').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('A25:F25');
    worksheet.mergeCells('A26:F26');
    worksheet.mergeCells('A27:F27');
    worksheet.mergeCells('A28:F28');

    worksheet.mergeCells('A29:D29');
    worksheet.getCell('A29').value = 'I hereby certify that the item/s and curcumstances stated above are true and correct.'
    worksheet.getCell('A29').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('E29:F29');
    worksheet.getCell('E29').value = 'Noted by:'
    worksheet.getCell('E29').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('A30:D30');
    worksheet.mergeCells('E30:F30');

    worksheet.mergeCells('A31:D32');
    worksheet.getCell('A31').value = 'Signature over Printed Name of the Accountable Officer'
    worksheet.getCell('A31').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('E31:F32');
    worksheet.getCell('E31').value = 'Signature over Printed Name of the Immediate Supervisor'
    worksheet.getCell('E31').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('A33:D33');
    worksheet.mergeCells('E33:F33');

    worksheet.mergeCells('A34:D34');
    worksheet.getCell('A34').value = 'Date'
    worksheet.getCell('A34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('E34:F34');
    worksheet.getCell('E34').value = 'Date'
    worksheet.getCell('E34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('A35:F35');

    worksheet.mergeCells('A36:D36');
    worksheet.getCell('A36').value = 'Government Issued ID:'
    
    worksheet.mergeCells('E36:F36');

    worksheet.mergeCells('A37:D37');
    worksheet.getCell('A37').value = 'ID No.:'
    
    worksheet.mergeCells('E37:F37');

    worksheet.mergeCells('A38:D38');
    worksheet.getCell('A38').value = 'Date Issued:'
    
    worksheet.mergeCells('E38:F38');

    worksheet.mergeCells('A39:F39');

    worksheet.mergeCells('A40:F41');
    worksheet.getCell('A40').value = 'SUBSCRIBED AND SWORN to before me this ______ day of _______________, affiant exhibiting the above government issued identification card.'
    worksheet.getCell('A40').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('A42:F42');

    worksheet.mergeCells('A43:C43');
    worksheet.getCell('A43').value = 'Doc. No.'
    worksheet.getCell('A43').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('D43:F43');

    worksheet.mergeCells('A44:C44');
    worksheet.getCell('A44').value = 'Page No.'
    worksheet.getCell('A44').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('D44:F44');
    worksheet.getCell('D44').value = 'Notary Public'
    worksheet.getCell('D44').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('A45:C45');
    worksheet.getCell('A45').value = 'Book No.'
    worksheet.getCell('A45').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('D45:F45');

    worksheet.mergeCells('A46:C46');
    worksheet.getCell('A46').value = 'Series of'
    worksheet.getCell('A46').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('D46:F46');



    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F']
    for (let row = 1; row < 47; row++) {
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
      FileSaver.saveAs(blob, 'LSDD-Property-Report-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}