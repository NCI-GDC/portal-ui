import pluralize from 'pluralize';
export default (word = '', count = 0, inclusive) =>
  `${inclusive ? `${count.toLocaleString()} ` : ''}${pluralize(word, count)}`;
