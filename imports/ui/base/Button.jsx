import React from 'react';

export const Button = ({ children, className, ...props }) => {
 return <button 
    {...props} 
    className={`py-1 px-4 rounded-lg cursor-pointer ${className}`}>
  {children}
 </button>
}
