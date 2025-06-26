import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { CHESS_MISTAKE_TAGS } from '../../api/mistakeTags';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

Meteor.subscribe('mistakes.all');

export const StatisticsPage = () => {
  const mistakes = useTracker(() => Mistakes.find({}).fetch());

  const tagCounts = {};
  mistakes.forEach(mistake => {
    mistake.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const chartData = Object.keys(tagCounts).map(tag => ({
    name: CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label || tag,
    count: tagCounts[tag],
  }));

  const totalMistakes = mistakes.length;
  const reviewedMistakes = mistakes.filter(m => m.lastReview).length;
  const avgReviewInterval = mistakes.reduce((sum, m) => sum + (m.nextReview - m.createdAt), 0) / mistakes.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Statistics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-lg font-medium text-gray-600">Total Mistakes</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{totalMistakes}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-lg font-medium text-gray-600">Reviewed Mistakes</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{reviewedMistakes}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center">
          <h3 className="text-lg font-medium text-gray-600">Avg. Review Interval</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{isNaN(avgReviewInterval) ? 'N/A' : `${Math.round(avgReviewInterval / (1000 * 60 * 60 * 24))} days`}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Mistakes by Tag</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }} />
            <Legend />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
