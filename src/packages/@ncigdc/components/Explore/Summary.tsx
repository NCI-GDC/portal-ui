import React from 'react';
import Masonry from 'react-masonry-component';

const Summary = ({ elements }: any) => (
  <Masonry
    className="my-gallery-class"
    disableImagesLoaded={false}
    elementType="ul"
    style={{
      listStyleType: 'none',
      paddingLeft: 0,
    }}
    updateOnEachImageLoad={false}
    >
    {elements.map((element: any) => {
      return (
        <li
          key={element}
          style={{
            backgroundColor: element % 2 === 1 ? 'rgb(200,200,200)' : 'rgb(225,225,225)',
            border: '3px solid white',
            borderRadius: '5px',
            borderStyle: 'outset',
            height: '450px',
            margin: 'auto',
            minWidth: `${element * 300}px`,
            width: `${element * 33.3}%`,
          }}
          />
      );
    })}
  </Masonry>
);

export default Summary;
