import { DatePipe } from "@angular/common";
import { Workbook, Worksheet } from "exceljs";
import { PurchaseRequestModel } from "src/app/data-model/purchase-request-model";
var FileSaver = require('file-saver');

export class PurchaseRequestConsolidatedXLSX {
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() {}

  public generateXLSXFormat(data: PurchaseRequestModel) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Purchase Request");
    worksheet.pageSetup.printTitlesColumn = 'A:G';
    worksheet.pageSetup.margins = {
      top: .25,
      left: .25,
      bottom: .25,
      right: .25,
      header: 0,
      footer: 0,
    };

    worksheet.mergeCells('A1:G1');
    worksheet.columns[0].width = 3.67;
    worksheet.columns[1].width = 8;
    worksheet.columns[2].width = 35;
    worksheet.columns[3].width = 9;
    worksheet.columns[4].width = 17;
    worksheet.columns[5].width = 9;
    worksheet.columns[6].width = 17;

    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').value = 'PURCHASE REQUEST';
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    this.createOuterBorder(
      worksheet,
      { row: 2, col: 1 },
      { row: 2, col: 7 }
    );
    worksheet.getRow(2).height = 24;

    worksheet.mergeCells('A3:B3');
    worksheet.getCell('A3').value = 'LGU:';
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.getCell('C3').value = 'CITY OF CEBU';
    worksheet.getCell('C3').font = { underline: true };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'left' };

    this.createOuterBorder(
      worksheet,
      { row: 3, col: 1 },
      { row: 3, col: 3 }
    );
    worksheet.getRow(3).height = 24;

    worksheet.getCell('D3').value = 'Fund:';
    worksheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('E3:G3');
    worksheet.getCell('E3').value = data.sourceOfFund;
    worksheet.getCell('E3').font = { underline: true };
    worksheet.getCell('E3').alignment = { vertical: 'middle', horizontal: 'left' };

    this.createOuterBorder(
      worksheet,
      { row: 3, col: 4 },
      { row: 3, col: 7 }
    );

    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'Department:';

    worksheet.getCell('C4').value = data.departmentName;
    worksheet.getCell('C4').font = { underline: true };

    this.createOuterBorder(
      worksheet,
      { row: 4, col: 1 },
      { row: 5, col: 3 }
    );

    worksheet.getCell('D4').value = 'PR No.:';

    worksheet.getCell('E4').value = data.prNo;
    worksheet.getCell('E4').font = { underline: true };

    worksheet.getCell('F4').value = 'Date:';

    // worksheet.getCell('G4').value = this.datepipe.transform(data.prDate, 'MMM d, yyyy') || "";
    worksheet.getCell('G4').value = "";
    worksheet.getCell('G4').font = { underline: true };

    worksheet.mergeCells('A5:B5');
    worksheet.getCell('A5').value = 'Section:';

    worksheet.getCell('C5').value = data.sectionName;
    worksheet.getCell('C5').font = { underline: true };

    worksheet.getCell('D5').value = 'FPP:';

    worksheet.mergeCells('E5:G5');
    worksheet.getCell('E5').value = "";
    worksheet.getCell('E5').font = { underline: true };

    this.createOuterBorder(
      worksheet,
      { row: 4, col: 4 },
      { row: 5, col: 7 }
    );

    worksheet.getCell('A6').value = 'Item';
    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A6').font = { bold: true };

    worksheet.getCell('B6').value = 'Unit.';
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').font = { bold: true };

    worksheet.getCell('C6').value = 'Description';
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').font = { bold: true };

    worksheet.getCell('D6').value = 'Quantity';
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').font = { bold: true };

    worksheet.getCell('E6').value = 'Unit Cost';
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').font = { bold: true };

    worksheet.mergeCells('F6:G6');
    worksheet.getCell('F6').value = 'TotalCost';
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').font = { bold: true };
    
    // Data Rows Start
    var total: number = 0;
    var itemLen = data.items.length > 35 ? data.items.length + 1 : 35;
    for (var i = 0; i <= itemLen; i++) {
      let temp: string[] = [];
      if (data.items[i]) {
        temp = [
          (i+1).toString(),
          data.items[i].uom,
          data.items[i].description + (data.items[i].specification ? " - " + data.items[i].specification : ""),
          data.items[i].dbmQty.toLocaleString('en-US', { maximumFractionDigits: 2 }),
          Number(parseFloat(data.items[i].cost.toString()).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }),
          Number(parseFloat(data.items[i].total.toString()).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }),
          ""
        ];
        total += data.items[i].total;
      } else if (i == data.items.length) {
        temp = [
          "",
          "",
          "***Nothing Follows***",
          "",
          "",
          "",
          "",
          "",
        ];
      } else {
        temp = [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
      }
      worksheet.addRow(temp);
      const currRow = i + 7;
      worksheet.mergeCells('F' + currRow + ':G' + currRow);
      worksheet.getCell('D' + currRow).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell('E' + currRow).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell('F' + currRow).alignment = { horizontal: "right", vertical: "middle" };
    }

    var currRow = itemLen + 6 + 1;

    worksheet.getCell('E' + (currRow + 1)).value = 'Total'
    worksheet.getCell('E' + (currRow + 1)).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E' + (currRow + 1)).font = { bold: true };

    worksheet.mergeCells('F' + (currRow + 1) + ':G' + (currRow + 1));
    worksheet.getCell('F' + (currRow + 1)).value = Number(parseFloat(total.toString()).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
    worksheet.getCell('F' + (currRow + 1)).alignment = { vertical: 'middle', horizontal: 'right' };
    worksheet.getCell('F' + (currRow + 1)).font = { bold: true };

    worksheet.getRow(currRow + 1).height = 24;
    // Data Rows End

    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    for (let row = 6; row <= currRow + 1; row++) {
      cols.forEach(col => {
        const cellrow = worksheet.getCell(`${col + row}` + '');
        cellrow.border = {
          top: { style: 'thin', color: { argb: '00000000' } },
          left: { style: 'thin', color: { argb: '00000000' } },
          bottom: { style: 'thin', color: { argb: '00000000' } },
          right: { style: 'thin', color: { argb: '00000000' } }
        };
      });
    }
    // Border End

    worksheet.mergeCells('A' + (currRow + 2) + ':B' + (currRow + 4));
    worksheet.getCell('A' + (currRow + 2)).value = 'Purpose';
    worksheet.getCell('A' + (currRow + 2)).alignment = { vertical: 'top', horizontal: 'left' };

    worksheet.mergeCells('C' + (currRow + 2) + ':G' + (currRow + 4));
    worksheet.getCell('C' + (currRow + 2)).value = data.rationale;
    worksheet.getCell('C' + (currRow + 2)).alignment = { vertical: 'top', horizontal: 'left' };

    this.createOuterBorder(
      worksheet,
      { row: (currRow + 2), col: 1 },
      { row: (currRow + 4), col: 7 }
    );

    worksheet.mergeCells('A' + (currRow + 5) + ':B' + (currRow + 5));
    
    worksheet.getCell('C' + (currRow + 5)).value = 'Requested By';
    worksheet.getCell('C' + (currRow + 5)).alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('D' + (currRow + 5) + ':E' + (currRow + 5));
    worksheet.getCell('D' + (currRow + 5)).value = 'Cash Availability';
    worksheet.getCell('D' + (currRow + 5)).alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('F' + (currRow + 5) + ':G' + (currRow + 5));
    worksheet.getCell('F' + (currRow + 5)).value = 'Approved By';
    worksheet.getCell('F' + (currRow + 5)).alignment = { vertical: 'middle', horizontal: 'center' };

    
    worksheet.mergeCells('A' + (currRow + 6) + ':B' + (currRow + 6));
    worksheet.getCell('A' + (currRow + 6)).value = 'Signature';
    worksheet.getCell('A' + (currRow + 6)).alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.mergeCells('D' + (currRow + 6) + ':E' + (currRow + 6));
    worksheet.mergeCells('F' + (currRow + 6) + ':G' + (currRow + 6));

    worksheet.mergeCells('A' + (currRow + 7) + ':B' + (currRow + 7));
    worksheet.getCell('A' + (currRow + 7)).value = 'Printed Name';
    worksheet.getCell('A' + (currRow + 7)).alignment = { vertical: 'middle', horizontal: 'left' };
    
    worksheet.getCell('C' + (currRow + 7)).value = data.requestedByName;
    worksheet.getCell('C' + (currRow + 7)).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C' + (currRow + 7)).font = { bold: true };
    
    worksheet.mergeCells('D' + (currRow + 7) + ':E' + (currRow + 7));
    worksheet.getCell('D' + (currRow + 7)).value = data.cashAvailabilityName;
    worksheet.getCell('D' + (currRow + 7)).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D' + (currRow + 7)).font = { bold: true };
    
    worksheet.mergeCells('F' + (currRow + 7) + ':G' + (currRow + 7));
    worksheet.getCell('F' + (currRow + 7)).value = data.approvedByName;
    worksheet.getCell('F' + (currRow + 7)).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F' + (currRow + 7)).font = { bold: true };

    worksheet.mergeCells('A' + (currRow + 8) + ':B' + (currRow + 8));
    worksheet.getCell('A' + (currRow + 8)).value = 'Designation';
    worksheet.getCell('A' + (currRow + 8)).alignment = { vertical: 'middle', horizontal: 'left' };
    
    worksheet.getCell('C' + (currRow + 8)).value = data.requestedByPosition;
    worksheet.getCell('C' + (currRow + 8)).alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('D' + (currRow + 8) + ':E' + (currRow + 8));
    worksheet.getCell('D' + (currRow + 8)).value = data.cashAvailabilityPosition;
    worksheet.getCell('D' + (currRow + 8)).alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('F' + (currRow + 8) + ':G' + (currRow + 8));
    worksheet.getCell('F' + (currRow + 8)).value = data.approvedByPosition;
    worksheet.getCell('F' + (currRow + 8)).alignment = { vertical: 'middle', horizontal: 'center' };

    // Border Start
    for (let row = (currRow + 5); row <= (currRow + 8); row++) {
      cols.forEach(col => {
        const cellrow = worksheet.getCell(`${col + row}` + '');
        cellrow.border = {
          top: { style: 'thin', color: { argb: '00000000' } },
          left: { style: 'thin', color: { argb: '00000000' } },
          bottom: { style: 'thin', color: { argb: '00000000' } },
          right: { style: 'thin', color: { argb: '00000000' } }
        };
      });
    }
    // Border End

    // Save File Start
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Purchase Request - ' + new Date().valueOf() + '.xlsx');
    });
    // Save File End
  }

  createOuterBorder(worksheet: Worksheet, start = {row: 1, col: 1}, end = {row: 1, col: 1}) {
    for (let i = start.row; i <= end.row; i++) {
        const leftBorderCell = worksheet.getCell(i, start.col);
        const rightBorderCell = worksheet.getCell(i, end.col);
        leftBorderCell.border = {
            ...leftBorderCell.border,
            left: { style: 'thin', color: { argb: '00000000' } }
        };
        rightBorderCell.border = {
            ...rightBorderCell.border,
            right: { style: 'thin', color: { argb: '00000000' } }
        };
    }

    for (let i = start.col; i <= end.col; i++) {
        const topBorderCell = worksheet.getCell(start.row, i);
        const bottomBorderCell = worksheet.getCell(end.row, i);
        topBorderCell.border = {
            ...topBorderCell.border,
            top: { style: 'thin', color: { argb: '00000000' } }
        };
        bottomBorderCell.border = {
            ...bottomBorderCell.border,
            bottom: { style: 'thin', color: { argb: '00000000' } }
        };
    }
  };
}