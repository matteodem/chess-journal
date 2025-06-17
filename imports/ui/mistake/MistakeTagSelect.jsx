import React from 'react';
import Creatable from 'react-select/creatable';
import { CHESS_MISTAKE_TAGS } from '/imports/api/mistakeTags';

export const MistakeTagSelect = ({ ...props }) => {
  return <Creatable 
    options={CHESS_MISTAKE_TAGS} 
    isMulti={true} 
    isClearable={true}
    {...props}
  />
};
