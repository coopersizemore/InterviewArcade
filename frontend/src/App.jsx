import { Routes, Route } from "react-router-dom";
import './App.css'
// import HomePage from './components/HomePage'
// import StartPage from './components/StartPage'
import InterviewPage from './components/InterviewPage'
// import FeedbackPage from './components/FeedbackPage'

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/start" element={<StartPage />} /> */}
      <Route path="/interview" element={<InterviewPage />} />
      {/* <Route path="/feedback" element={<FeedbackPage />} /> */}
    </Routes>
  );
}

export default App
