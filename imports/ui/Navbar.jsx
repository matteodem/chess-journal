import React from 'react';

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-80">Dashboard</a>
          <a href="/add" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-80">Add Mistake</a>
          <a href="/list" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-80">Mistakes List</a>
          <a href="/statistics" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-80">Statistics</a>
          <a href="https://ko-fi.com/itsmatteodemicheli" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-80">Donate</a>
        </div>
      </div>
    </nav>
  );
};
