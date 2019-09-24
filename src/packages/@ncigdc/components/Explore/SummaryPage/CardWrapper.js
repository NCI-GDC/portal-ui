import React from 'react';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { Row } from '@ncigdc/uikit/Flex';
import { maxBy } from 'lodash';

const CardWrapper = ({
  Component,
  data,
  subProps,
  title,
}) => {
  const className = `${title.replace(/ /g, '-')}-card`;
  const maxKeyNameLength = (
    maxBy(data
      .map(d => d[subProps.mappingLabel] || ''), (item) => item.length) || ''
  ).length;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
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
            bottomBuffer: maxKeyNameLength * 3,
            rightBuffer: maxKeyNameLength * 2,
            selector: `.${className} svg`,
            title,
          })}
          tooltipHTML="Download image or data"
          tsvData={data}
          />
      </Row>
      <div 
        className={className}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
        >
        <Component
          bottomMarginForxAxisTitle={maxKeyNameLength * 2}
          data={data}
          {...subProps}
          />
      </div>
    </div>
  );
};

export default CardWrapper;
