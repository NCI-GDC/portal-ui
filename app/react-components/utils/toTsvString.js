/* @flow */

export default (xs: Array<Object>): string => {
  let result = ``;
  if (xs) {
    result = Object.keys(xs[0]).join(`\t`) + `\n`;
    xs.forEach(x => result += Object.keys(x).map(key => x[key]).join(`\t`) + `\n`);
  }
  return result;
};

export function mapArrayToTsvString(xs: Array<Map<string, string>>): string {
  let result = ``;
  xs[0].forEach((val, key) => result += key + `\t`);
  result += `\n`;
  xs.forEach(x => {
    x.forEach(val => result += val + `\t`);
    result += `\n`;
  });
  return result;
}
