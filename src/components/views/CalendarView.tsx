import DataGrid from "../DataGrid";
import { IconButton, Typography } from "@mui/material";
import PlusIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { MainCalendar } from "../MainCalendar";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarData } from "../App";
import { useCallback, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

function areUnixTimestampsOnSameDay(
  timestamp1: number,
  timestamp2: number
): boolean {
  // Convert the Unix timestamps to dayjs objects
  const date1 = dayjs.unix(timestamp1);
  const date2 = dayjs.unix(timestamp2);

  // Compare day, month, and year of both dayjs objects
  return (
    date1.date() === date2.date() &&
    date1.month() === date2.month() &&
    date1.year() === date2.year()
  );
}

export const CalendarView = ({ data }: { data: CalendarData[] }) => {
  let [searchParams, setSearchParams] = useSearchParams();

  const [selectedDay, setSelectedDay] = useState<Dayjs>(
    dayjs(
      searchParams.get("selectedDay")
        ? searchParams.get("selectedDay")
        : new Date()
    )
  );
  const highlightedDays = useMemo(() => {
    return data.reduce((acc: number[], curr) => {
      if (curr.start) {
        acc.push(curr.start);
      }
      return acc;
    }, []);
  }, [data]);

  const dataFromSelectedDay = useMemo(() => {
    return data.filter((row) => {
      if (row.start && selectedDay) {
        return areUnixTimestampsOnSameDay(row.start, selectedDay.unix());
      } else {
        return false;
      }
    });
  }, [data, selectedDay]);

  const onSelectedDayChangeCB = useCallback(
    (d: Dayjs) => {
      setSelectedDay(d);
      setSearchParams({ selectedDay: d.format("YYYY-MM-DD") });
    },
    [setSearchParams]
  );
  return (
    <>
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        <Link
          to={{
            pathname: "/report",
          }}
        >
          <IconButton aria-label="Example" className="flex justify-center">
            <AssessmentIcon color="disabled" />
          </IconButton>
        </Link>

        <Typography
          className="whitespace-nowrap w-full text-center leading-none"
          variant="h5"
          component="h5"
          fontWeight={800}
        >
          Entry Log
        </Typography>

        <Link
          to={{
            pathname: "/new",
            search: `?selectedDay=${selectedDay.format("YYYY-MM-DD")}`,
          }}
        >
          <IconButton aria-label="Example" className="flex justify-center">
            <PlusIcon color="primary" />
          </IconButton>
        </Link>
      </div>
      <MainCalendar
        initialDay={selectedDay}
        data={highlightedDays}
        selectedDay={selectedDay}
        onDaySelect={onSelectedDayChangeCB}
      />
      <div className="w-full h-[1px] bg-gray-200" />
      <DataGrid data={dataFromSelectedDay} />
    </>
  );
};
