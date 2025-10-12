import { Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from './components/Home/HomePage'
import CompanyPage from "./components/CompanyPage/CompanyPage";
import StartPage from './components/Start/StartPage'
import InterviewPage from './components/Interview/InterviewPage'
import FeedbackPage from './components/Feedback/FeedbackPage'
import BreakoutLoadingScreen from "./components/Loading/BreakoutLoadingScreen";
import RecorderPage from './components/Interview/RecorderPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/companies" element={<CompanyPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/loading" element={<BreakoutLoadingScreen />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/audiotest" element={<RecorderPage />} />
    </Routes>
  );
}

export default App
