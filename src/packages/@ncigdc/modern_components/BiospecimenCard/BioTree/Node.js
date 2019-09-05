import React from 'react';
import { css } from 'glamor';
import Highlight from '@ncigdc/uikit/Highlight';

const pointer = css({
  cursor: 'pointer',
});

const underline = css({
  borderBottom: '3px solid #60a8d2',
});

const hoverUnderline = css({
  ':hover': {
    borderBottom: '2px solid #60a8d2',
  },
});

const highlight = css({
  backgroundColor: '#f3fc39',
});

const Node = ({
  children,
  entity,
  entityTypes,
  query,
  search,
  selectedEntity,
  selectEntity,
  type,
}) => (
  <div
    className="biospecimen-row document tree-item"
    style={{ padding: '2px 0 2px 5px' }}
    >

    {entity[`${type.s}_id`] && entity.submitter_id && (
      <div
        className="biospecimen-row-entity"
        style={{ marginBottom: '0.4rem' }}
        >
        <i className="fa fa-flask tree-flask" />
        <span
          className={`
            biospecimen-id
            ${pointer}
            ${hoverUnderline}
            ${selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`]
              ? underline
              : ''}
            ${query &&
            (search(query, { node: entity }) || [])
              .map(e => e.node)
              .some(e => e[`${type.s}_id`] === entity[`${type.s}_id`])
              ? highlight
              : ''}
          `}
          onClick={e => {
            selectEntity(entity, type);
            e.stopPropagation();
          }}
          >
          <Highlight search={query}>{entity.submitter_id}</Highlight>
        </span>

        {selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`] && (
          <i className="fa fa-caret-right" style={{ marginLeft: '0.3rem' }} />
        )}
      </div>
    )}

    {entityTypes
      .filter(childType => entity[childType.p] && entity[childType.p].hits.total > 0)
      .map(childType => React.cloneElement(children, {
        entities: entity[childType.p],
        key: childType.p,
        type: childType,
      }))}
  </div>
);

export default Node;
