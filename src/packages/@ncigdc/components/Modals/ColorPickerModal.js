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
import { suggestedGridThemes } from '@ncigdc/utils/filters/prepared/significantConsequences';
import { withTheme } from '@ncigdc/theme';

const styles = {
  common: theme => ({
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  button: theme => ({
    ...styles.common(theme),
  }),
};

const Swatch = compose(
  withTheme,
)(
  ({
    color,
    label,
    onSelect,
    palette,
    handleComplete,
    style,
    type,
    setPalette,
    theme,
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
          <Button
            style={{
              ...styles.button(theme),
              display: 'flex',
              flexDirection: 'row',
              padding: 12,
              margin: 10,
              cursor: 'pointer',
              borderRadius: 5,
              border: `1px solid ${theme.greyScale4}`,
              width: 130,
              color: theme.greyScale2,
              justifyContent: 'flex-start',
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
          </Button>
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
  },
);

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

const PresetTheme = compose(
  withTheme,
)(
  ({
    type,
    suggestedPalette,
    setPalette,
    palette,
    customStyles = {},
    theme,
  }) => {
    return (
      <Button
        style={{
          ...styles.button(theme),
          display: 'flex',
          margin: 10,
          borderRadius: 5,
          border: `1px solid ${theme.greyScale4}`,
          color: theme.greyScale2,
          justifyContent: 'flex-start',
          padding: 0,
          width: '80%',
        }}
        onClick={() =>
          setPalette({
            ...palette,
            [type]: {
              ...palette[type],
              ...suggestedPalette,
            },
          })}
      >
        <Row
          style={{
            margin: 10,
            flexWrap: 'wrap',
          }}
        >
          {map(suggestedPalette, (color, key) => {
            return (
              <Row
                key={key}
                style={{
                  width: 120,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: color,
                    width: 15,
                    height: 15,
                    margin: 5,
                    ...customStyles.swatch,
                  }}
                />
                <span style={{ fontSize: '1.2rem', paddingLeft: 10 }}>
                  {capitalize(key.replace(/_/g, ' ').replace(/variant/g, ''))}
                </span>
              </Row>
            );
          })}
        </Row>
      </Button>
    );
  },
);

export default compose(
  withState('palette', 'setPalette', {}),
  withPropsOnChange(['colors'], ({ colors, setPalette }) => {
    setPalette(colors);
  }),
  withTheme,
)(
  ({
    onClose,
    mutations,
    cnvs,
    setPalette,
    palette,
    onApply,
    theme,
    checked = false,
  }) => {
    return (
      <BaseModal
        title="Choose Grid Colors"
        closeText="Cancel"
        onClose={onClose}
        extraButtons={<Button onClick={() => onApply(palette)}>Apply</Button>}
      >
        <span>
          Select the colors to display for each element on the OncoGrid. To
          change a color, click on the square and select the color of interest.
        </span>
        <Row style={{ marginTop: '1rem' }}>
          <Column
            style={{
              width: '60%',
              marginRight: '1rem',
            }}
          >
            <h4>Mutations</h4>
            <Row
              className="mutation-color-scheme"
              style={{
                flexFlow: 'row wrap',
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
            </Row>
            <Column style={{ marginTop: '1rem' }}>
              <h4>Suggested Theme</h4>
              <PresetTheme
                suggestedPalette={suggestedGridThemes.mutation}
                setPalette={setPalette}
                palette={palette}
                type={'mutation'}
                customStyles={{ swatch: { borderRadius: '50%' } }}
              />
            </Column>
          </Column>
          <Column style={{ width: '40%' }}>
            <h4>CNVs</h4>
            <Row
              className="cnv-color-scheme"
              style={{
                flexFlow: 'row wrap',
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
            <Column style={{ marginTop: '1rem' }}>
              <h4>Suggested Theme</h4>
              <Row>
                <PresetTheme
                  suggestedPalette={suggestedGridThemes.cnv}
                  setPalette={setPalette}
                  palette={palette}
                  type={'cnv'}
                />
              </Row>
            </Column>
          </Column>
        </Row>
      </BaseModal>
    );
  },
);
