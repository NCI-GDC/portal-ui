import React from 'react';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { Row } from '@ncigdc/uikit/Flex';


const CardWrapper = ({ data, title }) => {
  const Card = (Component) => {
    Card.displayName = `Enhanced ${Component.displayName}`;
    const className = `${title.replace(/ /g, '-')}-card`;
    return (
      <React.Fragment>
        <Row
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '0 10px 0 10px',
          }}
          >
          <h3>{title}</h3>
          <DownloadVisualizationButton
            data={data}
            key="download"
            noText
            onClick={(e) => {
              e.preventDefault();
            }}
            slug={`${title} chart`}
            style={{
              float: 'right',
              marginRight: 2,
            }}
            svg={() => wrapSvg({
              selector: `.${className} svg`,
              title,
            })}
            tooltipHTML="Download image or data"
            tsvData={data}
            />
        </Row>
        <div className={className}>
          <Component />
        </div>
      </React.Fragment>
    );
  };
  return Card;
};

export default CardWrapper;
