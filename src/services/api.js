// src/services/api.js
import axios from 'axios';

const API_URL = 'https://watsonx-quiz-api.1xqt93j1duhw.us-south.codeengine.appdomain.cloud';

export const generateContent = async (topic) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/generate/`, { 
      topic,
      parameters: {} 
    });
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

export const generateLessonPlan = async (topic, duration, gradeLevel, style) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/generate/lesson-plan`, { 
      topic,
      duration,
      grade_level: gradeLevel,
      style
    });
    return response.data;
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw error;
  }
};
