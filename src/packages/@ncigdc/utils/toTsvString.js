/* @flow */
import { zip, some } from 'lodash';

export default (xs: Array<Object>): string => {
  let result = '';
  if (xs) {
    result = `${Object.keys(xs[0]).join('\t')}\n`;
    xs.forEach(x => {
      result += `${Object.keys(x)
        .map(key => x[key])
        .join('\t')}\n`;
    });
  }
  return result;
};

export function mapArrayToTsvString(xs: Array<Map<string, string>>): string {
  let result = '';
  xs[0].forEach((val, key) => {
    result += `${key}\t`;
  });
  result += '\n';
  xs.forEach(x => {
    x.forEach(val => {
      result += `${val}\t`;
    });
    result += '\n';
  });
  return result;
}

const removeEmptyCols = (data: Array<Array<string>>): Array<Array<string>> => {
  const transposed = zip(...data);
  const noEmptyColsTransposed = transposed.filter(col => some(col, c => c));
  return zip(...noEmptyColsTransposed);
};

export function mapStringArrayToTsvString(
  header: Array<string>,
  data: Array<Array<string>>,
): string {
  const allData = [header, ...data];
  const noEmptyCols = removeEmptyCols(allData);
  return noEmptyCols.map(row => row.join('\t')).join('\n');
}
