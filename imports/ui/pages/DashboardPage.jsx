import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { Button } from '../base/Button';
import { FenChessboard } from '../FenChessboard';
import { CHESS_MISTAKE_TAGS } from '../../api/mistakeTags';
import { FaCheck, FaTimes } from 'react-icons/fa';

Meteor.subscribe('mistakes.all');

export const DashboardPage = () => {
  const [mistakes, setMistakes] = useState([]);
  const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);
  const [showMistake, setShowMistake] = useState(false);
  const [practicing, setPracticing] = useState(false);

  const dueMistakes = useTracker(() =>
    Mistakes.find({ nextReview: { $lte: new Date() } }, { sort: { nextReview: 1 } }).fetch()
  );

  const allMistakes = useTracker(() =>
    Mistakes.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  const startPractice = (mistakesToPractice) => {
    setMistakes(mistakesToPractice);
    setCurrentMistakeIndex(0);
    setShowMistake(false);
    setPracticing(true);
  };

  const onReview = async (id, correct) => {
    await Meteor.callAsync('mistakes.reviewed', id, correct);
    setShowMistake(true);
  };

  const onNext = () => {
    if (currentMistakeIndex < mistakes.length - 1) {
      setCurrentMistakeIndex(currentMistakeIndex + 1);
      setShowMistake(false);
    } else {
      setPracticing(false);
    }
  };

  if (!practicing) {
    return (
      <div className="bg-white  p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mistakes Due for Review</h2>
        {dueMistakes.length > 0 && (
          <Button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200" onClick={() => startPractice(dueMistakes)} disabled={dueMistakes.length === 0}>
            Practice ({dueMistakes.length})
          </Button>
        )}
        {dueMistakes.length === 0 && <p className="italic text-gray-600  mt-4">No mistakes due for review.</p>}

        {(dueMistakes.length === 0 && allMistakes.length > 0) && (
          <div className="mt-8 pt-6 border-t border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Overtrain</h2>
            <p className="italic text-gray-600  mb-4">Practice all your mistakes, even those not due for review.</p>
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200" onClick={() => startPractice(allMistakes)} disabled={allMistakes.length === 0}>
              Overtrain ({allMistakes.length})
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div className="bg-white  p-6 rounded-lg shadow-md">
        <p className="italic text-gray-600  mb-4">No mistakes to practice.</p>
        <Button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 :bg-gray-600 transition-colors duration-200" onClick={() => setPracticing(false)}>Back</Button>
      </div>
    );
  }

  const mistake = mistakes[currentMistakeIndex];

  return (
    <div className="bg-white  p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <FenChessboard fen={mistake.fen} orientation={mistake.orientation} isLarge={true} />

        <div className="flex-grow mt-6 md:mt-0 md:ml-12 w-full">
          {!showMistake && (
            <div className="text-center md:text-left">
              <span className="text-xl font-semibold text-gray-800 ">I know the answer</span>
              <div className="mt-4 space-x-4">
                <Button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-lg" onClick={() => onReview(mistake._id, true)}><FaCheck className="inline-block mr-2" />Correct</Button>
                <Button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-lg" onClick={() => onReview(mistake._id, false)}><FaTimes className="inline-block mr-2" />Wrong</Button>
              </div>
            </div>
          )}

          {showMistake && (
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-gray-800 mb-4">{mistake.description}</div>

              <div className="text-md text-gray-700 mb-2">Orientation: <span className="font-semibold capitalize">{mistake.orientation}</span></div>

              {mistake.tags && mistake.tags.length > 0 && (
                <div className="text-sm text-gray-500 mb-4">
                  Tags:&nbsp;
                  <div className="flex flex-wrap justify-center md:justify-start mt-1">
                    {mistake.tags.map(tag =>
                      (CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label || tag)
                    ).map(tag => (
                      <span
                        className="bg-gray-200 text-gray-700 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full"
                        key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-indigo-700 font-semibold mb-4">
                Next review: {mistake.nextReview.toLocaleDateString()}
              </div>

              <div className="mt-4">
                <Button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-lg" onClick={onNext}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

