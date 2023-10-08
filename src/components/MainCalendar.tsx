import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Badge, Card } from "@mui/material";
import { useCallback, useMemo } from "react";
function isSameDayAsTimestamp(inputDate: Dayjs, unixTimestamp: number) {
  // Convert the Unix timestamp to a dayjs object
  const timestampDate = dayjs.unix(unixTimestamp);
  // Compare day, month, and year
  return (
    timestampDate.date() === inputDate.date() &&
    timestampDate.month() === inputDate.month() &&
    timestampDate.year() === inputDate.year()
  );
}

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const count = useMemo(() => {
    return highlightedDays.reduce((acc, curr) => {
      if (isSameDayAsTimestamp(props.day, curr)) return acc + 1;
      return acc;
    }, 0);
  }, [highlightedDays, props.day]);

  const isSelected = !props.outsideCurrentMonth && count > 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <div className="w-4 h-4 bg-gray-200 rounded-xl flex items-center justify-center font-bold text-xs">
            {count}
          </div>
        ) : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export const MainCalendar = ({
  data,
  onDaySelect,
  initialDay = dayjs(new Date()),
  save,
  add,
  remove,
  isLoading,
}: any) => {
  const onChangeCB = useCallback(
    (v: Dayjs | null) => {
      onDaySelect(v);
    },
    [onDaySelect]
  );
  return (
    <Card className="w-full !relative !h-70 !rounded-xl !shadow-lg justify-self-center">
      <DateCalendar
        defaultValue={initialDay}
        onChange={onChangeCB}
        loading={isLoading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays: data,
          } as any,
        }}
      />
    </Card>
  );
};
