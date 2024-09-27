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
  ReactGA.initialize(ENV.VITE_GOOGLE_ANALYTICS_ID);
  const location = useLocation();
  Analytics(location);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyTimer, setSurveyTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [delay, setDelay] = useState(150000);
  const deferTime = 150000;

  const [surveySubmitted, setSurveySubmitted] = useState(() => {
    const saved = localStorage.getItem("surveySubmitted");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("surveySubmitted", JSON.stringify(surveySubmitted));
  }, [surveySubmitted]);

  useEffect(() => {
    if (!surveySubmitted) {
      const timer = setTimeout(() => {
        setIsSurveyModalOpen(true);
      }, delay);

      setSurveyTimer(timer);

      return () => clearTimeout(timer);
    }
  }, [delay, surveySubmitted]);

  const handleCloseSurveyModal = (submitted = false) => {
    setIsSurveyModalOpen(false);
    if (surveyTimer) {
      clearTimeout(surveyTimer);
    }
    setSurveySubmitted(true);
  };

  const handleDeferSurveyModal = () => {
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
