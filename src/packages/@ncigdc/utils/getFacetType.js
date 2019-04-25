/* @flow */
const _ = require('lodash');

module.exports = facet => {
  const fieldName = facet.field || facet.name;
  if (_.includes(fieldName, 'datetime')) {
    return 'datetime';
  } if (
    _.some([
      '_id',
      '_uuid',
      'md5sum',
      'file_name',
    ], idSuffix => _.includes(fieldName, idSuffix),)
  ) {
    return 'id';
  } if (facet.type === 'long' || _.get(facet, 'type.name') === 'Stats') {
    return 'range';
  }
  return 'terms';
};
