import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { AccountsUIWrapper } from './AccountsUIWrapper';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { AddMistakePage } from './pages/AddMistakePage';
import { EditMistakePage } from './pages/EditMistakePage';
import { Navbar } from './Navbar';

export const App = () => {
  const currentUser = useTracker(() => Meteor.user(), []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 relative top-0 left-0">
        {currentUser && <Navbar />}
        <div className="py-4 pl-4"><AccountsUIWrapper /></div>
        <h1 className="text-5xl font-bold mb-8 ml-4">
          <Link to="/">Chess Journal</Link>
        </h1>

        {!currentUser && <div className="text-lg ml-4">
          Please login or create an account to start using the journal.
        </div>}

        {currentUser && <div className="ml-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add" element={<AddMistakePage />} />
            <Route path="/edit/:id" element={<EditMistakePage />} />
          </Routes>
        </div>}
      </div>
    </Router>
  );
};
