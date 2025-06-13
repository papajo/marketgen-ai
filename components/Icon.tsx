
import React from 'react';
// This component is a placeholder for a more robust icon system.
// For this app, specific icon components are imported from constants.tsx for simplicity.

interface IconProps {
  name: string; // Name of the icon
  className?: string;
  // Other props like size, color can be added
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  // In a real app, this would map `name` to an actual SVG or icon component
  // For now, it's a placeholder.
  return (
    <span className={`inline-block ${className}`} aria-label={`${name} icon`}>
      {/* Placeholder - In a real app, render SVG based on name */}
      {/* Example: {name === 'magic' && <MagicIconComponent />} */}
      {`[${name}]`}
    </span>
  );
};

export default Icon;
