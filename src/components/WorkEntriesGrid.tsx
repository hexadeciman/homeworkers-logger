import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import dayjs from "dayjs";
import { useLocalStorage } from "@uidotdev/usehooks";
import { CalendarData } from "./App";
import { Worker } from "./WorkerEdition";
import { ColDef } from "ag-grid-community";
import { useExportAGGridToExcel } from "../hooks/useExportAGGridToExcel";
import { Button } from "@mui/material";

const WorkEntries = ({ selectedMonth }: { selectedMonth: string }) => {
  const [data, setData] = useState<any>([]);
  const [rates, setRates] = useState<any>({});
  const gridRef = useRef<AgGridReact>(null);

  const exportToExcel = useExportAGGridToExcel(
    `${selectedMonth}-detail`,
    gridRef
  );

  const [rateData] = useLocalStorage<Worker[]>("workers");
  const [workerData] = useLocalStorage<CalendarData[]>("calendarEntries");

  useEffect(() => {
    // Filter the data for October 2023
    const selectedMonthWorkerData = workerData.filter((worker) => {
      const startDate = dayjs.unix(worker.start as number);
      return startDate.isSame(selectedMonth, "month");
    });
    // Calculate the work entries with Worker, Start Time, End Time, Price, and Hourly Rate
    const workEntries = selectedMonthWorkerData.map((worker) => {
      const rate = rates[worker.type];
      const startDate = dayjs.unix(worker.start as number);
      const endDate = dayjs.unix(worker.end as number);
      const totalHours = endDate.diff(startDate, "minute") / 60;
      const totalPay = totalHours * rate;

      return {
        Worker: worker.type,
        "Start Time": startDate.format("DD-MM-YY HH:mm"),
        "End Time": endDate.format("DD-MM-YY HH:mm"),
        "Total Hours": totalHours,
        Price: `${totalPay} CHF`,
        "Hourly Rate": `${rate} CHF`,
      };
    });

    setData(workEntries);
  }, [workerData, rates, selectedMonth]);

  // Set the rates to the 'rates' state variable
  useEffect(() => {
    const rateMapping: any = {};
    for (const rate of rateData) {
      rateMapping[rate.name] = parseFloat(rate.rate as string);
    }
    setRates(rateMapping);
  }, [rateData]);

  // Define ag-Grid column definitions for work entries
  const columnDefs: ColDef[] = [
    { headerName: "Worker", field: "Worker" },
    {
      headerName: "Start Time",
      field: "Start Time",
      sortable: true,
      sort: "asc",
    },
    { headerName: "End Time", field: "End Time" },
    { headerName: "Hours", field: "Total Hours" },
    { headerName: "Price", field: "Price" },
    { headerName: "Hourly Rate", field: "Hourly Rate" },
  ];

  return (
    <>
      <div className="ag-theme-balham" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={{ flex: 1 }}
        />
      </div>
      <Button onClick={exportToExcel}>Export to Excel</Button>
    </>
  );
};

export default WorkEntries;
