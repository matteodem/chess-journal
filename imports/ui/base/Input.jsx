import React from 'react';

export const Input = ({ className, ...props }) => {
 return <input {...props} className={`${className}`} />
}
