import React from 'react';
import TrendingTopics from './TrendingTopics';
import DataSources from './DataSources';
import TopicButton from './TopicButton';

export default function Sidebar({ topics, selectedTopics, topicCounts, toggleTopic, trendingTopics }) {
  return (
    <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc", overflowY: "auto" }}>
      <h3>Your Topics</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
        Toggle topics to customize your feed
      </p>     
      {topics.map(t => (
        <TopicButton
            key={t}
            topic={t}
            isSelected={selectedTopics.includes(t)}
            count={topicCounts[t]}  // Show count in sidebar
            onClick={() => toggleTopic(t)}
        />
        ))}
      <TrendingTopics topicCounts={topicCounts} trendingTopics={trendingTopics}/>
      <DataSources />
    </div>
  );
}