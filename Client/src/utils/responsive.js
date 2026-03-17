/**
 * Responsive Design Utilities for WanderWise
 * Provides helper functions and constants for responsive layouts
 */

// Breakpoints (matching Tailwind CSS defaults)
export const breakpoints = {
  sm: 640,    // Small devices (phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536 // 2X Extra large devices
};

// Device type detection
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

// Touch device detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

// Responsive class generator
export const responsiveClass = (baseClass, responsiveClasses) => {
  const breakpoint = getCurrentBreakpoint();
  return `${baseClass} ${responsiveClasses[breakpoint] || ''}`.trim();
};

// Viewport height fix for mobile browsers
export const setViewportHeight = () => {
  if (typeof window !== 'undefined') {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
};

// Safe area insets for notched devices (iPhone X+)
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  return {
    top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0,
    bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0,
    left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal')) || 0,
    right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar')) || 0
  };
};

// Add safe area padding to element
export const withSafeArea = (element, position = 'all') => {
  const insets = getSafeAreaInsets();
  
  if (!element) return;
  
  if (position === 'all' || position === 'top') {
    element.style.paddingTop = `${Math.max(0, insets.top)}px`;
  }
  if (position === 'all' || position === 'bottom') {
    element.style.paddingBottom = `${Math.max(0, insets.bottom)}px`;
  }
  if (position === 'all' || position === 'left') {
    element.style.paddingLeft = `${Math.max(0, insets.left)}px`;
  }
  if (position === 'all' || position === 'right') {
    element.style.paddingRight = `${Math.max(0, insets.right)}px`;
  }
};

// Debounce function for resize events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Handle responsive images
export const getResponsiveImageSrc = (imageUrls, maxWidth) => {
  if (!imageUrls || imageUrls.length === 0) return '';
  
  // If it's an array of different sizes, pick the appropriate one
  if (typeof imageUrls[0] === 'object') {
    const suitableImage = imageUrls.find(img => img.width >= maxWidth) || imageUrls[imageUrls.length - 1];
    return suitableImage.url;
  }
  
  // Otherwise return the first image
  return imageUrls[0];
};

// Calculate responsive font size
export const getResponsiveFontSize = (baseSize, minScale = 0.8, maxScale = 1.2) => {
  if (typeof window === 'undefined') return baseSize;
  
  const width = window.innerWidth;
  const scaleFactor = Math.min(maxScale, Math.max(minScale, width / 1024));
  
  return `${baseSize * scaleFactor}px`;
};

// Check if device supports hover
export const supportsHover = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
};

// Optimize grid columns based on screen size
export const getGridColumns = (minColumns = 1, maxColumns = 4) => {
  const breakpoint = getCurrentBreakpoint();
  
  switch (breakpoint) {
    case 'sm':
      return minColumns;
    case 'md':
      return Math.min(2, maxColumns);
    case 'lg':
      return Math.min(3, maxColumns);
    default:
      return maxColumns;
  }
};

// Responsive spacing calculator
export const getResponsiveSpacing = (baseSpacing = 4) => {
  const breakpoint = getCurrentBreakpoint();
  
  const spacingMap = {
    sm: baseSpacing * 0.75,
    md: baseSpacing,
    lg: baseSpacing * 1.25,
    xl: baseSpacing * 1.5,
    '2xl': baseSpacing * 1.75
  };
  
  return spacingMap[breakpoint] || baseSpacing;
};
