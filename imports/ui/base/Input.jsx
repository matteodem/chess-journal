import React from 'react';

export const Input = ({ className, ...props }) => {
 return <input {...props} className={`border py-1 px-4 rounded-lg w-full placeholder:text-gray-400 ${className}`} />
}
