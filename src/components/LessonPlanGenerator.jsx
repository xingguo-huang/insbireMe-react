// src/components/LessonPlanGenerator.jsx
import { useState } from 'react';
import { generateLessonPlan } from '../services/api';

export default function LessonPlanGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    duration: 45,
    gradeLevel: '',
    style: 'Facilitator'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateLessonPlan(
        formData.topic,
        formData.duration,
        formData.gradeLevel,
        formData.style
      );
      setResult(data);
    } catch (err) {
      setError('Failed to generate lesson plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render form and results (similar structure to ContentGenerator)
  // ...
}