// @flow

import React from 'react';
import downloadSvg from 'download-svg';
import { compose } from 'recompose';

import saveFile from '@ncigdc/utils/filesaver';
import toTsvString, { mapArrayToTsvString } from '@ncigdc/utils/toTsvString';
import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';

import { withTheme } from '@ncigdc/theme';

import Download from '@ncigdc/theme/icons/Download';
import Hidden from '@ncigdc/components/Hidden';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import supportsSvgToPng from '@ncigdc/utils/supportsSvgToPng';

function getSelector(el?: string | Element): ?Element {
  switch (typeof el) {
    case 'string':
      return document.querySelector(el);
    case 'function':
      return el();
    default:
      return el;
  }
}

const styles = {
  row: theme => ({
    padding: '0.6rem 1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
};

type TProps = {
  svg?: any,
  data: Object,
  slug: string,
  stylePrefix?: string,
  style?: Object,
  noText?: boolean,
  tsvData?: Array<Object>,
  theme: Object,
  tooltipHTML: any,
};

const enhance = compose(withTheme);

const DownloadVisualizationButton = ({
  svg,
  data,
  slug = 'export',
  stylePrefix,
  noText,
  tsvData,
  theme,
  tooltipHTML,
  ...props
}: TProps) =>
  <DropDown
    button={
      <Tooltip Component={tooltipHTML}>
        <Button leftIcon={!noText && <Download />} style={visualizingButton}>
          {noText
            ? <span><Download /><Hidden>Download</Hidden></span>
            : 'Download'}
        </Button>
      </Tooltip>
    }
    {...props}
  >
    {svg &&
      <DropdownItem
        key="svg"
        style={styles.row(theme)}
        onClick={() => {
          downloadSvg({
            svg: getSelector(svg),
            stylePrefix,
            fileName: `${slug}.svg`,
          });
        }}
      >
        SVG
      </DropdownItem>}
    {svg &&
      <DropdownItem
        key="png"
        style={{
          ...styles.row(theme),
          ...(supportsSvgToPng()
            ? {}
            : {
                opacity: 0.5,
              }),
        }}
        onClick={() => {
          if (!supportsSvgToPng()) return;
          downloadSvg({
            svg: getSelector(svg),
            stylePrefix,
            fileName: `${slug}.png`,
            scale: 2,
          });
        }}
      >
        {supportsSvgToPng()
          ? 'PNG'
          : <Tooltip
              Component={`
                  Download as PNG is currently unavaialable in your browser.
                  Please use the latest version of Chrome or Firefox
                `}
            >
              PNG
            </Tooltip>}
      </DropdownItem>}
    {data &&
      <DropdownItem
        key="JSON"
        style={styles.row(theme)}
        onClick={() => {
          saveFile(JSON.stringify(data, null, 2), 'JSON', `${slug}.json`);
        }}
      >
        JSON
      </DropdownItem>}
    {tsvData &&
      <DropdownItem
        key="TSV"
        style={styles.row(theme)}
        onClick={() => {
          if (tsvData) {
            saveFile(
              tsvData[0] && tsvData[0].forEach
                ? mapArrayToTsvString(tsvData)
                : toTsvString(tsvData),
              'TSV',
              `${slug}.tsv`,
            );
          }
        }}
      >
        TSV
      </DropdownItem>}
  </DropDown>;

export default enhance(DownloadVisualizationButton);
