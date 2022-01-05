import React from "react";
import Select from 'react-select'

const MySelect = () => {
  return (
    <Select options={[
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]} />
  );
};

export default MySelect;
