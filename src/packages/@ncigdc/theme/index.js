// @flow

import React from 'react';
import { insertRule } from 'glamor';

export type TTheme = {
  impacts: {},
  tableHighlight: string,
  greyScale5: string,
};

let theme: TTheme = {};

type TSetTheme = (version: string, custom?: Object) => void;
export const setTheme: TSetTheme = (version, custom = {}) => {
  // $FlowIgnore
  const loadedVersion = require(`./versions/${version}`);

  theme = {
    ...loadedVersion.default,
    ...custom,
  };

  if (loadedVersion.globalRules) insertRule(loadedVersion.globalRules);
};

export const getTheme = (): TTheme => theme;

type TWithTheme = (Wrapped: ReactClass<{}>) => ReactClass<{}>;
export const withTheme: TWithTheme = Wrapped => props => (
  <Wrapped theme={getTheme()} {...props} />
);

setTheme('active');

export { theme };
