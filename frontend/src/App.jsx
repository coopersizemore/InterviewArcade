import { Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from './components/Home/HomePage'
import StartPage from './components/Start/StartPage'
import InterviewPage from './components/InterviewPage'
import FeedbackPage from './components/Feedback/FeedbackPage'
import BreakoutLoadingScreen from "./components/Loading/BreakoutLoadingScreen";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/loading" element={<BreakoutLoadingScreen />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}

export default App
