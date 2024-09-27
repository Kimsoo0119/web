import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import MainScreen from "./screens/Main";
import SearchScreen from "./screens/Search";
import SurveyModal from "./components/SurveyModal";
import Analytics from "./components/GoogleAnalytics";
import ReactGA from "react-ga4";
const ENV = import.meta.env;

function AppContent() {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyTimer, setSurveyTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [delay, setDelay] = useState(10000);
  const deferTime = 10000;
  ReactGA.initialize(ENV.VITE_GOOGLE_ANALYTICS_ID);

  const location = useLocation();
  Analytics(location);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSurveyModalOpen(true);
    }, delay);

    setSurveyTimer(timer);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
    if (surveyTimer) {
      clearTimeout(surveyTimer);
    }
    const newTimer = setTimeout(() => {
      setIsSurveyModalOpen(true);
    }, delay);
    setSurveyTimer(newTimer);
  };

  const handleDeferSurveyModal = () => {
    ReactGA.event({
      category: "User",
      action: "SurveyDeferClick",
    });
    setIsSurveyModalOpen(false);
    if (surveyTimer) {
      clearTimeout(surveyTimer);
    }
    const newDelay = delay + deferTime;
    setDelay(newDelay);
    const newTimer = setTimeout(() => {
      setIsSurveyModalOpen(true);
    }, newDelay);
    setSurveyTimer(newTimer);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/search" element={<SearchScreen />} />
      </Routes>
      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={handleCloseSurveyModal}
        onDefer={handleDeferSurveyModal}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
