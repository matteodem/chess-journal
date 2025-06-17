import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mistakes } from '/imports/api/mistakes';
import { Input } from './base/Input';
import { Button } from './base/Button';
import { AccountsUIWrapper } from './AccountsUIWrapper';
import { FenChessboard } from './FenChessboard';
import { MistakeTagSelect } from './mistake/MistakeTagSelect';
import { CHESS_MISTAKE_TAGS, findTag, findTagByLabel, getObjectTagsForList } from '../api/mistakeTags';

Meteor.subscribe('mistakes');

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const App = () => {
  const [fen, setFEN] = useState('');
  const [desc, setDesc] = useState('');
  const [orientation, setOrientation] = useState('white');
  const [tags, setTags] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  // For editing 
  const [editingId, setEditingId] = useState(null); // null = create, otherwise = Mistake _id

  // To reload mistake tag select
  const [mistakeTagSeed, setMistakeTagSeed] = useState(1);

  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState()

  const currentUser = useTracker(() => Meteor.user(), []);

  const mistakes = useTracker(() => 
    Mistakes.find(showAll ? {} : { nextReview: { $lte: new Date() } }, { sort: { nextReview: 1 } }).fetch()
  );

  const filteredMistakes = !filterTag
  ? mistakes
  : mistakes.filter(m => m.tags && m.tags.includes(filterTag));

  const onSubmit = () => {
    if (editingId) {
      Meteor.call(
        'mistakes.update',
        editingId,
        fen,
        desc,
        orientation,
        tags,
        (err) => {
          if (!err) {
            setEditingId(null);
            setFEN('');
            setDesc('');
            setOrientation('white');
            setTags([]);
            setMistakeTagSeed(Math.random());
            setFormOpen(false);
          } else alert(err.reason);
        }
      );
    } else {
      Meteor.call(
        'mistakes.insert',
        fen,
        desc,
        orientation,
        tags,
        (err) => {
          if (!err) {
            setFEN(''); 
            setDesc(''); 
            setOrientation('white'); 
            setTags([]); 
            setMistakeTagSeed(Math.random());
            setFormOpen(false);
          } else alert(err.reason);
        }
      );
    }
  };

  const onEdit = (mistake) => {
    setEditingId(mistake._id);
    setFEN(mistake.fen);
    setDesc(mistake.description);
    setOrientation(mistake.orientation);
    setTags(mistake.tags || []);
    setFormOpen(true);
    scrollToTop();
  };

  const onReview = async  (id, correct) => {
    Meteor.call('mistakes.reviewed', id, correct);
  };

  const onDelete = (id) => {
    if (window.confirm('Really delete this mistake?')) {
      Meteor.call('mistakes.remove', id, (err) => {
        if (err) alert(err.reason);
        scrollToTop();
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
          onClick={() => setFormOpen(!formOpen)}>{editingId ? 'Update' : 'Add'} Mistake
          {formOpen && <span> ⬆️</span>}
          {!formOpen && <span> ⬇️</span>}
          </h2>

        {formOpen && <div className="border-2 border-gray-300 p-3 mb-3 inline-block rounded-xl" 
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
          <div className="block mb-4">
            <label>
              <div className="block">
                Orientation
              </div> 
              <select className="border rounded-lg px-2 py-1" value={orientation} onChange={e => setOrientation(e.target.value)}>
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label>
              Tags

              <div className="block mt-2">
                <MistakeTagSelect 
                  key={mistakeTagSeed} 
                  tags={getObjectTagsForList(tags)}
                  onChange={(values) => setTags(values.map(val => val.value))} />
              </div>
            </label>
          </div>
          <div className="inline-block">
            <Button className="bg-purple-700 text-white" onClick={onSubmit}>
              {editingId ? 'Update' : 'Add'} Mistake
            </Button>

            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFEN('');
                  setDesc('');
                  setOrientation('white');
                  setTags([]);
                  setMistakeTagSeed(Math.random());
                }}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </Button>
            )}
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
        </div>)}

        <ul className="my-4 flex flex-wrap">
          {filteredMistakes.map(m => (
            <li className="border rounded-lg align-top m-4" key={m._id}>
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
                  <Button className="text-white bg-blue-700" onClick={() => onEdit(m)}>Edit</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};
