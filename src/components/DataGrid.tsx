import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback } from "react";
import { CalendarData } from "./App";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
function getHourDifference(timestamp1: number, timestamp2: number) {
  // Convert Unix timestamps to milliseconds
  const milliseconds1 = timestamp1 * 1000;
  const milliseconds2 = timestamp2 * 1000;

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(milliseconds1 - milliseconds2);

  // Convert milliseconds to hours
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference;
}

const columns: GridColDef[] = [
  { field: "type", headerName: "Type", width: 140 },
  {
    field: "hours",
    headerName: "Hours",
    width: 110,
    valueGetter: (params) => {
      if (params.row.start && params.row.end) {
        return getHourDifference(params.row.start, params.row.end);
      }
      return 0;
    },
  },
];

export default function DataTable({ data }: any) {
  let [searchParams] = useSearchParams();
  const selectedDay = searchParams.get("selectedDay");
  const navigate = useNavigate();

  const [calendarEntries, saveCalendarEntries] = useLocalStorage<
    CalendarData[]
  >("calendarEntries", data);

  const onDelete = useCallback(
    (e: any, d: any) => {
      saveCalendarEntries(calendarEntries.filter((e) => e.id !== d.id));
    },
    [calendarEntries, saveCalendarEntries]
  );

  const onEdit = useCallback(
    (e: any, d: any) => {
      navigate({
        pathname: "/new",
        search: createSearchParams({
          selectedDay: selectedDay ?? "",
          id: d.id,
        }).toString(),
      });
    },
    [navigate, selectedDay]
  );

  return (
    <div className="h-[400px] w-full overflow-x-scroll">
      <DataGrid
        rows={data}
        columns={[
          ...columns,
          {
            field: "actions",
            headerName: "",
            renderCell: (params) => {
              return (
                <div className="grid grid-flow-col gap-1">
                  <IconButton
                    aria-label="Delete"
                    size="small"
                    className="flex justify-center"
                    onClick={(e) => onDelete(e, params.row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="Edit"
                    size="small"
                    className="flex justify-center"
                    onClick={(e) => onEdit(e, params.row)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </div>
              );
            },
          },
        ]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
