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

Meteor.subscribe('mistakes');

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const DashboardPage = () => {
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const mistakes = useTracker(() =>
    Mistakes.find(showAll ? {} : { nextReview: { $lte: new Date() } }, { sort: { nextReview: 1 } }).fetch()
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

  const onReview = async (id, correct) => {
    await Meteor.callAsync('mistakes.reviewed', id, correct);
  };

  const onDelete = async (id) => {
    if (window.confirm('Really delete this mistake?')) {
      const err = await Meteor.callAsync('mistakes.remove', id);

      if (err) alert(err.reason);
      scrollToTop();
    }
  };

  return (
    <div>
      <Input
        type="search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search Mistakes..."
        className="border rounded p-2 max-w-md block"
      />

      <div className="block mt-4">
        <Button className="bg-gray-500 text-white" onClick={() => setShowAll(x => !x)}>
          {showAll ? 'Show Due' : 'Show All'}
        </Button>
      </div>

      {filteredMistakes.length === 0 && <div className="italic text-gray-600 mt-4">
        No mistakes found.
      </div>}

      {filterTag && (
        <div className="text-xl font-semibold mt-8">
          Filtered by:
          &nbsp;
          <span className="font-bold">{findTag(filterTag)?.label || filterTag}</span>
          &nbsp;
          <span className="cursor-pointer" onClick={() => {
            setFilterTag('');
            scrollToTop();
          }}>❌</span>
        </div>
      )}

      <ul className="my-4 flex flex-wrap">
        {filteredMistakes.map(m => (
          <li className="border-2 border-gray-300 shadow-lg rounded-lg align-top m-4" key={m._id}>
            <FenChessboard fen={m.fen} orientation={m.orientation} />

            <div className="m-2">
              <div className="text-xl my-4 max-w-[250px]">{m.description}</div>

              <div className="text-md mb-4">Orientation: <span className="font-bold capitalize">{m.orientation}</span></div>

              {m.tags && m.tags.length > 0 && (
                <div className="text-sm mb-4 text-gray-500">
                  Tags:&nbsp;
                  {m.tags.map(tag =>
                    (CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label || tag)
                  ).map(tag => (<div
                    className="underline cursor-pointer"
                    key={tag}
                    onClick={() => {
                      setFilterTag(findTagByLabel(tag)?.value || tag);
                      scrollToTop();
                    }}>{tag}</div>))}
                </div>
              )}


              <div className="text-blue-800 font-bold">
                Next review: {m.nextReview.toLocaleDateString()}
              </div>

              <div className="mt-4">
                I got it:&nbsp;
                <Button className="text-white bg-green-700 mr-4" onClick={() => onReview(m._id, true)}>Correct ✅</Button>
                <Button className="text-red-700 border-red-700 border-2" onClick={() => onReview(m._id, false)}>Wrong ❌</Button>
              </div>

              <div className="mt-4">
                <Button className="text-white bg-red-700 mr-2" onClick={() => onDelete(m._id)}>Delete</Button>
                <Link to={`/edit/${m._id}`} className="text-white bg-blue-700 px-4 py-2 rounded-lg">Edit</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filteredMistakes.length > 0 && (
        <div>
          <Button className="italic text-gray-600 border border-gray-600 mb-4" onClick={() => exportCSV(filteredMistakes)}>
            Export as CSV
          </Button>
        </div>
      )}
    </div>
  );
};
