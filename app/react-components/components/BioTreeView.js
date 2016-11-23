import React from 'react';
import { withState } from 'recompose';
import { style } from 'glamor';
import BioTreeItem from './BioTreeItem';
import { search } from '../utils/biotree';

let expandedColor = style({
  color: '#267c2a',
});

let collapsedColor = style({
  color: '#2f487e',
});

let BioTreeView = ({ entities, type, expanded: ex, set, selectEntity, selectedEntity, query }) => {
  let expanded = ex || (query && entities.some(e => search(query, e).length));

  return (
    <div onClick={e => { set(s => !s); e.stopPropagation(); }} className="tree-indent">
      <div className="tree">
        <i
          style={{ cursor: 'pointer' }}
          className={`
            fa
            ${expanded
              ? `fa-plus-square ${expandedColor}`
              : `fa-minus-square ${collapsedColor}`
            }
          `}
        />
        <span className="h5 type" style={{ textTransform: 'capitalize' }}>
          {type.p}
        </span>
      </div>

      {expanded && entities.map((entity, i) =>
        <BioTreeItem
          key={i}
          entity={entity}
          type={type}
          selectEntity={selectEntity}
          selectedEntity={selectedEntity}
          query={query}
        />
      )}
    </div>
  );
};

export default withState(
  'expanded',
  'set',
  props => !!props.entities.expanded || props.defaultExpanded
)(BioTreeView);
