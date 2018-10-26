import { insertRule } from 'glamor';
import React from 'react';
import { ITheme, TSetTheme, TWithTheme } from './types';

let theme: ITheme = {};

export const setTheme: TSetTheme = (version, custom = {}) => {
  const loadedVersion = require(`./versions/${version}`);

  theme = {
    ...loadedVersion.default,
    ...custom,
  };

  if (loadedVersion.globalRules) {
    insertRule(loadedVersion.globalRules);
  }
};

export const getTheme = (): ITheme => theme;

export const withTheme: TWithTheme = Wrapped => props => (
  <Wrapped theme={getTheme()} {...props} />
);

setTheme('active');

export { theme, ITheme };
