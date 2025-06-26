import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Input } from '../base/Input';
import { Button } from '../base/Button';
import { MistakeTagSelect } from '../mistake/MistakeTagSelect';
import { getObjectTagsForList } from '../../api/mistakeTags';
import { useNavigate, useParams } from 'react-router-dom';
import { Mistakes } from '../../api/mistakes';
import { FenChessboard } from '../FenChessboard';

export const EditMistakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const mistake = useTracker(() => Mistakes.findOne(id));

  const [fen, setFEN] = useState('');
  const [desc, setDesc] = useState('');
  const [orientation, setOrientation] = useState('white');
  const [tags, setTags] = useState([]);

  console.log(mistake.tags)

  useState(() => {
    if (mistake) {
      setFEN(mistake.fen);
      setDesc(mistake.description);
      setOrientation(mistake.orientation);
      setTags(mistake.tags || []);
    }
  }, [mistake]);

  const onSubmit = async () => {
    const err = await Meteor.callAsync(
      'mistakes.update',
      id,
      fen,
      desc,
      orientation,
      tags
    );

    if (!err) {
      navigate('/list');
    } else alert(err.reason);
  };

  if (!mistake) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 border-gray-300 p-3 mb-3 inline-block rounded-xl" 
        style={{maxWidth: '650px', width: '100%'}}>
      <h2 className="text-2xl font-bold mb-4">Edit Mistake</h2>
      <div className="block mb-4">
        <label>FEN 
          <Input className="mt-2" value={fen} onChange={e => setFEN(e.target.value)} placeholder="rnbqkbnr/..." />
        </label>
      </div>
      <div className="block mb-4">
        <FenChessboard fen={fen} orientation={orientation} />
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
              tags={getObjectTagsForList(tags)}
              onChange={(values) => setTags(values.map(val => val.value))} />
          </div>
        </label>
      </div>
      <div className="inline-block">
        <Button className="bg-purple-700 text-white" onClick={onSubmit}>
          Update Mistake
        </Button>
      </div>
    </div>
  );
};
