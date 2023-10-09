import { AgGridReact } from "ag-grid-react";
import { RefObject, useCallback } from "react";
import * as XLSX from "xlsx";

export const useExportAGGridToExcel = (
  title: string,
  gridRef: RefObject<AgGridReact>
) => {
  const exportToExcel = useCallback(() => {
    if (gridRef.current) {
      const api = gridRef.current.api;

      // Get the row data
      const rowData = (
        api.getDataAsCsv({ columnSeparator: "\t" }) as any
      ).split("\n");

      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet([
        ...rowData.map((row: any) =>
          row.split("\t").map((cell: any) => cell.replace(/"/g, ""))
        ),
      ]);

      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Save the Excel file
      XLSX.writeFile(wb, `reporting-${title}.xlsx`);
    }
  }, [gridRef, title]);

  return exportToExcel;
};
