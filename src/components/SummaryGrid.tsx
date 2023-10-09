import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { useLocalStorage } from "@uidotdev/usehooks";
import { CalendarData } from "./App";
import { Worker } from "./WorkerEdition";
import { useExportAGGridToExcel } from "../hooks/useExportAGGridToExcel";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const currencyFormatter = (params: any) => {
  return `${params.value} CHF`;
};
const hoursFormatter = (params: any) => {
  return `${params.value} h`;
};

const SummaryGrid = ({ selectedMonth }: { selectedMonth: string }) => {
  const [rates, setRates] = useState<any>({});
  const [rowData, setRowData] = useState<any>([]);
  const gridRef = useRef<AgGridReact>(null);

  const exportToExcel = useExportAGGridToExcel(
    `${selectedMonth}-summary`,
    gridRef
  );

  const [rateData] = useLocalStorage<Worker[]>("workers");
  const [workerData] = useLocalStorage<CalendarData[]>("calendarEntries");

  useEffect(() => {
    // Calculate the total pay per month for each worker type
    const monthlyPaySummary: any = {};
    const monthlyHoursSummary: any = {};

    // Filter the data for October 2023
    const selectedMonthWorkerData = workerData.filter((worker) => {
      const startDate = dayjs.unix(worker.start as number);
      return startDate.isSame(selectedMonth, "month");
    });
    for (const worker of selectedMonthWorkerData) {
      const rate = rates[worker.type];
      const startDate = dayjs.unix(worker.start as number);
      const endDate = dayjs.unix(worker.end as number);
      const totalHours = endDate.diff(startDate, "minute") / 60;
      const totalPay = totalHours * rate;

      if (monthlyPaySummary[worker.type]) {
        monthlyPaySummary[worker.type] += totalPay;
        monthlyHoursSummary[worker.type] += totalHours;
      } else {
        monthlyPaySummary[worker.type] = totalPay;
        monthlyHoursSummary[worker.type] = totalHours;
      }
    }

    // Format the summary data for ag-Grid
    const summaryData = Object.keys(monthlyPaySummary).map((type) => ({
      type,
      totalPay: monthlyPaySummary[type],
      totalHours: monthlyHoursSummary[type],
      hourlyRate: rates[type], // Include hourly rate here
    }));

    setRowData(summaryData);
  }, [workerData, rates, selectedMonth]);

  // Set the rates to the 'rates' state variable
  useEffect(() => {
    const rateMapping: any = {};
    for (const rate of rateData) {
      rateMapping[rate.name] = parseFloat(rate.rate as string);
    }
    setRates(rateMapping);
  }, [rateData]);

  // Define ag-Grid column definitions
  const columnDefs = [
    { headerName: "Worker", field: "type" },
    {
      headerName: "Hours",
      field: "totalHours",
      valueFormatter: hoursFormatter,
    },
    {
      headerName: "Total Pay",
      field: "totalPay",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Hourly Rate",
      field: "hourlyRate",
      valueFormatter: currencyFormatter,
    }, // New column for hourly rate
  ];

  return (
    <>
      <div className="ag-theme-balham" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{ flex: 1 }}
          groupDefaultExpanded={-1}
        />
      </div>
      <Button onClick={exportToExcel}>Export to Excel</Button>
    </>
  );
};

export default SummaryGrid;
