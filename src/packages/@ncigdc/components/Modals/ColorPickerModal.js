// @flow
import React from 'react';
import { map } from 'lodash';
import { compose, withState, withPropsOnChange } from 'recompose';
import { SketchPicker } from 'react-color';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { Row, Column } from '@ncigdc/uikit/Flex/index';
import { capitalize } from '@ncigdc/utils/string';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import {
  suggestedCnvThemes,
  suggestedMutationThemes,
} from '@ncigdc/utils/filters/prepared/significantConsequences';
import { visualizingButton } from '@ncigdc/theme/mixins';

const Swatch = ({
  color,
  label,
  onSelect,
  palette,
  handleComplete,
  style,
  type,
  setPalette,
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
      <DropdownItem
        style={{
          flexDirection: 'column !important',
          justifyContent: 'center !important',
          alignItems: 'center !important',
        }}
      >
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

const PresetTheme = ({ type, theme, setTheme, palette, styles = {} }) => {
  return (
    <div
      style={{
        margin: 5,
        border: `1px solid lightgray`,
        borderRadius: '5px',
        padding: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
        }}
      >
        {map(theme, (val, key) => {
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: 100,
                // margin: '0 10px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: val,
                  width: 15,
                  height: 15,
                  margin: 5,
                  ...styles,
                }}
              />
              <span style={{ fontSize: '1rem' }}>
                {key.replace(/_/g, ' ').replace(/variant/g, '')}
              </span>
            </div>
          );
        })}
      </div>
      <Row style={{ justifyContent: 'flex-end', marginTop: 10 }}>
        <Button
          style={visualizingButton}
          onClick={() =>
            setTheme({
              ...palette,
              [type]: {
                ...palette[type],
                ...theme,
              },
            })}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

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
        <Column style={{ width: '40%' }}>
          <Row style={{ marginLeft: 30 }}>
            <Column>
              <h4>Suggested Themes</h4>
              <Row
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  width: 250,
                }}
              >
                {map(suggestedMutationThemes, (theme, i) => {
                  return (
                    <PresetTheme
                      key={i}
                      theme={theme}
                      styles={{ borderRadius: '50%' }}
                      type={'mutation'}
                      setTheme={setPalette}
                      palette={palette}
                    />
                  );
                })}
              </Row>
              <Row
                style={{
                  display: 'flex',
                  width: 250,
                }}
              >
                {map(suggestedCnvThemes, (theme, i) => {
                  return (
                    <PresetTheme
                      key={i}
                      theme={theme}
                      type={'cnv'}
                      setTheme={setPalette}
                      palette={palette}
                    />
                  );
                })}
              </Row>
            </Column>
          </Row>
        </Column>
        <Column className="grid-color-schemes" style={{ width: '60%' }}>
          <Row style={{ borderBottom: '1px solid lightgray' }}>
            <h4 style={{ width: '50%' }}>Mutations</h4>
            <h4 style={{ width: '50%' }}>CNVs</h4>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Column
              className="mutation-color-scheme"
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                width: 400,
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
                    setPalette={setPalette}
                  />
                );
              })}
            </Column>
            <Column
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
            </Column>
          </Row>
        </Column>
      </div>
    </BaseModal>
  );
});
