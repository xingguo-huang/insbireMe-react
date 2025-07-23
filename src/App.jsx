// src/App.jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import ContentGenerator from './components/ContentGenerator';
import LessonPlanGenerator from './components/LessonPlanGenerator';
import ibmLogo from './assets/ibm-logo.svg'; // Add IBM logo to your assets

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <img src={ibmLogo} alt="IBM Logo" className="sidebar-logo" />
          <h2>inspireMe</h2>
          <nav>
            <NavLink to="/" end>Content Quiz Generator</NavLink>
            <NavLink to="/lesson-plan">Learning Plan Generator</NavLink>
          </nav>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ContentGenerator />} />
            <Route path="/lesson-plan" element={<LessonPlanGenerator />} />
          </Routes>
          
          {/* Add a container around the footer for proper alignment */}
          <div className="content-wrapper">
            <div className="footer">
              Powered by IBM watsonx.ai
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
