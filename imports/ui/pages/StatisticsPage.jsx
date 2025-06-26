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
    <div>
      <h2 className="text-4xl font-bold mb-4">Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Total Mistakes</h3>
          <p className="text-3xl font-bold">{totalMistakes}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Reviewed Mistakes</h3>
          <p className="text-3xl font-bold">{reviewedMistakes}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Avg. Review Interval</h3>
          <p className="text-3xl font-bold">{isNaN(avgReviewInterval) ? 'N/A' : `${Math.round(avgReviewInterval / (1000 * 60 * 60 * 24))} days`}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Mistakes by Tag</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
