export interface ITheme {
  impacts?: {};
  tableHighlight?: string;
  greyScale1?: string;
  greyScale2?: string;
  greyScale3?: string;
  greyScale4?: string;
  greyScale5?: string;
  greyScale6?: string;
  greyScale7?: string;
  secondary?: boolean;
}

export type TSetTheme = (version: string, custom?: object) => void;

export type TWithTheme = (
  Wrapped: React.ComponentType<any>
) => React.ComponentType<any>;
