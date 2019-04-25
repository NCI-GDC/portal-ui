// @flow

import _ from 'lodash';

type TFormatValue = (value: any) => string;
export const formatValue: TFormatValue = value => {
  if (_.isArray(value)) {
    return value.length;
  }

  if (_.isObject(value)) {
    return value.name;
  }

  if (!value && (!isNaN(value) && value !== 0)) {
    return '--';
  }

  return value;
};

export const entityTypes = [
  { s: 'portion', p: 'portions' },
  { s: 'aliquot', p: 'aliquots' },
  { s: 'analyte', p: 'analytes' },
  { s: 'slide', p: 'slides' },
];

export const idFields = [
  'sample_id',
  'portion_id',
  'analyte_id',
  'slide_id',
  'aliquot_id',
];

export const match = (query: string, entity: Object): boolean =>
  Object.keys(entity).some(k => {
    const formatted = formatValue(entity[k]);
    return (
      typeof formatted === 'string' &&
      formatted.toLowerCase().includes(query.toLowerCase())
    );
  });

export const search = (query: string, entity: Object): any[] => {
  const found = [];

  function search(entity, type, parents) {
    if (entity.node && match(query, entity.node)) found.push(entity);

    entityTypes.forEach(type => {
      _.get(entity, `node[${type.p}].hits.edges`, []).forEach(child => {
        search(child, type.s, [entity[type.p], entity].concat(parents));
      });
    });
  }

  if (entity.node && match(query, entity.node)) found.push(entity);

  entityTypes.forEach(type => {
    _.get(entity, `node[${type.p}].hits.edges`, []).forEach(child => {
      search(child, type.s, [entity[type.p], entity]);
    });
  });

  return found;
};
