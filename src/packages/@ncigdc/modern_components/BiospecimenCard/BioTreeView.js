// @flow

import React from 'react';
import { withState, compose, lifecycle, mapProps } from 'recompose';
import { style } from 'glamor';
import Emitter from '@ncigdc/utils/emitter';
import BioTreeItem from './BioTreeItem';
import { search } from './utils';
import Highlight from '@ncigdc/uikit/Highlight';
import { capitalize } from 'lodash';

const expandedColor = style({
  color: '#267c2a',
});

const collapsedColor = style({
  color: '#2f487e',
});

const highlight = style({
  backgroundColor: '#f3fc39',
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
  const entityTypes = ['portions', 'analytes', 'aliquots', 'slides'];

  const lCaseQuery = query.toLowerCase();
  const expanded =
    ex ||
    (query &&
      (entities.hits.edges.some(e => search(lCaseQuery, e).length) ||
        entityTypes.find(t => t.includes(lCaseQuery)) ||
        type.p.includes(lCaseQuery)));
  return (
    <div className="test-biotree-view">
      {entities.hits.total > 0 && (
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
            <span
              className={`h5 type ${query && type.p.includes(lCaseQuery)
                ? highlight
                : ''}`}
            >
              <Highlight search={lCaseQuery}>{capitalize(type.p)}</Highlight>
            </span>
          </div>

          {expanded &&
            entities.hits.edges.map((entity, i) => (
              <BioTreeItem
                key={i}
                entity={entity.node}
                type={type}
                selectEntity={selectEntity}
                selectedEntity={selectedEntity}
                query={lCaseQuery}
                expanded={childrenExpanded}
              />
            ))}
        </div>
      )}
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
