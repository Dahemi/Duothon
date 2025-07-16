import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChallengePage from './pages/challengePage';
import BuildathonPage from './pages/buildathon';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/challenge" replace />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/buildathon" element={<BuildathonPage />} />
      </Routes>
    </Router>
  );
}

export default App;