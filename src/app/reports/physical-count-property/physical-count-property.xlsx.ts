import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  fundCluster: string;
  accountableOfficer: string;
  designation: string;
  entityName: string;
  date: string;
  certifiedBy: string;
  approvedBy: string;
  witnessedBy: string;
  details: detailData[];
}

class detailData {
  articles: string;
  description: string;
  propertyNo: string;
  uom: string;
  unitValue: string;
  balance: string;
  onHandCount: string;
  shortage: string;
  remarks: string;
}

export class PhysicalCountPropertyXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("PhysicalCountProperty");
    worksheet.mergeCells('A1:J1');
    worksheet.getCell('A1').value = 'Annex A.8'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.mergeCells('A2:J2');

    worksheet.mergeCells('A3:J3');
    worksheet.getCell('A3').value = 'REPORT ON THE PHYSICAL COUNT OF SEMI-EXPENDABLE PROPERTY'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }
    worksheet.mergeCells('A4:J4');

    worksheet.mergeCells('A5:J5');
    worksheet.getCell('A5').value = '(Type of Semi-expendable Property)'
    worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('A6:J6');
    worksheet.getCell('A6').value = 'As at ____________________________'
    worksheet.getCell('A6').font = { bold: true }
    
    worksheet.mergeCells('A7:J7');

    worksheet.mergeCells('A8:J8');
    worksheet.getCell('A8').value = 'Fund Cluster:'
    worksheet.getCell('A8').font = { bold: true }

    worksheet.mergeCells('A9:J9');
    worksheet.getCell('A9').value = 'For which _________________________, ___________________, ______________________, is accountable, having assumed such accountability on ______________________.'
    worksheet.getCell('A9').font = { bold: true }
    
    worksheet.addRow([''])

    worksheet.mergeCells('A11:A12');
    worksheet.getCell('A11').value = 'Article'
    worksheet.getCell('A11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('A11').font = { bold: true }

    worksheet.mergeCells('B11:B12');
    worksheet.getCell('B11').value = 'Description'
    worksheet.getCell('B11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('B11').font = { bold: true }

    worksheet.mergeCells('C11:C12');
    worksheet.getCell('C11').value = 'Semi-expendable Property No.'
    worksheet.getCell('C11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('C11').font = { bold: true }

    worksheet.mergeCells('D11:D12');
    worksheet.getCell('D11').value = 'Unit of Measure'
    worksheet.getCell('D11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('D11').font = { bold: true }

    worksheet.mergeCells('E11:E12');
    worksheet.getCell('E11').value = 'Unit Value'
    worksheet.getCell('E11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('E11').font = { bold: true }

    worksheet.getCell('F11').value = 'Balance Per Card'
    worksheet.getCell('F11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('F11').font = { bold: true }

    worksheet.getCell('F12').value = '(Quantity)'
    worksheet.getCell('F12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.getCell('G11').value = 'On Hand Per Count'
    worksheet.getCell('G11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('G11').font = { bold: true }

    worksheet.getCell('G12').value = '(Quantity)'
    worksheet.getCell('G12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('H11:I11');
    worksheet.getCell('H11').value = 'Shortage/Overage'
    worksheet.getCell('H11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('H11').font = { bold: true }

    worksheet.getCell('H12').value = 'Quantity'
    worksheet.getCell('H12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.getCell('I12').value = 'Value'
    worksheet.getCell('I12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('J11:J12');
    worksheet.getCell('J11').value = 'Remarks'
    worksheet.getCell('J11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('J11').font = { bold: true }

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

    worksheet.mergeCells('A28:C30');
    worksheet.getCell('A28').value = 'Certified Correct by:'
    worksheet.getCell('A28').alignment = { vertical: 'top', horizontal: 'left' }

    worksheet.mergeCells('D28:H30');
    worksheet.getCell('D28').value = 'Approved by:'
    worksheet.getCell('D28').alignment = { vertical: 'top', horizontal: 'left' }

    worksheet.mergeCells('I28:J30');
    worksheet.getCell('I28').value = 'Witnessed by:'
    worksheet.getCell('I28').alignment = { vertical: 'top', horizontal: 'left' }

    worksheet.mergeCells('A31:C32');
    worksheet.getCell('A31').value = 'Signature over Printed Name of Inventory Committee Chair and Members'
    worksheet.getCell('A31').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('D31:H32');
    worksheet.getCell('D31').value = 'Signature over Printed Name of Head of Agency/Entity or Authorized Representative'
    worksheet.getCell('D31').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('I31:J32');
    worksheet.getCell('I31').value = 'SIgnature over Printed Name of COA Representative'
    worksheet.getCell('I31').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    
    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    for (let row = 1; row < 33; row++) {
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
      FileSaver.saveAs(blob, 'Physical-Count-Property-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}