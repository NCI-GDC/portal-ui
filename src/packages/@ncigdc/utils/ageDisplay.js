// @flow

import _ from 'lodash';

export const DAYS_IN_YEAR = 365.25;
export const getLowerAgeYears = (days: number) =>
  Math.ceil(days / DAYS_IN_YEAR);
export const getUpperAgeYears = (days: number) =>
  Math.ceil((days + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR);

export default (
  ageInDays: number,
  yearsOnly: boolean = false,
  defaultValue: string = '--',
): string => {
  const DAYS_IN_YEAR = 365.25;
  const leapThenPair = (years: number, days: number): number[] =>
    days === 365 ? [years + 1, 0] : [years, days];
  const timeString = (
    number: number,
    singular: string,
    plural: string,
  ): string => {
    const pluralChecked = plural || `${singular}s`;
    return `${number} ${number === 1 ? singular : pluralChecked}`;
  };
  const _timeString = _.spread(timeString);

  if (!ageInDays) {
    return defaultValue;
  }
  return _.zip(
    leapThenPair(
      Math.floor(ageInDays / DAYS_IN_YEAR),
      Math.ceil(ageInDays % DAYS_IN_YEAR),
    ),
    ['year', 'day'],
  )
    .filter(p => (yearsOnly ? p[1] === 'year' : p[0] > 0))
    .map(p => (!yearsOnly ? _timeString(p) : p[0]))
    .join(' ')
    .trim();
};
