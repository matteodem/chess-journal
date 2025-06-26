import React from 'react';

export const Button = ({ children, className, ...props }) => {
 return <button 
    {...props} 
    className={`transition-colors duration-200 ${className}`}>
  {children}
 </button>
}
