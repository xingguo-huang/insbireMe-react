// src/components/ContentGenerator.jsx
import { useEffect, useState } from 'react';
import './ContentGenerator.css';
import { generateContent } from '../services/api';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [useWebContext, setUseWebContext] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowQuiz(false);
    setAnswers({});
    setScore(null);

    try {
      // Pass useWebContext to your API function
      const data = await generateContent(topic, useWebContext);
      setResult(data);
      setTimeLeft(120);
      setTimerActive(true);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (result && timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setShowQuiz(true);
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [result, timerActive, timeLeft]);

  const handleStartQuiz = () => {
    console.log('Start quiz button clicked'); // Add logging
    setShowQuiz(true);
    setTimerActive(false);
  };

  const handleOptionChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleQuizSubmit = () => {
    const total = result.questions.length;
    let correct = 0;
    result.questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined && q.options[selected].is_correct) {
        correct += 1;
      }
    });
    setScore(`${correct} / ${total}`);
  };

  // Update the return statement in your component
  return (
    <div className="content-generator">
      <h2>Generate Educational Content</h2>
      
      {!showQuiz && (
        <>
          <div className="input-container">
            <div className="single-row-controls">
              <label htmlFor="topic" className="topic-label">Topic</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., IBM DB2)"
                className="topic-input"
              />
              
              <div className="toggle-wrapper">
                <div className="switch">
                  <input
                    type="checkbox"
                    id="useGoogle"
                    checked={useWebContext}
                    onChange={(e) => setUseWebContext(e.target.checked)}
                  />
                  <label htmlFor="useGoogle" className="slider round"></label>
                </div>
                <span className="toggle-label">Use Google</span>
              </div>
              
              <button 
                onClick={handleSubmit}
                className="generate-btn"
                disabled={loading}
              >
                {loading ? 'Generating..' : 'Generate'}
              </button>
            </div>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          {result && (
            <div className="content-container">
              <div className="content-card">
                <h3>Generated Content</h3>
                <div className="content">{result.content}</div>
              </div>
              
              <div className="content-card">
                <h3>Quiz Settings</h3>
                <div className="timer-display">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
                <button 
                  className="quiz-btn"
                  onClick={handleStartQuiz}
                  disabled={showQuiz}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {result && showQuiz && (
        <div className="quiz-container">
          <h3>Quiz on: {topic}</h3>
          <div className="questions">
            {result.questions.map((question, index) => (
              <div key={index} className="question">
                <p>{question.question_text}</p>
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="option">
                    <input
                      type="radio"
                      name={`q-${index}`}
                      value={optIndex}
                      onChange={() => handleOptionChange(index, optIndex)}
                      checked={answers[index] === optIndex}
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            ))}
            {score === null ? (
              <button onClick={handleQuizSubmit} className="submit-quiz-btn">Submit Quiz</button>
            ) : (
              <div className="summary">Your score: {score}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
