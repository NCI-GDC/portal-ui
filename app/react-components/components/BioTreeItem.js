import React from 'react';
import { css } from 'glamor';
import BioTreeView from './BioTreeView';
import { search, idFields, formatValue } from '../utils/biotree';

let entityTypes = [
  { s: 'portion', p: 'portions' },
  { s: 'aliquot', p: 'aliquots' },
  { s: 'analyte', p: 'analytes' },
  { s: 'slide', p: 'slides' },
];

let pointer = css({
  cursor: 'pointer',
});

let underline = css({
  borderBottom: '3px solid #60a8d2',
});

let hoverUnderline = css({
  ':hover': {
    borderBottom: '2px solid #60a8d2',
  },
});

let highlight = css({
  backgroundColor: '#f3fc39',
});

let BioTreeItem = ({ entity, type, selectEntity, selectedEntity, query }) => {
  return (
    <div className="biospecimen-row document tree-item" style={{ padding: '2px 0 2px 5px' }}>
      {entity[type.s + '_id'] &&
        <div className="biospecimen-row-entity" style={{ marginBottom: '0.4rem' }}>
          <i className="fa fa-flask tree-flask" />
          <span
            className={`
              biospecimen-id
              ${pointer}
              ${hoverUnderline}
              ${selectedEntity[type.s + '_id'] === entity[type.s + '_id'] ? underline : ''}
              ${query && (search(query, entity) || []).some(e =>
                e[type.s + '_id'] === entity[type.s + '_id']
              )
                ? highlight
                : ''
              }
            `}
            onClick={e => { selectEntity(entity); e.stopPropagation(); }}
          >
            {entity.submitter_id || entity[type.s + '_id']}
          </span>

          {selectedEntity[type.s + '_id'] === entity[type.s + '_id'] &&
            <i
              style={{ marginLeft: '0.3rem' }}
              className="fa fa-caret-right"
            />
          }
        </div>
      }
      {entityTypes.filter(childType => entity[childType.p])
      .map(childType =>
        <BioTreeView
          key={childType.p}
          entities={entity[childType.p]}
          type={childType}
          selectedEntity={selectedEntity}
          query={query}
          selectEntity={selectEntity}
          selectedEntity={selectedEntity}
          defaultExpanded
        />
      )}
    </div>
  );
};

export default BioTreeItem;
