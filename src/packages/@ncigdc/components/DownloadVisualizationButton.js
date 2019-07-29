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
  slug: string | string[],
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
  buttonStyle,
  data,
  disabled,
  noText,
  slug = 'export',
  stylePrefix,
  svg,
  theme,
  tooltipHTML,
  tsvData,
  ...props
}: TProps) => {
  const isSlugArray = slug instanceof Array;
  return (
    <DropDown
      button={(
        <Tooltip Component={tooltipHTML}>
          <Button
            disabled={disabled}
            leftIcon={!noText && <Download />}
            style={{
              ...visualizingButton,
              ...buttonStyle,
            }}
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
      )}
      className={props.className || 'test-download-viz-button'}
      isDisabled={disabled}
      {...props}
      >
      {svg && (
        <DropdownItem
          className="test-download-svg"
          key="svg"
          onClick={() => {
            if (svg instanceof Array) {
              svg.map((s, i) => downloadSvg({
                svg: getDOMNode(s),
                stylePrefix,
                fileName: `${slug[i]}.svg`,
              }));
              track('download-viz', { type: 'svg' });
              return;
            }
            downloadSvg({
              svg: getDOMNode(svg),
              stylePrefix,
              fileName: `${slug}.svg`,
            });
            track('download-viz', { type: 'svg' });
          }}
          style={styles.row(theme)}
          >
        SVG
        </DropdownItem>
      )}
      {svg && (
        <DropdownItem
          className="test-download-png"
          key="png"
          onClick={() => {
            if (!supportsSvgToPng()) return;
            if (svg instanceof Array) {
              svg.map((s, i) => downloadSvg({
                svg: getDOMNode(s),
                stylePrefix,
                fileName: `${slug[i]}.png`,
              }));
              track('download-viz', { type: 'png' });
              return;
            }
            downloadSvg({
              svg: getDOMNode(svg),
              stylePrefix,
              fileName: `${slug}.png`,
              scale: 2,
            });
            track('download-viz', { type: 'png' });
          }}
          style={{
            ...styles.row(theme),
            ...(supportsSvgToPng()
            ? {}
            : {
              opacity: 0.5,
            }),
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
          onClick={() => {
            saveFile(JSON.stringify(data, null, 2), 'JSON', `${isSlugArray ? slug[1] : slug}.json`);
            track('download-viz', { type: 'json' });
          }}
          style={styles.row(theme)}
          >
          { isSlugArray ? 'QQ JSON' : 'JSON'}
        </DropdownItem>
      )}
      {tsvData && (
        <DropdownItem
          key="TSV"
          onClick={() => {
            if (tsvData) {
              saveFile(
              tsvData[0] && tsvData[0].forEach
                ? mapArrayToTsvString(tsvData)
                : toTsvString(tsvData),
              'TSV',
              `${isSlugArray ? slug[1] : slug}.tsv`,
              );
              track('download-viz', { type: 'tsv' });
            }
          }}
          style={styles.row(theme)}
          >
          {isSlugArray ? 'QQ TSV' : 'TSV'}
        </DropdownItem>
      )}
    </DropDown>
  );
};

export default enhance(DownloadVisualizationButton);
