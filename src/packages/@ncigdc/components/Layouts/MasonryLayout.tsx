import React from 'react';


interface IElementProps {
  component: string | JSX.Element;
  size: number;
}

interface IMasonryLayoutProps {
  elements: IElementProps[];
  numPerRow: number;
  minWidth?: number;
  gutter?: number;
  customizeStyle?: React.CSSProperties;
}


const MasonryLayout = ({
  customizeStyle = {
    borderStyle: 'solid', // Replace it with your own style
    borderWidth: '1px',
  },
  elements,
  gutter = 0.7,
  minWidth = 354,
  numPerRow = 3,
}: IMasonryLayoutProps) => {
  const width = (100 - numPerRow * gutter) / numPerRow;
  return (
    <ul
      className="masonry"
      >
      {elements.map((element: IElementProps, i: number) => {
        return (
          <li
            className="masonry-brick"
            key={`${i}element`}
            style={{

              flex: `${element.size} ${0} ${element.size * minWidth}px`,
              minWidth: `${element.size * width + (element.size - 1) * gutter}%`,
              ...customizeStyle,
            }}
            >
            {element.component}
          </li>
        );
      })}
    </ul>
  );
};

export default MasonryLayout;
