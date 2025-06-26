import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { Button } from '../base/Button';
import { FenChessboard } from '../FenChessboard';
import { CHESS_MISTAKE_TAGS } from '../../api/mistakeTags';

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
      <div>
        <h2 className="text-4xl font-bold">Mistakes Due for Review</h2>
        {dueMistakes.length > 0 && (<Button className="bg-violet-700 text-white mt-4" onClick={() => startPractice(dueMistakes)} disabled={dueMistakes.length === 0}>
          Practice ({dueMistakes.length})
        </Button>)}
        {dueMistakes.length === 0 && <p className="italic text-gray-600 mt-4">No mistakes due for review.</p>}

        <div className="mt-8">
            <h2 className="text-2xl font-bold">Overtrain</h2>
            <p className="italic text-gray-600 mt-2">Practice all your mistakes, even those not due for review.</p>
            <Button className="bg-blue-700 text-white mt-4" onClick={() => startPractice(allMistakes)} disabled={allMistakes.length === 0}>
              Overtrain ({allMistakes.length})
            </Button>
        </div>
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div>
        <p className="italic text-gray-600 mt-4">No mistakes to practice.</p>
        <Button onClick={() => setPracticing(false)}>Back</Button>
      </div>
    );
  }

  const mistake = mistakes[currentMistakeIndex];

  return (
    <div>
      <div className="flex">
        <FenChessboard fen={mistake.fen} orientation={mistake.orientation} isLarge={true} />

        <div class="grow">
          {!showMistake && (
            <div className="mt-4 ml-12">
              <span className="text-xl font-bold">I got it:&nbsp;</span>
              <div className="block mt-4">
<Button className="text-white bg-green-700 mr-4" onClick={() => onReview(mistake._id, true)}>Correct ✅</Button>
              <Button className="text-red-700 border-red-700 border-2" onClick={() => onReview(mistake._id, false)}>Wrong ❌</Button>
              </div>
            </div>
          )}

          {showMistake && (
            <div className="m-2 ml-12">
              <div className="text-2xl mb-4">{mistake.description}</div>

              <div className="text-md mb-4">Orientation: <span className="font-bold capitalize">{mistake.orientation}</span></div>

              {mistake.tags && mistake.tags.length > 0 && (
                <div className="text-sm mb-4 text-gray-500">
                  Tags:&nbsp;
                  {mistake.tags.map(tag =>
                    (CHESS_MISTAKE_TAGS.find(t => t.value === tag)?.label || tag)
                  ).map(tag => (<div
                    className="underline"
                    key={tag}>{tag}</div>))}
                </div>
              )}

              <div className="text-violet-900 font-bold">
                Next review: {mistake.nextReview.toLocaleDateString()}
              </div>

              <div className="mt-2">
                <Button className="bg-violet-700 text-white mt-4" onClick={onNext}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      

      
    </div>
  );
};
