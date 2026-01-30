import React, { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FeedItem from '../components/FeedItem'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      fetch(`${API_URL}/topics`)
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(err => console.error("Topics fetch error:", err));
    }, []);
  
    // Fetch topic counts (new!)
    useEffect(() => {
      fetch(`${API_URL}/topic-counts`)
        .then(res => res.json())
        .then(data => setTopicCounts(data))
        .catch(err => console.error("Topic counts fetch error:", err));
    }, []);
  
    // Fetch feed whenever page or selectedTopics changes
    useEffect(() => {
        if (searchQuery) {
            setLoading(true);
            
            const url = `${API_URL}/feed?page=${page}&per_page=10&search=${encodeURIComponent(searchQuery)}`;
            
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
      const url = `${API_URL}/feed?page=${page}&per_page=10${topicFilter ? `&topics=${topicFilter}` : ''}`;
      
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
          <Sidebar 
            topics={topics}
            selectedTopics={selectedTopics}
            topicCounts={topicCounts}
            toggleTopic={toggleTopic}
            trendingTopics={trendingTopics}
          />

        {/* Main feed */}
        <div style={{ flex: 1, padding: "20px" }}>
            {/* Search Bar */}
            <h3>
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedTopics && selectedTopics.length > 0 
                  ? `Your Feed: ${selectedTopics.join(', ')}` 
                  : 'Select topics to see your feed'}
            </h3>
            
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={handleSearch} 
            />
          {feed.map((item, idx) => (
            <FeedItem
              key={item.id || idx}
              item={item}
              isLast={feed.length === idx + 1}
              lastItemRef={lastItemRef}
            />
          ))}
          {loading && <p>Loading more...</p>}
          {!hasMore && feed.length > 0 && <p>No more items</p>}
          {feed.length === 0 && !loading && <p>No items found for selected topics</p>}
        </div>
      </div>
    );
  }