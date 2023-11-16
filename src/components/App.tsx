import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { EntryForm } from "./EntryForm";
import { CalendarView } from "./views/CalendarView";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ReportingView } from "./views/ReportingView";

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1,
});

export type CalendarData = {
  id: string;
  type: string;
  start: number | null;
  end: number | null;
};
export const App = () => {
  const [data, setData] = useLocalStorage<CalendarData[]>(
    "calendarEntries",
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div className="w-full flex justify-center min-h-full">
          <div className="border border-color-black w-full bg-gray-50">
            <div className="grid gap-4 p-2">
              <Routes>
                <Route path="/report" element={<ReportingView data={data} />} />
                <Route path="/" element={<CalendarView data={data} />} />
                <Route
                  path="/new"
                  element={<EntryForm data={data} setData={setData} />}
                />
              </Routes>
            </div>
            {/* <ResultsGrid /> */}
          </div>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
};
