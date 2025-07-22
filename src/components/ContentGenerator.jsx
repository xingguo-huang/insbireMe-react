// src/components/ContentGenerator.jsx
import { useState } from 'react';
import { generateContent } from '../services/api';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateContent(topic);
      setResult(data);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
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
      
      {result && (
        <div className="result">
          <h3>Generated Content:</h3>
          <div className="content">{result.content}</div>
          
          <h3>Quiz Questions:</h3>
          <div className="questions">
            {result.questions.map((question, index) => (
              <div key={index} className="question">
                <p>{question.question_text}</p>
                <ul>
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex} className={option.is_correct ? 'correct' : ''}>
                      {option.text}
                      {option.is_correct && ' ✓'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}