import React from 'react';
import Creatable from 'react-select/creatable';
import { CHESS_MISTAKE_TAGS } from '/imports/api/mistakeTags';

export const MistakeTagSelect = ({ tags, ...props }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#ffffff',
      borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
      '&:hover': {
        borderColor: '#6366f1',
      },
      borderRadius: '0.375rem', // rounded-md
      minHeight: '38px', // default height
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff', // indigo-100
      borderRadius: '0.375rem', // rounded-md
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#4338ca', // indigo-800
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#4338ca', // indigo-800
      '&:hover': {
        backgroundColor: '#c7d2fe', // indigo-200
        color: '#3730a3', // indigo-900
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#e0e7ff' : null,
      color: state.isSelected ? 'white' : '#374151',
      '&:active': {
        backgroundColor: '#6366f1',
      },
    }),
  };

  console.log({ tags })

  return <Creatable 
    options={CHESS_MISTAKE_TAGS} 
    value={tags}
    isMulti={true} 
    isClearable={true}
    classNamePrefix="mistake-tag-select"
    styles={customStyles}
    {...props}
  />
};
