import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { Input } from './base/Input';
import { Button } from './base/Button';
import { AccountsUIWrapper } from './AccountsUIWrapper';
import { FenChessboard } from './FenChessboard';

Meteor.subscribe('mistakes');

export const App = () => {
  const [fen, setFEN] = useState('');
  const [desc, setDesc] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState()

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

  const onDelete = (id) => {
    if (window.confirm('Really delete this mistake?')) {
      Meteor.call('mistakes.remove', id, (err) => {
        if (err) alert(err.reason);
      });
    }
  };

  return (
    <div className="mx-4">
      <div className="my-4"><AccountsUIWrapper /></div>
      <h1 className="text-5xl font-bold mb-8">Chess Journal</h1>

      {!currentUser && <div>
        Please login or create an account to start using the journal.
      </div>}

      {currentUser && <div>
        <h2 className="text-xl font-bold mb-3 cursor-pointer" 
          onClick={() => setFormOpen(!formOpen)}>Add mistake
          {formOpen && <span> ⬆️</span>}
          {!formOpen && <span> ⬇️</span>}
          </h2>

        {formOpen && <div class="border-2 border-gray-300 p-3 mb-3 inline-block rounded-xl" 
            style={{maxWidth: '650px', width: '100%'}}>
          <div className="block mb-4">
            <label>FEN 
              <Input className="mt-2" value={fen} onChange={e => setFEN(e.target.value)} placeholder="rnbqkbnr/..." />
            </label>
          </div>
          <div className="block mb-4">
            <label>Description 
              <Input className="mt-2" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What has been the mistake?" />
            </label>
          </div>
          <div className="inline-block">
            <Button className="bg-purple-700 text-white" onClick={onAdd}>Add Mistake</Button>
          </div>
        </div>}
        
        <div className="block mt-4">
          <Button className="bg-gray-500 text-white" onClick={() => setShowAll(x => !x)}>
            {showAll ? 'Show Due' : 'Show All'}
          </Button>
        </div>

        {mistakes.length === 0 && <div className="italic text-gray-600 mt-4">
          No mistakes found.  
        </div>}

        <ul class="my-4">
          {mistakes.map(m => (
            <li class="border rounded-lg inline-block align-top m-4" key={m._id}>
              <FenChessboard fen={m.fen} />
              
              <div className="m-2">
                <div className="text-xl my-4">{m.description}</div>
                
                <div className="text-blue-800">
                  Next review: {m.nextReview.toLocaleDateString()}
                </div>

                <div className="mt-4">
                  I got it:&nbsp;
                  <Button className="text-white bg-green-700 mr-4" onClick={() => onReview(m._id, true)}>Correct ✅</Button>
                  <Button className="text-red-700 border-red-700 border-2" onClick={() => onReview(m._id, false)}>Wrong ❌</Button>
                </div>

                <div className="mt-4">
                  <Button className="text-white bg-red-700" onClick={() => onDelete(m._id)}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};
