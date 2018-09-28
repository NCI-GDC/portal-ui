// @flow
import React from 'react';
import { map } from 'lodash';
import { compose, withState, withPropsOnChange } from 'recompose';
import { SketchPicker } from 'react-color';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { Row } from '@ncigdc/uikit/Flex/index';
import { capitalize } from '@ncigdc/utils/string';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';

const Swatch = ({
  color,
  label,
  onSelect,
  palette,
  handleComplete,
  style,
  type,
}) => {
  const handleChange = (color, event) => {
    onSelect({
      ...palette,
      [type]: {
        ...palette[type],
        [label]: color.hex,
      },
    });
  };

  return (
    <Dropdown
      autoclose={false}
      button={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              ...style,
              backgroundColor: color,
              width: 15,
              height: 15,
            }}
          />
          <span style={{ marginLeft: 5 }}>
            {capitalize(label.replace(/_/g, ' ').replace(/variant/g, ''))}
          </span>
        </div>
      }
      dropdownStyle={{ top: '100%', marginTop: 5, whiteSpace: 'nowrap' }}
    >
      <DropdownItem>
        <SketchPicker
          presetColors={presetColors}
          color={color}
          onChange={handleChange}
        />
      </DropdownItem>
    </Dropdown>
  );
};

const presetColors = [
  '#EF6C00',
  '#FFB300',
  '#64FFDA',
  '#00E676',
  '#81D4FA',
  '#0288D1',
  '#BDBDBD',
  '#FF4081',
  '#F8BBD0',
  '#AA00FF',
];

export default compose(
  withState('palette', 'setPalette', {}),
  withPropsOnChange(['colors'], ({ colors, setPalette }) => {
    setPalette(colors);
  }),
)(({ onClose, mutations, cnvs, setPalette, palette, onApply }) => {
  return (
    <BaseModal
      title="Choose Grid Colors"
      closeText="Cancel"
      onClose={onClose}
      extraButtons={<Button onClick={() => onApply(palette)}>Apply</Button>}
    >
      <span>
        Select the colors to display for each element on the OncoGrid. To change
        a color, click on the square and select the color of interest.
      </span>
      <div className="color-picker" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}
      >
        <Row
          className="mutation-color-scheme"
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            width: 350,
          }}
        >
          {map(palette.mutation, (color, type) => {
            return (
              <Swatch
                key={type}
                color={color}
                label={type}
                onSelect={setPalette}
                palette={palette}
                handleComplete={() => onClose(palette)}
                style={{ borderRadius: 10 }}
                type={'mutation'}
              />
            );
          })}
        </Row>
        <Row
          className="cnv-color-scheme"
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            width: 250,
            justifyContent: 'space-between',
          }}
        >
          {map(palette.cnv, (color, type) => {
            return (
              <Swatch
                key={type}
                color={color}
                label={type}
                onSelect={setPalette}
                palette={palette}
                handleComplete={() => onClose(palette)}
                type={'cnv'}
              />
            );
          })}
        </Row>
      </div>
    </BaseModal>
  );
});
