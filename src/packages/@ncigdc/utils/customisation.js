import { capitalisedTerms } from './constants';

export default (str: string = '') => {
  Object.keys(capitalisedTerms).forEach(term => {
    str = str.replace(term, capitalisedTerms[term]);
  });

  return str;
};
