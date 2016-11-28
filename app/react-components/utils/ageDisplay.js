import _ from 'lodash';

export default (ageInDays: number, yearsOnly: boolean = false, defaultValue: string = '--'): string => {
  const oneYear = 365.25;
  const leapThenPair = (years: number, days: number): number[] => (days === 365) ? [years + 1, 0] : [years, days];
  const timeString = (number: number, singular: string, plural: string): string => {
    const pluralChecked = plural ? plural : `${singular}s`;
    return `${number} ${number === 1 ? singular : pluralChecked}`;
  };
  const _timeString = _.spread(timeString);

  if (!ageInDays) {
    return defaultValue;
  }
  return _.zip(leapThenPair(Math.floor(ageInDays / oneYear), Math.ceil(ageInDays % oneYear)), ['year', 'day'])
  .filter(p => yearsOnly ? p[1] === 'year' : p[0] > 0)
  .map(p => !yearsOnly ? _timeString(p) : p[0])
  .join(' ')
  .trim();
};
