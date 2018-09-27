// @flow
import React from 'react';
import { map } from 'lodash';
import { compose, withState, withPropsOnChange } from 'recompose';
import { SketchPicker } from 'react-color';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { Row } from '@ncigdc/uikit/Flex/index';
import { colorMap } from '@ncigdc/utils/filters/prepared/significantConsequences';
import { capitalize } from '@ncigdc/utils/string';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

const Circle = ({ color, label, onSelect, palette, handleComplete }) => {
  const handleChange = (color, event) => {
    onSelect({
      ...palette,
      mutation: {
        ...palette.mutation,
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
              borderRadius: 10,
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

const Square = ({ color, label, onClick }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <div style={{ backgroundColor: color, width: 15, height: 15 }} />
      <span style={{ marginLeft: 5 }}>{label}</span>
    </div>
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
  withState('palette', 'setPalette', colorMap),
  withPropsOnChange(['palette'], ({ palette, setPalette }) => {
    setPalette(palette);
  }),
)(({ onClose, mutations, cnvs, setPalette, palette }) => {
  return (
    <BaseModal
      title="Choose Grid Colors"
      closeText="OK"
      onClose={() => onClose(palette)}
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
              <Circle
                key={type}
                color={color}
                label={type}
                onSelect={setPalette}
                palette={palette}
                handleComplete={() => onClose(palette)}
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
              <Square
                key={type}
                color={color}
                label={type}
                onSelect={setPalette}
              />
            );
          })}
        </Row>
      </div>
    </BaseModal>
  );
});
