/* @flow */
import moment from 'moment';

export default (dateFormat: string = 'YYYY-MM-DD'): string =>
  `${moment().format(dateFormat)}`;
