import { Workbook } from "exceljs";
var FileSaver = require('file-saver');

class headerData {
  entityName: string;
  fundCluster: string;
  accountableOfficer: string;
  designation: string;
  station: string;
  requestedBy: string;
  approvedBy: string;
  inspectionOfficer: string;
  witness: string;
  details: detailData[];
}

class detailData {
  dateAcquired: string;
  particulars: string;
  propertyNo: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
  accumulatedImpairmentLosses: string;
  carryingAmount: string;
  remarks: string;
  saleDisposal: string;
  transferDisposal: string;
  destructionDisposal: string;
  othersDisposal: string;
  totalDisposal: string;
  appraisedValue: string;
  orNo: string;
  orAmount: string;
}

export class UnserviceablePropertyReportXLSX {
  constructor() {}

  public generateXLSXFormat(data: headerData) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("UnserviceablePropertyReport");
    worksheet.mergeCells('A1:Q1');
    worksheet.getCell('A1').value = 'Annex A.10'
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'right' }
    worksheet.addRow([''])

    worksheet.mergeCells('A3:Q3');
    worksheet.getCell('A3').value = 'INVENTORY AND INSPECTION REPORT OF UNSERVICEABLE SEMI-EXPENDABLE PROPERTY'
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A3').font = { bold: true }

    worksheet.mergeCells('A4:Q4');
    worksheet.getCell('A4').value = 'As at __________________________'
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells('A5:Q5');

    worksheet.mergeCells('A6:L6');
    worksheet.getCell('A6').value = 'Entity Name:'
    worksheet.getCell('A6').font = { bold: true }

    worksheet.mergeCells('M6:Q6');
    worksheet.getCell('E6').value = 'Fund Cluster'
    worksheet.getCell('E6').font = { bold: true }

    worksheet.mergeCells('A7:Q7');

    worksheet.mergeCells('A8:C8');
    worksheet.getCell('A8').value = '(Name of Accountable Officer'
    worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('E8:H8');
    worksheet.getCell('E8').value = '(Designation)'
    worksheet.getCell('E8').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('J8:M8');
    worksheet.getCell('J8').value = '(Station)'
    worksheet.getCell('J8').alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('N8:Q8');

    worksheet.mergeCells('A9:I10');
    worksheet.getCell('A9').value = 'INVENTORY'
    worksheet.getCell('A9').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('A9').font = { bold: true }

    worksheet.mergeCells('J9:Q10');
    worksheet.getCell('J9').value = 'INSPECTION and DISPOSAL'
    worksheet.getCell('J9').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('J9').font = { bold: true }

    worksheet.mergeCells('A11:A12');
    worksheet.getCell('A11').value = 'Date Acquired'
    worksheet.getCell('A11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('A11').font = { bold: true }

    worksheet.mergeCells('B11:B12');
    worksheet.getCell('B11').value = 'Particulars/ Articles'
    worksheet.getCell('B11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('B11').font = { bold: true }

    worksheet.mergeCells('C11:C12');
    worksheet.getCell('C11').value = 'Semi-expendable Property No.'
    worksheet.getCell('C11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('C11').font = { bold: true }

    worksheet.mergeCells('D11:D12');
    worksheet.getCell('D11').value = 'Qty'
    worksheet.getCell('D11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('D11').font = { bold: true }

    worksheet.mergeCells('E11:E12');
    worksheet.getCell('E11').value = 'Unit Cost'
    worksheet.getCell('E11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('E11').font = { bold: true }

    worksheet.mergeCells('F11:F12');
    worksheet.getCell('F11').value = 'Total Cost'
    worksheet.getCell('F11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('F11').font = { bold: true }

    worksheet.mergeCells('G11:G12');
    worksheet.getCell('G11').value = 'Accumulated Impairment Losses'
    worksheet.getCell('G11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('G11').font = { bold: true }

    worksheet.mergeCells('H11:H12');
    worksheet.getCell('H11').value = 'Carrying Amount'
    worksheet.getCell('H11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('H11').font = { bold: true }

    worksheet.mergeCells('I11:I12');
    worksheet.getCell('I11').value = 'Remarks'
    worksheet.getCell('I11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('I11').font = { bold: true }

    worksheet.mergeCells('J11:N11');
    worksheet.getCell('J11').value = 'DISPOSAL'
    worksheet.getCell('J11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('J11').font = { bold: true }

    worksheet.getCell('J12').value = 'Sale'
    worksheet.getCell('J12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('J12').font = { bold: true }

    worksheet.getCell('K12').value = 'Transfer'
    worksheet.getCell('K12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('K12').font = { bold: true }

    worksheet.getCell('L12').value = 'Distruction'
    worksheet.getCell('L12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('L12').font = { bold: true }

    worksheet.getCell('M12').value = 'Others (Specify)'
    worksheet.getCell('M12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('M12').font = { bold: true }

    worksheet.getCell('N12').value = 'Total'
    worksheet.getCell('N12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('N12').font = { bold: true }

    worksheet.mergeCells('O11:O12');
    worksheet.getCell('O11').value = 'Appraised Value'
    worksheet.getCell('O11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('O11').font = { bold: true }

    worksheet.mergeCells('P11:Q11');
    worksheet.getCell('P11').value = 'RECORD OF SALES'
    worksheet.getCell('P11').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('P11').font = { bold: true }

    worksheet.getCell('P12').value = 'OR No.'
    worksheet.getCell('P12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('P12').font = { bold: true }

    worksheet.getCell('Q12').value = 'Amount'
    worksheet.getCell('Q12').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    worksheet.getCell('Q12').font = { bold: true }

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

    worksheet.mergeCells('A29:I33');
    worksheet.getCell('A29').value = '   I HEREBY request inspection and disposition, pursuant to Section 79 of P.D. No. 1445, of the property enumerated above.'
    worksheet.getCell('A29').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('J29:M33');
    worksheet.getCell('J29').value = '   I CERTIFY that I have inspected each and every article enumerated in this report, and that the disposition made thereof was, in my judgement, the best for the public interest.'
    worksheet.getCell('J29').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('N29','N33');

    worksheet.mergeCells('O29:Q33');
    worksheet.getCell('O29').value = '   I CERTIFY that I have witnessed the disposition of the articles enumerated on this report this ____ day of _____________, _______.'
    worksheet.getCell('O29').alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

    worksheet.mergeCells('A34:D34');
    worksheet.getCell('A34').value = 'Requested by:'
    worksheet.getCell('A34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('F34:I34');
    worksheet.getCell('F34').value = 'Approved by:'
    worksheet.getCell('F34').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('J34:Q34');
    
    worksheet.mergeCells('A35:D35');
    worksheet.mergeCells('F35:I35');
    worksheet.mergeCells('J35:M35');
    worksheet.mergeCells('O35:Q35');
    
    worksheet.mergeCells('A36:D37');
    worksheet.getCell('A36').value = '(Signature over Printed Name of Accountable Officer)'
    worksheet.getCell('A36').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('F36:I37');

    worksheet.mergeCells('J36:M37');
    worksheet.getCell('J36').value = 'Signature over Printed Name of Inspection Officer'
    worksheet.getCell('J36').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('O36:Q37');
    worksheet.getCell('O36').value = 'Signature over Printed Name of Witness'
    worksheet.getCell('O36').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('A38:D38');
    worksheet.mergeCells('F38:I38');
    worksheet.mergeCells('J38:Q38');

    worksheet.mergeCells('A39:D39');
    worksheet.getCell('A39').value = '(Designation of Accountable Officer)'
    worksheet.getCell('A39').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    worksheet.mergeCells('F39:I39');
    worksheet.mergeCells('J39:Q39');



    
    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']
    for (let row = 1; row < 40; row++) {
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
      FileSaver.saveAs(blob, 'Unserviceable-Property-Report-' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }
}