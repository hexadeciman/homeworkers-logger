import {
  Card,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Back from "@mui/icons-material/ArrowForwardIos";
import { CalendarData } from "../App";
import { useState } from "react";
import dayjs from "dayjs";
import SummaryGrid from "../SummaryGrid";
import WorkEntries from "../WorkEntriesGrid";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function getCurrentMonthIndex(): number {
  const currentDate = dayjs();
  return currentDate.month();
}

function getCurrentYear(): number {
  const currentDate = dayjs();
  return currentDate.year();
}
export const ReportingView = ({ data }: { data: CalendarData[] }) => {
  const [value, setValue] = useState(getCurrentMonthIndex());
  const [years] = useState([2023, 2024, 2025, 2026]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const selectedMonth = `${selectedYear}-${value + 1}`;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [gridMode, setGridMode] = useState(0);
  const changeGridMode = (event: React.SyntheticEvent, newValue: number) => {
    setGridMode(newValue);
  };
  return (
    <>
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        <div></div>

        <Typography
          className="whitespace-nowrap w-full text-center leading-none"
          variant="h5"
          component="h5"
          fontWeight={800}
        >
          Reporting
        </Typography>

        <Link
          to={{
            pathname: "/",
          }}
        >
          <IconButton aria-label="Example" className="flex justify-center">
            <Back color="primary" />
          </IconButton>
        </Link>
      </div>
      <div>
        <Card className="border border-gray-100 w-full h-400 !rounded-xl !shadow-lg grid grid-flow-row gap-4 p-4">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedYear}
            label=""
            onChange={(el) => {
              setSelectedYear(el.target.value as number);
            }}
          >
            {years.map((w) => (
              <MenuItem key={w} value={w}>
                {w}
              </MenuItem>
            ))}
          </Select>

          <Tabs
            variant="scrollable"
            value={value}
            onChange={handleChange}
            selectionFollowsFocus
            scrollButtons
            aria-label="basic tabs example"
          >
            <Tab label="January" {...a11yProps(0)} />
            <Tab label="February" {...a11yProps(1)} />
            <Tab label="March" {...a11yProps(2)} />
            <Tab label="April" {...a11yProps(3)} />
            <Tab label="May" {...a11yProps(4)} />
            <Tab label="June" {...a11yProps(5)} />
            <Tab label="July" {...a11yProps(6)} />
            <Tab label="August" {...a11yProps(7)} />
            <Tab label="September" {...a11yProps(8)} />
            <Tab label="October" {...a11yProps(9)} />
            <Tab label="November" {...a11yProps(10)} />
            <Tab label="December" {...a11yProps(11)} />
          </Tabs>
        </Card>
        <Card className="mt-4 border border-gray-100 w-full h-400 !rounded-xl !shadow-lg grid grid-flow-row gap-4 p-4">
          <Tabs value={gridMode} onChange={changeGridMode}>
            <Tab label="Aggregated" />
            <Tab label="Detailed" />
          </Tabs>
          {gridMode === 0 && <SummaryGrid selectedMonth={selectedMonth} />}
          {gridMode === 1 && <WorkEntries selectedMonth={selectedMonth} />}
        </Card>
      </div>
    </>
  );
};
