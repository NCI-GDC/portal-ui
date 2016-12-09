// @flow

import React from 'react';
import downloadSvg from 'download-svg';

import DropDownButton from './DropDownButton';
import saveFile from '../utils/filesaver';
import toTsvString, { mapArrayToTsvString } from '../utils/toTsvString';
import Download from '../theme/icons/Download';

function getSelector(el) {
  return typeof el === 'string' ? document.querySelector(el) : el;
}
const styles = {
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
};

const DownloadVisualizationButton = ({
  svg,
  data,
  slug = 'export',
  stylePrefix,
  disabled,
  style,
  noText,
  tsvData,
  ...props
}) => (
  <DropDownButton
    icon={!noText && <Download />}
    label={noText ? <span><Download /><div style={styles.hidden}>Download</div></span> : 'Download'}
    style={style}
    options={[
      ...(svg ? [
        {
          text: 'SVG',
          onClick: () => {
            downloadSvg({
              svg: getSelector(svg),
              stylePrefix,
              fileName: `${slug}.svg`,
            });
          },
        },
        {
          text: 'PNG',
          onClick: () => {
            downloadSvg({
              svg: getSelector(svg),
              stylePrefix,
              fileName: `${slug}.png`,
              scale: 2,
              useCanvg: true,
            });
          },
        },
      ] : []),
      ...(data ? [
        {
          text: 'JSON',
          onClick: () => {
            saveFile(
              JSON.stringify(data, null, 2),
              'JSON',
              `${slug}.json`
            );
          },
        },
      ] : []),
      ...(tsvData ? [
        {
          text: 'TSV',
          onClick: () => {
            saveFile(
              tsvData.forEach ? mapArrayToTsvString(tsvData) : toTsvString(tsvData),
              'TSV',
              `${slug}.tsv`
            );
          },
        },
      ] : []),
    ]}
    {...props}
  />
);


export default DownloadVisualizationButton;
