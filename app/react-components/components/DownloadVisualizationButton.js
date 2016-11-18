import React from 'react';
import DropDownButton from './DropDownButton';
import downloadSvg from '../utils/download-svg';
import saveFile from '../utils/filesaver';

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

const icon = <i className={"fa fa-download"}/>;

const DownloadVisualizationButton = ({
  svg,
  data,
  slug = 'export',
  stylePrefix,
  disabled,
  style,
  noText,
}) => (
  <DropDownButton
    disabled={disabled}
    icon={!noText && icon}
    label={noText ? <span>{icon}<div style={styles.hidden}>Download</div></span> : 'Download'}
    style={style}
    options={[
      ...(svg ? [
        {
          text: 'SVG',
          onClick: () => {
            downloadSvg({
              svg: getSelector(svg),
              stylePrefix: stylePrefix,
              fileName: `${slug}.svg`,
            });
          },
        },
        {
          text: 'PNG',
          onClick: () => {
            downloadSvg({
              svg: getSelector(svg),
              stylePrefix: stylePrefix,
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
            )
          },
        },
      ] : []),
    ]}
  />
);


export default DownloadVisualizationButton;