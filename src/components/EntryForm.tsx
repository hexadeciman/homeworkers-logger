import { useCallback, useEffect, useMemo, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import {
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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
const getLastValFromEntries = (
  calendarEntries: CalendarData[],
  defaultSelectedWorkerType: string
) => {
  const occurence = (calendarEntries as any).findLast(
    (e: CalendarData) => e.type === defaultSelectedWorkerType
  );
  let startLastVal, endLastVal;
  if (occurence?.start && occurence.end) {
    const start = dayjs.unix(occurence.start);
    startLastVal = {
      hour: start.hour(),
      min: start.minute(),
    };
    const end = dayjs.unix(occurence.end);
    endLastVal = {
      hour: end.hour(),
      min: end.minute(),
    };
  }
  return [startLastVal, endLastVal];
};

function calculateTime(
  selectedDay: string | null,
  selectedEntry?: number,
  lastTime?: {
    hour: number;
    min: number;
  }
) {
  if (selectedEntry) {
    return dayjs.unix(selectedEntry).startOf("minute");
  } else if (lastTime) {
    return dayjs(selectedDay)
      .startOf("day")
      .set("hour", lastTime.hour)
      .set("minute", lastTime.min);
  } else {
    return dayjs(selectedDay).startOf("day");
  }
}

export const EntryForm = ({
  data: calendarEntries,
  setData: saveCalendarEntries,
}: {
  data: CalendarData[];
  setData: (d: CalendarData[]) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [workers] = useLocalStorage<Worker[]>("workers", defaultWorkers);

  const searchParams = new URLSearchParams(location.search);
  const selectedDay = searchParams.get("selectedDay");
  const id = searchParams.get("id");

  const selectedEntry = id ? calendarEntries.find((e) => e.id === id) : null;
  const defaultSelectedWorkerType = selectedEntry
    ? selectedEntry.type
    : workers[0].name;

  const [selectedWorkerType, setSelectedWorkerType] = useState<string>(
    defaultSelectedWorkerType
  );

  const [defaultStartTime, defaultEndTime] = useMemo(() => {
    const [lastStart, lastEnd] = getLastValFromEntries(
      calendarEntries,
      defaultSelectedWorkerType
    );
    const start = calculateTime(
      selectedDay,
      selectedEntry?.start as number,
      lastStart
    );
    const end = calculateTime(
      selectedDay,
      selectedEntry?.end as number,
      lastEnd
    );
    debugger;

    return [start, end];
  }, [calendarEntries, defaultSelectedWorkerType, selectedDay, selectedEntry]);

  const [startTime, setStartTime] = useState<Dayjs>(defaultStartTime);
  const [endTime, setEndTime] = useState<Dayjs>(defaultEndTime);

  const onSelectedWorkerTypeChangeCB = useCallback(
    (el: SelectChangeEvent<string>) => {
      setSelectedWorkerType(el.target.value);
      const [lastStart, lastEnd] = getLastValFromEntries(
        calendarEntries,
        el.target.value
      );
      if (lastStart && lastEnd) {
        setStartTime((old) =>
          old.set("hour", lastStart.hour).set("minute", lastStart.min)
        );
        setEndTime((old) =>
          old.set("hour", lastEnd.hour).set("minute", lastEnd.min)
        );
      }
    },
    [calendarEntries]
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
            type: selectedWorkerType ?? "",
            start: startTime.unix() ?? 0,
            end: endTime.unix() ?? 0,
          } as CalendarData,
        ]);
      } else {
        saveCalendarEntries([
          ...(calendarEntries ?? []),
          {
            id: uuid(),
            type: selectedWorkerType ?? "",
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
    selectedWorkerType,
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
          {id ? "Edit" : "Add"} Entry / Edit Workers
        </Typography>
      </div>
      <Card className="border border-gray-100 w-full h-400 !rounded-xl !shadow-lg grid grid-flow-row gap-4 p-4">
        <Typography
          className="whitespace-nowrap w-full leading-none"
          variant="h5"
          component="h5"
          fontWeight={800}
        >
          {id ? "Edit" : "Add"} Entry
        </Typography>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedWorkerType}
          onChange={onSelectedWorkerTypeChangeCB}
        >
          {workers.map((w) => (
            <MenuItem key={w.id} value={w.name}>
              {w.name}
            </MenuItem>
          ))}
        </Select>

        <TimePicker
          value={startTime}
          minutesStep={30}
          onChange={setStartTime as any}
          label="Start Time"
        />
        <TimePicker
          value={endTime}
          minutesStep={30}
          minTime={startTime}
          onChange={setEndTime as any}
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
