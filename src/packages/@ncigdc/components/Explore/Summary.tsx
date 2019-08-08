import React from 'react';

interface ISummaryProps {
  elements: any;
  showFacets: boolean;
}


const Summary = ({ elements, showFacets }: ISummaryProps) => {
  return (
    <ul
      className="masonry"
      >
      {elements.map((element: any, i: number) => {
        return (
          <li
            className="masonry-brick"
            key={`${i}element`}
            style={{
              backgroundColor: i % 2 === 1 ? 'rgb(210,210,210)' : 'rgb(225,225,225)', // for demonstration only
              flex: `${element} ${0} ${element * 354}px`,
              minWidth: `${element * (showFacets ? 32.63 : 24.3) + (element - 1) * 0.7}%`,
            }}
            />
        );
      })}
    </ul>
  );
};

export default Summary;
