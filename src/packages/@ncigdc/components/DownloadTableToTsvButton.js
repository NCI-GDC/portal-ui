// @flow
import React from 'react';
import { map, reduce } from 'lodash';
import { compose } from 'recompose';

import saveFile from '@ncigdc/utils/filesaver';
import { mapStringArrayToTsvString } from '@ncigdc/utils/toTsvString';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import withTooltip from '@ncigdc/uikit/Tooltip/withTooltip';
import { track } from '@ncigdc/utils/analytics';

type TProps = {
  selector: string,
  filename: string,
  style: Object,
};

const getSingleHeader = (headThs: Array<NodeList>) => reduce(
  headThs[0],
  (acc, th) => (th.rowSpan === 2 ? [...acc, th] : [...acc, ...map(headThs[1], t => t)]),
  []
);

export const downloadToTSV = ({ excludedColumns = [
  'Add all files to cart',
  'Remove all files from cart',
  'Select column',
], filename, selector }) => {
  const tableEl = document.querySelector(selector);
  const headTrs = tableEl.querySelector('thead').querySelectorAll('tr');
  const headThs = map(headTrs, h => h.querySelectorAll('th'));
  const thEls =
    headThs.length === 2
      ? getSingleHeader(headThs)
      : tableEl.querySelectorAll('th');
  const thText = map(thEls, el => el.innerText).map(t => t.replace(/\s+/g, ' '));
  const trs = tableEl.querySelector('tbody').querySelectorAll('tr');
  const tdText = map(trs, t => {
    const tds = t.querySelectorAll('td');
    return reduce(
      tds,
      (acc, td) => {
        const markedForTsv = td.querySelector('.for-tsv-export');
        const exportText = markedForTsv
          ? markedForTsv.innerText
          : td.innerText;
        const joinedText = exportText
          .trim()
          .split(/\s*\n\s*/)
          .join(',')
          .replace(/[\s\u00A0]+/g, ' ');
        const colspan = td.getAttribute('colspan');
        const fittedToColspan = colspan
          ? [joinedText, ...Array(colspan - 1)]
          : [joinedText];
        return [...acc, ...fittedToColspan];
      },
      []
    );
  });
  const excludedIndices = excludedColumns.reduce((acc, curr) => {
    const normalizedCurr = curr.toLowerCase().trim();
    const normalizedThText = thText.map(th => th.toLowerCase().trim());
    const index = normalizedThText.indexOf(normalizedCurr);
    return [...acc, ...(index >= 0 ? [index] : [])];
  }, []);
  const thFiltered = thText
    .filter((th, idx) => excludedIndices.indexOf(idx) === -1);
  const tdFiltered = tdText.map(tr => tr
    .filter((td, idx) => excludedIndices.indexOf(idx) === -1));

  saveFile(mapStringArrayToTsvString(thFiltered, tdFiltered), 'TSV', filename);
  track('download-table', {
    filename,
    selector,
    type: 'tsv',
  });
};

const DownloadTableToTsvButton = compose(withTooltip)(
  ({
    excludedColumns,
    filename,
    selector,
    leftIcon,
    style = {},
    displayTooltip = true,
    setTooltip,
  }: TProps) => (
    <Button
      leftIcon={leftIcon}
      onClick={() => downloadToTSV({
        excludedColumns,
        filename,
        selector,
      })}
      onMouseEnter={() => displayTooltip && setTooltip(<span>Export current view</span>)
      }
      onMouseLeave={() => displayTooltip && setTooltip('')}
      style={{
        ...visualizingButton,
        ...style,
      }}
      >
      TSV
    </Button>
  )
);
export default DownloadTableToTsvButton;

export const ForTsvExport = ({ children }: { children: string }) => (
  <span className="for-tsv-export" style={{ display: 'none' }}>
    {children}
  </span>
);
