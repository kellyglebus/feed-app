import React, { useState, useEffect } from "react";
import Onboarding from "./pages/onboarding";
import Feed from "./pages/feed";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [topics, setTopics] = useState([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userInterests, setUserInterests] = useState([]);

  // Fetch topics for onboarding
  useEffect(() => {
    // Check if user has already completed onboarding
    const savedInterests = sessionStorage.getItem('userInterests');
    if (savedInterests) {
      setUserInterests(JSON.parse(savedInterests));
      setHasCompletedOnboarding(true);
    }

    // Fetch topics from backend
    fetch(`${API_URL}/topics`)
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error("Topics fetch error:", err));
  }, []);

  const handleOnboardingComplete = (selectedTopics) => {
    setUserInterests(selectedTopics);
    sessionStorage.setItem('userInterests', JSON.stringify(selectedTopics));
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding topics={topics} onComplete={handleOnboardingComplete} />;
  }

  return <Feed initialInterests={userInterests} />;
}

export default App;