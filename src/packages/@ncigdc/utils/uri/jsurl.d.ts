declare module 'jsurl' {
  export function stringify(v: any): string;
  export function parse(s: string): string
  export function tryParse(s: string, def: string): string;
}
