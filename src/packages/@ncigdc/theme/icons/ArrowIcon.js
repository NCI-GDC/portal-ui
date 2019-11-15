import React from 'react';
import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';

const ArrowIcon = ({ sorted }) => (sorted === 'asc' ? <ArrowDownIcon /> : <ArrowUpIcon />);

export default ArrowIcon;
