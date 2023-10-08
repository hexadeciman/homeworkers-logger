import { useEffect, useMemo, useState } from "react";

const mobileWidth = 900;

export enum Media {
  MOBILE = "mobile",
  DESKTOP = "desktop",
}
const useMediaQuery = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resizeHandler = () => {
      const currentWindowWidth = window.innerWidth;
      setWindowWidth(currentWindowWidth);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const media = useMemo(() => {
    if (windowWidth <= mobileWidth) {
      return { isMobile: true, isDesktop: false };
    }
    return { isMobile: false, isDesktop: true };
  }, [windowWidth]);
  return media;
};

export default useMediaQuery;
