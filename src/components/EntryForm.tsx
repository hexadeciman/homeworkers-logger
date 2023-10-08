import { useCallback, useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import {
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Link,
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import { CalendarData } from "./App";
import { uuid } from "../utils/uuid";
import dayjs, { Dayjs } from "dayjs";
import { WorkerEdition, Worker, defaultWorkers } from "./WorkerEdition";
export const EntryForm = ({ data }: any) => {
  const [workers] = useLocalStorage<Worker[]>("workers", defaultWorkers);
  const [calendarEntries, saveCalendarEntries] = useLocalStorage<
    CalendarData[]
  >("calendarEntries", data);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedDay = searchParams.get("selectedDay");
  const id = searchParams.get("id");
  const selectedEntry = id ? calendarEntries.find((e) => e.id === id) : null;
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState<Dayjs>(
    selectedEntry
      ? dayjs.unix(selectedEntry.start as number)
      : dayjs(selectedDay).startOf("day")
  );
  const [endTime, setEndTime] = useState<Dayjs>(
    selectedEntry
      ? dayjs.unix(selectedEntry.end as number)
      : dayjs(selectedDay).startOf("day")
  );
  const [selection, onChangeSelect] = useState<string>(
    selectedEntry ? selectedEntry.type : workers[0].name
  );

  useEffect(() => {
    if (startTime && endTime) {
      console.log("diff", startTime.diff(endTime));
    }
  }, [startTime, endTime]);

  const timeDifference =
    startTime && endTime
      ? parseInt(`${endTime.diff(startTime, "minutes", true)}`) / 60
      : 0;

  const save = useCallback(() => {
    if (startTime && endTime) {
      if (id) {
        const newCalEntries = (calendarEntries ?? []).filter(
          (e) => e.id !== id
        );
        saveCalendarEntries([
          ...newCalEntries,
          {
            id: id,
            type: selection ?? "",
            start: startTime.unix() ?? 0,
            end: endTime.unix() ?? 0,
          } as CalendarData,
        ]);
      } else {
        saveCalendarEntries([
          ...(calendarEntries ?? []),
          {
            id: uuid(),
            type: selection ?? "",
            start: startTime.unix() ?? 0,
            end: endTime.unix() ?? 0,
          } as CalendarData,
        ]);
      }

      navigate({
        pathname: "/",
        search: createSearchParams(
          selectedDay
            ? {
                selectedDay: selectedDay,
              }
            : {}
        ).toString(),
      });
    }
  }, [
    calendarEntries,
    endTime,
    id,
    navigate,
    selectedDay,
    saveCalendarEntries,
    selection,
    startTime,
  ]);
  return (
    <>
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        <Link to={`/?selectedDay=${selectedDay}`}>
          <IconButton aria-label="Example" className="flex justify-center">
            <ArrowBackIosIcon className="relative left-1" color="primary" />
          </IconButton>
        </Link>

        <Typography
          className="whitespace-nowrap w-full text-center leading-none"
          variant="h5"
          component="h5"
          fontWeight={800}
        >
          {id ? "Edit" : "New"} Entry
        </Typography>
      </div>
      <Card className="border border-gray-100 w-full h-400 !rounded-xl !shadow-lg grid grid-flow-row gap-4 p-4">
        <div className="grid grid-flow-col grid-cols-[1fr_40px] gap-1 items-center">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selection}
            label=""
            onChange={(el) => {
              onChangeSelect(el.target.value);
            }}
          >
            {workers.map((w) => (
              <MenuItem key={w.id} value={w.name}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            size="small"
            aria-label="Example"
            className="flex justify-center h-[40px]"
          >
            <SettingsIcon fontSize="small" color="primary" />
          </IconButton>
        </div>

        <TimePicker
          defaultValue={startTime}
          minutesStep={30}
          onChange={(value) => {
            setStartTime(value as any);
          }}
          label="Start Time"
        />
        <TimePicker
          defaultValue={endTime}
          minutesStep={30}
          minTime={startTime}
          onChange={(value) => {
            setEndTime(value as any);
          }}
          label="End Time"
        />
        <Button
          disabled={timeDifference <= 0}
          onClick={save}
          variant="outlined"
        >
          Save {timeDifference > 0 && `${timeDifference} HOURS`}
        </Button>
      </Card>
      <WorkerEdition />
    </>
  );
};
