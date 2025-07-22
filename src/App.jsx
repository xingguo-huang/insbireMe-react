// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ContentGenerator from './components/ContentGenerator';
import LessonPlanGenerator from './components/LessonPlanGenerator';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>WatsonX.ai Educational Content Generator</h1>
          <nav>
            <Link to="/">Content Generator</Link>
            <Link to="/lesson-plan">Lesson Plan Generator</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<ContentGenerator />} />
            <Route path="/lesson-plan" element={<LessonPlanGenerator />} />
          </Routes>
        </main>
        
        <footer>
          <p>Powered by IBM WatsonX.ai</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
