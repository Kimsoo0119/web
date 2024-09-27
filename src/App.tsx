import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import MainScreen from "./screens/Main";
import SearchScreen from "./screens/Search";
import SurveyModal from "./components/SurveyModal";
import Analytics from "./components/GoogleAnalytics";
import ReactGA from "react-ga4";
import CompletionModal from "./components/CompleteModal";
const ENV = import.meta.env;

function AppContent() {
  ReactGA.initialize(ENV.VITE_GOOGLE_ANALYTICS_ID);
  const location = useLocation();
  Analytics(location);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [surveyTimer, setSurveyTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [delay, setDelay] = useState(5000);
  const deferTime = 20000;

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

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
    if (surveyTimer) {
      clearTimeout(surveyTimer);
    }
    setSurveySubmitted(true);
    setIsCompletionModalOpen(true);
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

  const handleCloseCompletionModal = () => {
    setIsCompletionModalOpen(false);
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
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
        title="제출 완료"
        description={`제출해 주셔서 감사합니다!
더 나은 서비스로 찾아뵙겠습니다😀`}
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
