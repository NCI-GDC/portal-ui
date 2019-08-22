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
  totalWidth?: number;
}


const MasonryLayout = ({
  customizeStyle = {
    borderStyle: 'solid', // Replace it with your own style
    borderWidth: '1px',
  },
  elements,
  gutter = 0.7, // percentage
  minWidth = 354, // px
  numPerRow = 3,
  totalWidth = 100, // percentage
}: IMasonryLayoutProps) => {
  const width = (totalWidth - numPerRow * gutter) / numPerRow;
  return (
    <ul
      className="masonry"
      >
      {elements.map((element: IElementProps, i: number) => {
        return (
          <li
            className="masonry-brick"
            key={`element${i}`}
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
