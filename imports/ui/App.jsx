import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { AccountsUIWrapper } from './AccountsUIWrapper';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { AddMistakePage } from './pages/AddMistakePage';
import { EditMistakePage } from './pages/EditMistakePage';
import { ListMistakesPage } from './pages/ListMistakesPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { Navbar } from './Navbar';

export const App = () => {
  const currentUser = useTracker(() => Meteor.user(), []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {currentUser && <Navbar />}
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-4"><AccountsUIWrapper /></div>

          {!currentUser && <div className="text-lg text-center mt-8">
            Please login or create an account to start using the journal.
          </div>}

          {currentUser && (
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add" element={<AddMistakePage />} />
              <Route path="/edit/:id" element={<EditMistakePage />} />
              <Route path="/list" element={<ListMistakesPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

