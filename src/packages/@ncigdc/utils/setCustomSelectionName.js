import _ from 'lodash';

export default function({ selectedIds, displayType }) {
  return selectedIds && selectedIds.length
    ? `Custom ${_.capitalize(displayType)} Selection`
    : '';
}
