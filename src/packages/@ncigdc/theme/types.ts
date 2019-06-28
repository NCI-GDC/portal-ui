export interface ITheme {
  impacts?: {},
  primary?:string,
  tableHighlight?: string,
  greyScale4?: string,
  greyScale5?: string,
  greyScale2?:string,
  secondary?: boolean,
};

export type TSetTheme = (version: string, custom?: object) => void;

export type TWithTheme = (
  Wrapped: React.ComponentType<any>
) => React.ComponentType<any>;
