import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { AccountsUIWrapper } from './AccountsUIWrapper';
import { FenChessboard } from './FenChessboard';

Meteor.subscribe('mistakes');

export const App = () => {
  const [fen, setFEN] = useState('');
  const [desc, setDesc] = useState('');
  const [showAll, setShowAll] = useState(false);

  const currentUser = useTracker(() => Meteor.user(), []);

  const mistakes = useTracker(() => 
    Mistakes.find(showAll ? {} : { nextReview: { $lte: new Date() } }, { sort: { nextReview: 1 } }).fetch()
  );

  const onAdd = async () => {
    Meteor.call('mistakes.insert', fen, desc, (err) => {
      if (!err) { setFEN(''); setDesc(''); }
      else alert(err.message);
    });
  };

  const onReview = async  (id, correct) => {
    Meteor.call('mistakes.reviewed', id, correct);
  };

  return (
    <div>
      <AccountsUIWrapper />  
      <h2>Mistake Journal</h2>

      {!currentUser && <div>
        Please login to start using the journal.
      </div>}

      {currentUser && <div>
        <input value={fen} onChange={e => setFEN(e.target.value)} placeholder="FEN" />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <button onClick={onAdd}>Add Mistake</button>
        <button onClick={() => setShowAll(x => !x)}>
          {showAll ? 'Show Due' : 'Show All'}
        </button>
        <ul>
          {mistakes.map(m => (
            <li key={m._id}>
              <FenChessboard fen={m.fen} />
              <br />
              <br />
              {m.description}
              <br />
              Next review: {m.nextReview.toLocaleDateString()}
              <br />
              <button onClick={() => onReview(m._id, true)}>Correct</button>
              <button onClick={() => onReview(m._id, false)}>Wrong</button>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};
