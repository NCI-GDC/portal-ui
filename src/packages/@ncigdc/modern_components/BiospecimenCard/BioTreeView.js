// @flow

import React from 'react';
import { withState, compose, lifecycle, mapProps } from 'recompose';
import { style } from 'glamor';
import Emitter from '@ncigdc/utils/emitter';
import BioTreeItem from './BioTreeItem';
import { search } from './utils';

const expandedColor = style({
  color: '#267c2a',
});

const collapsedColor = style({
  color: '#2f487e',
});

const BioTreeView = ({
  entities,
  type,
  expanded: ex,
  setExpanded,
  selectEntity,
  selectedEntity,
  query,
  childrenExpanded,
}) => {
  const expanded =
    ex || (query && entities.hits.edges.some(e => search(query, e).length));
  return (
    <div className="test-biotree-view">
      {entities.hits.total > 0 &&
        <div
          onClick={e => {
            setExpanded(state => !state);
            e.stopPropagation();
          }}
          className="tree-indent"
        >
          <div className="tree">
            <i
              style={{ cursor: 'pointer' }}
              className={`
                fa
                ${expanded
                  ? `fa-minus-square ${expandedColor}`
                  : `fa-plus-square ${collapsedColor}`}
              `}
            />
            <span className="h5 type" style={{ textTransform: 'capitalize' }}>
              {type.p}
            </span>
          </div>

          {expanded &&
            entities.hits.edges.map((entity, i) =>
              <BioTreeItem
                key={i}
                entity={entity.node}
                type={type}
                selectEntity={selectEntity}
                selectedEntity={selectedEntity}
                query={query}
                expanded={childrenExpanded}
              />,
            )}
        </div>}
    </div>
  );
};

const enhance = compose(
  withState(
    'expanded',
    'setExpanded',
    props => props.defaultExpanded || props.entities.expanded,
  ),
  withState('emitterToken', 'setEmitterToken', null),
  mapProps(({ defaultExpanded, ...rest }) => ({
    childrenExpanded: defaultExpanded,
    ...rest,
  })),
  lifecycle({
    componentWillMount(): void {
      const { setExpanded, setEmitterToken } = this.props;
      const token = Emitter.addListener('expand', toExpand => {
        setExpanded(toExpand);
      });
      setEmitterToken(token);
    },
    componentWillUnmount(): void {
      const { emitterToken } = this.props;
      emitterToken.remove();
    },
  }),
);
export default enhance(BioTreeView);
