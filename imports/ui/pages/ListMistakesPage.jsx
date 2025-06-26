import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { Button } from '../base/Button';
import { FenChessboard } from '../FenChessboard';
import { CHESS_MISTAKE_TAGS, findTag, findTagByLabel } from '../../api/mistakeTags';
import { exportCSV } from '../util/exportCSV';
import { Link } from 'react-router-dom';
import { Input } from '../base/Input';

Meteor.subscribe('mistakes.all');

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const ListMistakesPage = () => {
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const mistakes = useTracker(() =>
    Mistakes.find({}, { sort: { nextReview: 1 } }).fetch()
  );

  const filteredMistakes = mistakes.filter(m => {
    if (filterTag && (!m.tags || !m.tags.includes(filterTag))) return false;

    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      m.description.toLowerCase().includes(lower) ||
      m.fen.toLowerCase().includes(lower) ||
      (m.tags &&
        m.tags.some(
          tag =>
            tag.toLowerCase().includes(lower) ||
            (CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label?.toLowerCase().includes(lower))
        ))
    );
  });

  const onDelete = async (id) => {
    if (window.confirm('Really delete this mistake?')) {
      const err = await Meteor.callAsync('mistakes.remove', id);

      if (err) alert(err.reason);
      scrollToTop();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <Input
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search Mistakes..."
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0"
        />
        {filteredMistakes.length > 0 && (
          <Button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200" onClick={() => exportCSV(filteredMistakes)}>
            Export as CSV
          </Button>
        )}
      </div>

      {filteredMistakes.length === 0 && <div className="italic text-gray-600 mt-4">
        No mistakes found.
      </div>}

      {filterTag && (
        <div className="text-lg font-medium text-gray-700 mb-4">
          Filtered by:
          <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full ml-2">
            {findTag(filterTag)?.label || filterTag}
            <span className="ml-1 cursor-pointer text-indigo-800 hover:text-indigo-900" onClick={() => {
              setFilterTag('');
              scrollToTop();
            }}>x</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMistakes.map(m => (
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col" key={m._id}>
            <FenChessboard fen={m.fen} orientation={m.orientation} />

            <div className="mt-4 flex-grow">
              <div className="text-lg font-semibold text-gray-800 mb-2">{m.description}</div>

              <div className="text-sm text-gray-600 mb-2">Orientation: <span className="font-medium capitalize">{m.orientation}</span></div>

              {m.tags && m.tags.length > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  Tags:
                  <div className="flex flex-wrap mt-1">
                    {m.tags.map(tag =>
                      (CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label || tag)
                    ).map(tag => (
                      <span
                        className="bg-gray-200 text-gray-700 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                        key={tag}
                        onClick={() => {
                          setFilterTag(findTagByLabel(tag)?.value || tag);
                          scrollToTop();
                        }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-indigo-700 font-semibold text-sm">
                Next review: {m.nextReview.toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm" onClick={() => onDelete(m._id)}>Delete</Button>
              <Link to={`/edit/${m._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center justify-center">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
