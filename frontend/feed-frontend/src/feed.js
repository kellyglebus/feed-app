import React, { useEffect, useState, useRef, useCallback } from "react";

export default function Feed({ initialInterests }) {
    const [topics, setTopics] = useState([]);
    const [feed, setFeed] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState(initialInterests || []);
    const [topicCounts, setTopicCounts] = useState({}); 
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const observer = useRef();
    
    const lastItemRef = useCallback(node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    }, [loading, hasMore]);
  
    // Fetch topics on load
    useEffect(() => {
      fetch("/topics")
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(err => console.error("Topics fetch error:", err));
    }, []);
  
    // Fetch topic counts (new!)
    useEffect(() => {
      fetch("/topic-counts")
        .then(res => res.json())
        .then(data => setTopicCounts(data))
        .catch(err => console.error("Topic counts fetch error:", err));
    }, []);
  
    // Fetch feed whenever page or selectedTopics changes
    useEffect(() => {
        if (searchQuery) {
            setLoading(true);
            
            const url = `/feed?page=${page}&per_page=10&search=${encodeURIComponent(searchQuery)}`;
            
            fetch(url)
              .then(res => res.json())
              .then(data => {
                if (page === 1) {
                  setFeed(data.items);
                } else {
                  setFeed(prev => [...prev, ...data.items]);
                }
                setHasMore(data.has_more);
                setLoading(false);
              })
              .catch(err => {
                console.error("Feed fetch error:", err);
                setLoading(false);
              });
            return; // Exit early, don't run the topic-filtered fetch below
          }
      if (!selectedTopics || selectedTopics.length === 0) {
        setFeed([]);
        return;
      }
      
      setLoading(true);
      
      const topicFilter = selectedTopics.join(',');
      const url = `/feed?page=${page}&per_page=10${topicFilter ? `&topics=${topicFilter}` : ''}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (page === 1) {
            setFeed(data.items);
          } else {
            setFeed(prev => [...prev, ...data.items]);
          }
          setHasMore(data.has_more);
          setLoading(false);
        })
        .catch(err => {
          console.error("Feed fetch error:", err);
          setLoading(false);
        });
    }, [page, selectedTopics, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
        setFeed([]);
      };
  
    const toggleTopic = (topic) => {
      setSelectedTopics(prev => {
        if (prev.includes(topic)) {
          return prev.filter(t => t !== topic);
        } else {
          return [...prev, topic];
        }
      });
      setPage(1);
      setFeed([]);
    };
  
    // Sort topics by count for trending
    const trendingTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3
  
      return (
        <div style={{ display: "flex" }}>
          {/* Sidebar */}
          <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc", overflowY: "auto" }}>
            <h3>Your Topics</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Toggle topics to customize your feed
            </p>
            {topics.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  border: selectedTopics.includes(t) ? "2px solid #007bff" : "2px solid #ddd",
                  backgroundColor: selectedTopics.includes(t) ? "#e7f3ff" : "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ marginRight: "8px" }}>
                  {selectedTopics.includes(t) ? "✓" : "○"}
                </span>
                {t}
                {topicCounts[t] && (
                  <span style={{ 
                    float: "right", 
                    fontSize: "12px", 
                    color: "#999",
                    backgroundColor: "#f0f0f0",
                    padding: "2px 6px",
                    borderRadius: "10px"
                  }}>
                    {topicCounts[t]}
                  </span>
                )}
              </button>
            ))}
      
            {/* Trending Topics Section */}
            <div style={{ 
              marginTop: "30px", 
              paddingTop: "20px", 
              borderTop: "1px solid #eee" 
            }}>
              <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>
                Trending Topics
              </h4>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
                Most active opportunities
              </p>
              {trendingTopics.map(([topic, count], index) => (
                <div 
                  key={topic}
                  style={{
                    padding: "8px",
                    marginBottom: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                >
                  <span style={{ 
                    fontWeight: "bold", 
                    color: index === 0 ? "#ff6b6b" : index === 1 ? "#ff8c42" : "#ffd93d",
                    marginRight: "8px"
                  }}>
                    #{index + 1}
                  </span>
                  <span>{topic}</span>
                  <span style={{ 
                    float: "right", 
                    color: "#666",
                    fontSize: "12px"
                  }}>
                    {count} opportunities
                  </span>
                </div>
              ))}
            </div>
      
            {/* Data Sources Section (NEW!) */}
            <div style={{ 
              marginTop: "30px", 
              paddingTop: "20px", 
              borderTop: "1px solid #eee" 
            }}>
              <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>
                Data Sources
              </h4>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
                Aggregating opportunities from trusted government platforms
              </p>
              
              <div style={{ fontSize: "13px" }}>
                {/* Active Sources */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "6px" 
                  }}>
                    <span style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#28a745", 
                      marginRight: "8px" 
                    }}></span>
                    <a 
                      href="https://grants.gov" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      Grants.gov
                    </a>
                  </div>
                  <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "8px" }}>
                    Federal grant opportunities
                  </p>
                </div>
      
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "6px" 
                  }}>
                    <span style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#28a745", 
                      marginRight: "8px" 
                    }}></span>
                    <a 
                      href="https://sam.gov" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      SAM.gov
                    </a>
                  </div>
                  <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "8px" }}>
                    Government contracts & awards
                  </p>
                </div>
      
                {/* Potential/Planned Sources */}
                <div style={{ 
                  paddingTop: "12px", 
                  borderTop: "1px dashed #ddd",
                  marginTop: "12px"
                }}>
                  <p style={{ fontSize: "11px", color: "#999", marginBottom: "8px", fontStyle: "italic" }}>
                    Additional sources (planned):
                  </p>
                  
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "4px" 
                    }}>
                      <span style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        backgroundColor: "#ffc107", 
                        marginRight: "8px" 
                      }}></span>
                      <span style={{ color: "#666" }}>USAJobs.gov</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "6px" }}>
                      Federal employment opportunities
                    </p>
                  </div>
      
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "4px" 
                    }}>
                      <span style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        backgroundColor: "#ffc107", 
                        marginRight: "8px" 
                      }}></span>
                      <span style={{ color: "#666" }}>SBA.gov</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "6px" }}>
                      Small business resources
                    </p>
                  </div>
      
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "4px" 
                    }}>
                      <span style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        backgroundColor: "#ffc107", 
                        marginRight: "8px" 
                      }}></span>
                      <span style={{ color: "#666" }}>FedBizOpps</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "6px" }}>
                      Federal business opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Main feed - rest stays the same */}
        <div style={{ flex: 1, padding: "20px" }}>
        <h3>
            {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : selectedTopics && selectedTopics.length > 0 
                ? `Your Feed: ${selectedTopics.join(', ')}` 
                : 'Select topics to see your feed'}
        </h3>
        {/* Search Bar */}
            <div style={{ marginBottom: "20px", marginTop: "15px" }}>
            <input
                type="text"
                placeholder="Search all opportunities by title..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxSizing: "border-box"
                }}
            />
            {searchQuery && (
                <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                Searching all topics for: "{searchQuery}"
                </p>
            )}
            </div>
          {feed.map((item, idx) => {
            if (feed.length === idx + 1) {
              return (
                <div 
                  ref={lastItemRef}
                  key={item.id || idx} 
                  style={{ 
                    borderBottom: "1px solid #eee", 
                    marginBottom: "15px",
                    paddingBottom: "15px"
                  }}
                >
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{item.title}</h4>
                  </a>
                  <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                    {item.agency} | {item.source}
                  </p>
                  {item.description && (
                    <p style={{ fontSize: "14px", color: "#555", margin: "8px 0" }}>
                      {item.description}
                    </p>
                  )}
                  {item.deadline && (
                    <p style={{ fontSize: "12px", color: "#999" }}>
                      Deadline: {item.deadline}
                    </p>
                  )}
                </div>
              );
            } else {
              return (
                <div 
                  key={item.id || idx} 
                  style={{ 
                    borderBottom: "1px solid #eee", 
                    marginBottom: "15px",
                    paddingBottom: "15px"
                  }}
                >
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{item.title}</h4>
                  </a>
                  <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                    {item.agency} | {item.source}
                  </p>
                  {item.description && (
                    <p style={{ fontSize: "14px", color: "#555", margin: "8px 0" }}>
                      {item.description}
                    </p>
                  )}
                  {item.deadline && (
                    <p style={{ fontSize: "12px", color: "#999" }}>
                      Deadline: {item.deadline}
                    </p>
                  )}
                </div>
              );
            }
          })}
          {loading && <p>Loading more...</p>}
          {!hasMore && feed.length > 0 && <p>No more items</p>}
          {feed.length === 0 && !loading && <p>No items found for selected topics</p>}
        </div>
      </div>
    );
  }