import React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0,
};

// const imagesLoadedOptions = { background: '.my-bg-image-el' };

const Summary = ({ elements }: any) => (
  <Masonry
    className="my-gallery-class" // default ''
    disableImagesLoaded={false} // default false
    elementType="ul" // default 'div'
    // imagesLoadedOptions={imagesLoadedOptions} // default {}
    options={masonryOptions} // default {}
    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
  >
    {elements.map((element: any) => {
      return (
        <li
          className="image-element-class"
          key={element}
          style={{ width: '20%', height: '300px' }}
        >
          <div>
            yes
          </div>
        </li>
      );
    })}
  </Masonry>
);

export default Summary;
