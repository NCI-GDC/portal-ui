import _ from 'lodash';

export let formatValue = value => {
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

export let entityTypes = [
  { s: 'portion', p: 'portions' },
  { s: 'aliquot', p: 'aliquots' },
  { s: 'analyte', p: 'analytes' },
  { s: 'slide', p: 'slides' },
];

export let idFields = [
  'submitter_id', 'sample_id', 'portion_id',
  'analyte_id', 'slide_id', 'aliquot_id',
];

let match = (query: string, entity: Object) => {
  return Object.entries(entity).some(([, val]) => {
    let formatted = formatValue(val);
    return typeof formatted === 'string' &&
      formatted.toLowerCase().includes(query.toLowerCase());
  });
};

export let search = (query: string, entity: Object): any[] => {
  let found = [];

  function search (entity, type, parents) {
    if (match(query, entity)) found.push(entity);

    entityTypes.forEach(type => {
      (entity[type.p] || []).forEach(child => {
        search(child, type.s, [entity[type.p], entity].concat(parents));
      });
    });
  }

  if (match(query, entity)) found.push(entity);

  entityTypes.forEach(type => {
    (entity[type.p] || []).forEach(child => {
      search(child, type.s, [entity[type.p], entity]);
    });
  });

  return found;
};
