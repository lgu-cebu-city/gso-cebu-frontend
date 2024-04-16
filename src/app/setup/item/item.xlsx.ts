import { Workbook, Worksheet } from "exceljs";
import { Item } from "src/app/data-model/item";
var FileSaver = require('file-saver');

export class ItemXLSX {
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  constructor() {}

  public generateXLSXFormat(data: Item[]) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Item Master");
    worksheet.pageSetup.printTitlesColumn = 'A:E';
    worksheet.pageSetup.margins = {
      top: .25,
      left: .25,
      bottom: .25,
      right: .25,
      header: 0,
      footer: 0,
    };

    worksheet.mergeCells('A1:E1');
    worksheet.columns[0].width = 6;
    worksheet.columns[1].width = 18;
    worksheet.columns[2].width = 55;
    worksheet.columns[3].width = 9;
    worksheet.columns[4].width = 13;

    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').value = 'ITEM MASTER';
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    worksheet.getRow(2).height = 24;

    worksheet.getCell('A3').value = 'Item';
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A3').font = { bold: true };

    worksheet.getCell('B3').value = 'Code.';
    worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B3').font = { bold: true };

    worksheet.getCell('C3').value = 'Description';
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').font = { bold: true };

    worksheet.getCell('D3').value = 'Unit';
    worksheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D3').font = { bold: true };

    worksheet.getCell('E3').value = 'Price';
    worksheet.getCell('E3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E3').font = { bold: true };

    // Data Rows Start
    for (var i = 0; i < data.length; i++) {
      const currRow = i + 4;
      if (data[i].id == '-') {
        worksheet.mergeCells('A' + currRow + ':E' + currRow);
        worksheet.getCell('A' + currRow).value = data[i]?.description;
        worksheet.getCell('A' + currRow).alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell('A' + currRow).font = { bold: true };
        worksheet.getCell('A' + currRow).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor:{ argb:'FFFF40' }
        };
      } else {
        let temp: string[] = [];
        temp = [
          data[i]?.id || "",
          data[i]?.code || "",
          data[i]?.description || "",
          data[i]?.uom || "",
          data[i]?.price ? this.numberFormat.format(data[i]?.price) : "",
        ];
        worksheet.addRow(temp);
        worksheet.getCell('A' + currRow).alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell('E' + currRow).alignment = { horizontal: "right", vertical: "middle" };
      }
    }
    // Data Rows End

    // Border Start
    const cols = ['A', 'B', 'C', 'D', 'E']
    for (let row = 3; row <= data.length + 2; row++) {
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
      FileSaver.saveAs(blob, 'Item Master - ' + new Date().valueOf() + '.xlsx');
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