import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input } from '../base/Input';
import { Button } from '../base/Button';
import { MistakeTagSelect } from '../mistake/MistakeTagSelect';
import { getObjectTagsForList } from '../../api/mistakeTags';
import { useNavigate } from 'react-router-dom';
import { FenChessboard } from '../FenChessboard';

export const AddMistakePage = () => {
  const [fen, setFEN] = useState('');
  const [desc, setDesc] = useState('');
  const [orientation, setOrientation] = useState('white');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const onSubmit = async () => {
    const err = await Meteor.callAsync(
      'mistakes.insert',
      fen,
      desc,
      orientation,
      tags
    );

    if (!err) {
      navigate('/');
    } else alert(err.reason);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Mistake</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fen">
          FEN
        </label>
        <Input
          id="fen"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={fen}
          onChange={e => setFEN(e.target.value)}
          placeholder="rnbqkbnr/..."
        />
      </div>
      <div className="mb-4">
        <FenChessboard fen={fen} orientation={orientation} />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <Input
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What has been the mistake?"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orientation">
          Orientation
        </label>
        <select
          id="orientation"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={orientation}
          onChange={e => setOrientation(e.target.value)}
        >
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tags
        </label>
        <MistakeTagSelect
          tags={getObjectTagsForList(tags)}
          onChange={(values) => setTags(values.map(val => val.value))}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onSubmit}
        >
          Add Mistake
        </Button>
      </div>
    </div>
  );
};
