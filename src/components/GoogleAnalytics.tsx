import { useEffect } from "react";
import ReactGA from "react-ga4";

const Analytics = (location: any) => {
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.send("pageview");
    return;
  }, [location]);
};

export default Analytics;
