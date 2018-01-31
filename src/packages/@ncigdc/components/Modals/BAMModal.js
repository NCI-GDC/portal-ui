// @flow

import React from 'react';
import { compose, withState, pure } from 'recompose';
import urlJoin from 'url-join';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import download from '@ncigdc/utils/download';
import { AUTH_API } from '@ncigdc/utils/constants';

type TProps = {
  file: Object,
  closeModal: Function,
  value: string,
  setValue: Function,
  active: boolean,
  setActive: Function,
};

export const processBAMSliceInput = (userInput: string): Object => {
  if (userInput) {
    const lines = userInput.split('\n').filter(v => v.length);
    return {
      regions: lines.map(line => {
        const region = line.split('\t');
        const regionTemplates = [
          r => `${r[0]}`,
          r => `${r[0]}:${r[1]}`,
          r => `${r[0]}:${r[1]}-${r[2]}`,
        ];
        return regionTemplates[region.length - 1](region);
      }),
    };
  }
  return {};
};

const setPos = (element: any, caretPos: number): void => {
  if (element.createTextRange) {
    const range = element.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else {
    element.focus();
    if (element.selectionStart !== undefined) {
      setTimeout(() => element.setSelectionRange(caretPos, caretPos));
    }
  }
};

const allowTab = (event: any, setValue) => {
  if (event.keyCode === 9) {
    event.preventDefault();

    // current caret pos
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    const oldValue = event.target.value;
    setValue(`${oldValue.substring(0, start)}\t${oldValue.substring(end)}`);

    // put caret in correct place
    setPos(event.target, start + 1);
  }
};

const enhance = compose(withState('value', 'setValue', ''), pure);

const BAMModal = ({ file, closeModal, value, setValue, setActive }: TProps) => (
  <Column
    style={{
      padding: '15px',
    }}
  >
    <h2>BAM Slicing</h2>
    <h3>File name: {file.file_name}</h3>
    <label htmlFor="bed">
      Please enter one or more slices' genome coordinates below in one of the
      following formats:
    </label>
    <pre>
      chr7:140505783-140511649<br />
      {'chr1	150505782	150511648'}
    </pre>
    <textarea
      id="bed"
      style={{
        minHeight: '100px',
        tabSize: 4,
        fontFamily: "'Courier New', Courier, monospace",
      }}
      value={value}
      onKeyDown={e => allowTab(e, setValue)}
      onChange={e => {
        setValue(e.target.value);
      }}
    />
    <Row style={{ paddingTop: '0.5rem', justifyContent: 'flex-end' }}>
      <Button onClick={closeModal} style={{ marginRight: '0.5rem' }}>
        Cancel
      </Button>
      <Button
        onClick={() => {
          if (value) {
            const params = {
              ...processBAMSliceInput(value),
              attachment: true,
            };
            setActive(true);
            download({
              params,
              url: urlJoin(AUTH_API, `v0/slicing/view/${file.file_id}`),
              method: 'POST',
            })(() => {}, () => setActive(false));
          }
          closeModal();
        }}
      >
        Download
      </Button>
    </Row>
  </Column>
);

export default enhance(BAMModal);
