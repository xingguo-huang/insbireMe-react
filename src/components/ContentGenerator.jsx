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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateContent(topic);
      setResult(data);
      setShowQuiz(false);
      setScore(null);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (result && !showQuiz) {
      setTimeLeft(120);
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [result, showQuiz]);

  const handleStartQuiz = () => {
    setShowQuiz(true);
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
  
  return (
    <div className="content-generator">
      <h2>Generate Educational Content</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Photosynthesis)"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && !showQuiz && (
        <div className="result">
          <h3>Generated Content:</h3>
          <div className="content">{result.content}</div>
          <div className="timer">
            {timeLeft > 0
              ? `Time remaining: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
              : 'You can start the quiz.'}
          </div>
          <button onClick={handleStartQuiz} disabled={timeLeft > 0}>
            Start Quiz
          </button>
        </div>
      )}

      {result && showQuiz && (
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
            <button onClick={handleQuizSubmit}>Submit Quiz</button>
          ) : (
            <div className="summary">Your score: {score}</div>
          )}
        </div>
      )}
    </div>
  );
}
