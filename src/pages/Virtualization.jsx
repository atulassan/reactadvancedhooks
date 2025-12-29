import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";

// Mock Data – 10,000 items
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Item ${i}`,
    height: [50, 100, 150][Math.floor(Math.random() * 3)],
    color: `hsl(${Math.random() * 360}, 70%, 80%)`,
  }));
};

const ROW_BUFFER = 5; // Render extra rows above/below for smoothness

// Binary search helper for O(log n) performance
const binarySearchStart = (heightMap, scrollTop) => {
  let low = 0;
  let high = heightMap.length - 1;
  let result = 0;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (heightMap[mid].end <= scrollTop) {
      result = mid + 1;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
};

const binarySearchEnd = (heightMap, scrollBottom) => {
  let low = 0;
  let high = heightMap.length - 1;
  let result = heightMap.length;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (heightMap[mid].start < scrollBottom) {
      low = mid + 1;
    } else {
      result = mid;
      high = mid - 1;
    }
  }
  return result;
};

export default function VirtualizedList() {
  const [query, setQuery] = useState("");
  const [viewportHeight, setViewportHeight] = useState(600);
  
  // Generate full dataset once
  const fullData = useMemo(() => generateItems(10000), []);
  
  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!query.trim()) return fullData;
    return fullData.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, fullData]);

  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Pre-calculate cumulative heights for all items
  // This allows O(1) lookup for any item's position
  const heightMap = useMemo(() => {
    let sum = 0;
    return filteredData.map((item) => {
      const start = sum;
      sum += item.height;
      return { start, end: sum };
    });
  }, [filteredData]);

  const totalHeight = heightMap.length > 0 
    ? heightMap[heightMap.length - 1].end 
    : 0;

  // Throttle scroll handler using requestAnimationFrame
  // This ensures smooth performance even during rapid scrolling
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Update viewport height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Calculate visible range using binary search - O(log n) instead of O(n)
  const { visibleStart, visibleEnd } = useMemo(() => {
    if (heightMap.length === 0) {
      return { visibleStart: 0, visibleEnd: 0 };
    }

    const scrollBottom = scrollTop + viewportHeight;
    
    // Use binary search for better performance
    const startIndex = binarySearchStart(heightMap, scrollTop);
    const endIndex = binarySearchEnd(heightMap, scrollBottom);

    return {
      visibleStart: Math.max(0, startIndex - ROW_BUFFER),
      visibleEnd: Math.min(filteredData.length, endIndex + ROW_BUFFER)
    };
  }, [scrollTop, viewportHeight, heightMap, filteredData.length]);

  const visibleItems = useMemo(() => {
    return filteredData.slice(visibleStart, visibleEnd);
  }, [filteredData, visibleStart, visibleEnd]);

  const handleSearchChange = useCallback((e) => {
    setQuery(e.target.value);
    // Reset scroll when searching
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ marginBottom: "10px" }}>
        Virtualized List - {filteredData.length.toLocaleString()} items
      </h2>
      
      {/* Search Input */}
      <input type="text" placeholder="Search items... (try 'Item 100')" value={query} onChange={handleSearchChange} 
      style={{
          padding: "10px 12px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "15px",
          fontSize: "14px",
          border: "2px solid #ddd",
          borderRadius: "6px",
          outline: "none",
          transition: "border-color 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
        onBlur={(e) => e.target.style.borderColor = "#ddd"}
      />

      {/* Stats */}
      <div style={{
        marginBottom: "10px",
        fontSize: "13px",
        color: "#666",
        display: "flex",
        gap: "20px"
      }}>
        <span>📊 Total Height: {totalHeight.toLocaleString()}px</span>
        <span>👁️ Rendering: {visibleItems.length} items</span>
        <span>📍 Scroll: {Math.round(scrollTop)}px</span>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && query && (
        <div style={{ padding: "40px", textAlign: "center", color: "#999", border: "2px dashed #ddd", borderRadius: "8px" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔍</div>
          <div>No items found for "{query}"</div>
        </div>
      )}

      {/* Virtualized Container */}
      {filteredData.length > 0 && (
        <div ref={containerRef} role="list" aria-label="Virtualized item list" style={{ height: `${viewportHeight}px`, overflowY: "auto", border: "2px solid #ddd", borderRadius: "8px",
            position: "relative", backgroundColor: "#f9f9f9" }}>
          {/* Invisible spacer to maintain scroll height */}
          <div style={{ height: totalHeight, position: "relative" }}>
            {visibleItems.map((item, i) => {
              const index = visibleStart + i;
              const top = heightMap[index].start;
              return (
                <VirtualRow key={item.id} item={item} top={top} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Memoized row component to prevent unnecessary re-renders
const VirtualRow = React.memo(function VirtualRow({ item, top }) {
  return (
    <div role="listitem" style={{ position: "absolute", top, height: item.height, left: 0, right: 0, background: item.color, display: "flex", alignItems: "center", paddingLeft: "15px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.5)", boxSizing: "border-box", fontWeight: "500", fontSize: "14px", transition: "background-color 0.2s" }}>
      <span style={{ flex: 1 }}>{item.text}</span>
      <span style={{
        fontSize: "12px",
        color: "rgba(0, 0, 0, 0.5)",
        marginRight: "15px"
      }}>
        {item.height}px
      </span>
    </div>
  );
});