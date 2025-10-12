import { Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from './components/Home/HomePage'
import CompanyPage from "./components/CompanyPage/CompanyPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import StartPage from './components/Start/StartPage'
import InterviewPage from './components/Interview/InterviewPage'
import FeedbackPage from './components/Feedback/FeedbackPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/companies" element={<CompanyPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}

export default App
