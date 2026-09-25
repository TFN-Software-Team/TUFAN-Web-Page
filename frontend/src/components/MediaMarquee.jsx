import React, { useRef, useState, useEffect } from 'react';
import { Camera, Calendar, ArrowRight } from 'lucide-react';

export default function MediaMarquee({ items = [], onSelectMedia, dragHint = '← Sürükleyin veya İnceleyin →' }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Triple items for continuous infinite marquee wrapping
  const displayItems = [...items, ...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    const speed = 0.8; // pixels per frame

    const step = () => {
      if (container && !isDraggingRef.current && !isHoveredRef.current) {
        container.scrollLeft += speed;
        // Infinite wrap check: if reached 2/3 of total scroll width, reset to 1/3
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll * 2) {
          container.scrollLeft -= maxScroll;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += maxScroll;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [items]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeftState - walk;
    setDragDistance((prev) => prev + Math.abs(walk));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    isHoveredRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (!containerRef.current || e.touches.length === 0) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
    setDragDistance((prev) => prev + Math.abs(walk));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleCardClick = (item) => {
    // Only count as click if drag distance was minimal
    if (dragDistance < 10) {
      if (onSelectMedia) onSelectMedia(item);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="media-marquee-wrapper" style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '2rem 0' }}>
      {/* Drag hint badge */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        letterSpacing: '0.05em',
        userSelect: 'none'
      }}>
        {dragHint}
      </div>

      {/* Marquee Track Container */}
      <div
        ref={containerRef}
        className={`media-marquee-track ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        style={{
          display: 'flex',
          gap: '2rem',
          overflowX: 'auto',
          scrollBehavior: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          padding: '2.5rem 1rem 3rem 1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {displayItems.map((item, index) => {
          // Alternate staggered vertical offset
          const isOdd = index % 2 !== 0;
          const staggerStyle = {
            transform: isOdd
              ? 'translateY(-18px) rotate(-1.5deg)'
              : 'translateY(18px) rotate(1.5deg)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          };

          const hasImage = item.imageUrl && item.imageUrl.trim() !== '';

          return (
            <div
              key={`${item.id}-${index}`}
              className="polaroid-card"
              style={{
                ...staggerStyle,
                flex: '0 0 auto',
                width: '240px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '12px 12px 16px 12px',
                boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.12)',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => handleCardClick(item)}
            >
              {/* Photo Box (Square 1:1 Aspect Ratio) */}
              <div style={{
                width: '100%',
                height: '216px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-color)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)'
              }}>
                {hasImage ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <Camera size={36} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>TUFAN</span>
                  </div>
                )}

                {/* Date Tag Overlay */}
                {item.date && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Calendar size={10} /> {item.date}
                  </span>
                )}
              </div>

              {/* Polaroid Bottom Caption */}
              <div style={{ marginTop: '12px', padding: '0 4px' }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </h4>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--tfn-blue)',
                  fontWeight: '600'
                }}>
                  <span>İncele</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
