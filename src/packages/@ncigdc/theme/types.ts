export interface ITheme {
  impacts?: {},
  tableHighlight?: string,
  greyScale4?: string,
  greyScale5?: string,
  secondary?: boolean,
};

export type TSetTheme = (version: string, custom?: object) => void;

export type TWithTheme = (
  Wrapped: React.ComponentType<any>
) => React.ComponentType<any>;