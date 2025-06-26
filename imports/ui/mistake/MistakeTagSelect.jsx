import React from 'react';
import Creatable from 'react-select/creatable';
import { CHESS_MISTAKE_TAGS } from '/imports/api/mistakeTags';

export const MistakeTagSelect = ({ tags, ...props }) => {
  console.log({ tags})

  return <Creatable 
    options={CHESS_MISTAKE_TAGS} 
    defaultValue={tags}
    isMulti={true} 
    isClearable={true}
    classNamePrefix="mistake-tag-select"
    {...props}
  />
};
