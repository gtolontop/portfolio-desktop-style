export const glassmorphismStyles = {
  // Main container style for glassmorphism effect
  container: {
    border: '1px solid rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px) saturate(100%)',
    WebkitBackdropFilter: 'blur(20px) saturate(100%)',
  },
  
  // Gradient overlay for depth
  gradient: {
    background: `
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.4) 5%,
        rgba(255, 255, 255, 0.4) 95%,
        rgba(255, 255, 255, 0.35) 100%
      )
    `
  },
  
  // Combined style
  glass: {
    border: '1px solid rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px) saturate(100%)',
    WebkitBackdropFilter: 'blur(20px) saturate(100%)',
    background: `
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.4) 5%,
        rgba(255, 255, 255, 0.4) 95%,
        rgba(255, 255, 255, 0.35) 100%
      )
    `
  },
  
  // Button styles
  button: {
    default: 'bg-white/20 hover:bg-white/30',
    active: 'bg-white/30',
    hover: 'hover:bg-white/25'
  },
  
  // Input styles
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    focus: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderColor: 'rgba(59, 130, 246, 0.5)' // blue-400 with opacity
    }
  },
  
  // Text colors
  text: {
    primary: '#374151', // gray-700
    secondary: '#6B7280', // gray-500
    muted: '#9CA3AF', // gray-400
    light: 'rgba(255, 255, 255, 0.9)'
  },
  
  // Border colors
  border: {
    default: 'rgba(255, 255, 255, 0.2)',
    strong: 'rgba(255, 255, 255, 0.35)'
  },
  
  // Shadow
  shadow: 'shadow-2xl shadow-black/10'
}