import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 text-base font-medium transition-colors duration-200">Dashboard</Link>
          <Link to="/add" className="text-gray-700 hover:text-indigo-600 text-base font-medium transition-colors duration-200">Add Mistake</Link>
          <Link to="/list" className="text-gray-700 hover:text-indigo-600 text-base font-medium transition-colors duration-200">Mistakes List</Link>
          <Link to="/statistics" className="text-gray-700 hover:text-indigo-600 text-base font-medium transition-colors duration-200">Statistics</Link>
          <a href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-indigo-600 text-base font-medium transition-colors duration-200">Donate</a>
        </div>
      </div>
    </nav>
  );
};
