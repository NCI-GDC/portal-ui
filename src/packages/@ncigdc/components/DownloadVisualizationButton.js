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
import { track } from '@ncigdc/utils/analytics';

function getDOMNode(el?: string | Element): ?Element {
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
  disabled: boolean,
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
  disabled,
  ...props
}: TProps) => (
  <DropDown
    className={props.className || 'test-download-viz-button'}
    isDisabled={disabled}
    button={
      <Tooltip Component={tooltipHTML}>
        <Button
          disabled={disabled}
          leftIcon={!noText && <Download />}
          style={visualizingButton}
          type="button"
        >
          {noText ? (
            <span>
              <Download />
              <Hidden>Download</Hidden>
            </span>
          ) : (
            'Download'
          )}
        </Button>
      </Tooltip>
    }
    {...props}
  >
    {svg && (
      <DropdownItem
        key="svg"
        className="test-download-svg"
        style={styles.row(theme)}
        onClick={() => {
          downloadSvg({
            svg: getDOMNode(svg),
            stylePrefix,
            fileName: `${slug}.svg`,
          });
          track('download-viz', { type: 'svg' });
        }}
      >
        SVG
      </DropdownItem>
    )}
    {svg && (
      <DropdownItem
        key="png"
        className="test-download-png"
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
            svg: getDOMNode(svg),
            stylePrefix,
            fileName: `${slug}.png`,
            scale: 2,
          });
          track('download-viz', { type: 'png' });
        }}
      >
        {supportsSvgToPng() ? (
          'PNG'
        ) : (
          <Tooltip
            Component={`
                  Download as PNG is currently unavaialable in your browser.
                  Please use the latest version of Chrome or Firefox
                `}
          >
            PNG
          </Tooltip>
        )}
      </DropdownItem>
    )}
    {data && (
      <DropdownItem
        key="JSON"
        style={styles.row(theme)}
        onClick={() => {
          saveFile(JSON.stringify(data, null, 2), 'JSON', `${slug}.json`);
          track('download-viz', { type: 'json' });
        }}
      >
        JSON
      </DropdownItem>
    )}
    {tsvData && (
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
            track('download-viz', { type: 'tsv' });
          }
        }}
      >
        TSV
      </DropdownItem>
    )}
  </DropDown>
);

export default enhance(DownloadVisualizationButton);
