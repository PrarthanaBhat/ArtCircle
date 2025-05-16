import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface MasonryGridProps {
  children: ReactNode[] | undefined;
  className?: string;
  columnCount?: number;
}

export function MasonryGrid({
  children = [],
  className = '',
  columnCount = 3
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<ReactNode[][]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Responsive column counts
  const getResponsiveColumnCount = () => {
    if (windowWidth < 640) return 1; // Mobile
    if (windowWidth < 1024) return 2; // Tablet
    if (windowWidth < 1280) return 3; // Small desktop
    return columnCount; // Default/large desktop
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const responsiveColumnCount = getResponsiveColumnCount();
    
    // Create empty columns
    const newColumns: ReactNode[][] = Array.from({ length: responsiveColumnCount }, () => []);
    
    // Distribute children into columns evenly if children exists
    if (children && Array.isArray(children)) {
      children.forEach((child, index) => {
        const columnIndex = index % responsiveColumnCount;
        newColumns[columnIndex].push(
          <div key={index} className="masonry-item">
            {child}
          </div>
        );
      });
    }
    
    setColumns(newColumns);
  }, [children, windowWidth, columnCount]);

  return (
    <div
      ref={gridRef}
      className={`grid gap-4 ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${getResponsiveColumnCount()}, minmax(0, 1fr))` 
      }}
    >
      {columns.map((columnItems, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {columnItems}
        </div>
      ))}
    </div>
  );
}
