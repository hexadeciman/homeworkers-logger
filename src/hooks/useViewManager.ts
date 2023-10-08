import { useCallback, useEffect, useMemo, useState } from "react";
import useMediaQuery from "./useMediaQuery";

const defaultColStateDesktop = [true, true, true];
const defaultColStateMobile = [false, true, false];
export const useViewManager = () => {
  const { isMobile } = useMediaQuery();
  const [columnState, setCols] = useState([false, false, false]);

  const gridTemplateColumns = useMemo(
    () =>
      `${columnState[0] ? (isMobile ? "1fr" : "minmax(0,400px)") : "0px"} ${
        columnState[1] ? "minmax(0,1fr)" : "0px"
      } ${columnState[2] ? (isMobile ? "1fr" : "400px") : "0px"}`,
    [columnState, isMobile]
  );
  useEffect(() => {
    if (isMobile) {
      setCols(defaultColStateMobile);
    } else {
      setCols((old) => [old[0], true, old[2]]);
    }
  }, [isMobile]);
  const toggleCalendarCB = useCallback(() => {
    if (isMobile) {
      setCols((old) => (old[2] ? [false, true, false] : [false, false, true]));
    } else {
      setCols((old) => [old[0], old[1], !old[2]]);
    }
  }, [isMobile]);
  const toggleSearchCB = useCallback(() => {
    if (isMobile) {
      setCols((old) => (old[0] ? [false, true, false] : [true, false, false]));
    } else {
      setCols((old) => [!old[0], old[1], old[2]]);
    }
  }, [isMobile]);

  const showTrackingView = useCallback(() => {
    if (isMobile) {
      setCols(defaultColStateMobile);
    }
  }, [isMobile]);

  // initial cols setup
  useEffect(() => {
    if (isMobile) {
      setCols(defaultColStateMobile);
    } else {
      setCols(defaultColStateDesktop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    columnState,
    gridTemplateColumns,
    toggleCalendarCB,
    toggleSearchCB,
    showTrackingView,
    isMobile,
  };
};
