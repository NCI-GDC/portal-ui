import { insertRule } from 'glamor';
import React from 'react';

export interface ITheme {
  impacts?: {},
  tableHighlight?: string,
  greyScale5?: string,
  secondary?: boolean,
};

let theme: ITheme = {};

type TSetTheme = (version: string, custom?: object) => void;
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

interface IWrappedProps { theme? : object };
type TWithTheme = (Wrapped: React.SFC<IWrappedProps>) => React.SFC<IWrappedProps>;


export const withTheme: TWithTheme = Wrapped => props => (
  <Wrapped theme={getTheme()} {...props} />
);

setTheme('active');

export { theme };
