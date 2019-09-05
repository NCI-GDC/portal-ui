import React from 'react';
import {
  compose,
  lifecycle,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { style } from 'glamor';
import Emitter from '@ncigdc/utils/emitter';
import Highlight from '@ncigdc/uikit/Highlight';
import { capitalize } from 'lodash';
import Node from './Node';

const expandedColor = style({
  color: '#267c2a',
});

const collapsedColor = style({
  color: '#2f487e',
});

const highlight = style({
  backgroundColor: '#f3fc39',
});

const Branch = ({
  branchClickHandler,
  entities,
  entityTypes,
  expanded,
  parentNode,
  query, // : ex,
  queryLowerCased,
  search,
  selectedEntity,
  selectEntity,
  setTreeStatus,
  setTreeStatusOverride,
  treeStatusOverride,
  type,
}) => (
  <div className={`biotree-branch ${parentNode} ${type.p}`}>
    <div
      className="tree-indent"
      >
      <div
        className="tree"
        onClick={branchClickHandler}
        style={{ cursor: 'pointer' }}
        >
        <i
          className={`fa ${expanded
            ? `fa-minus-square ${expandedColor}`
            : `fa-plus-square ${collapsedColor}`
          }`}
          />

        <span
          className={`h5 type ${query &&
            type.p.includes(queryLowerCased)
              ? highlight
              : ''
          }`}
          >
          <Highlight search={queryLowerCased}>
            {capitalize(type.p)}
          </Highlight>
        </span>
      </div>

      {expanded && entities.hits.edges.map(entity => (
        <Node
          entity={entity.node}
          entityTypes={entityTypes}
          key={
            entity.node.sample_id ||
            entity.node.portion_id ||
            entity.node.analyte_id ||
            entity.node.aliquot_id ||
            entity.node.slide_id
          }
          query={queryLowerCased}
          search={search}
          selectedEntity={selectedEntity}
          selectEntity={selectEntity}
          type={type}
          >
          <EnhancedBranch
            entityTypes={entityTypes}
            parentNode={entity.node.submitter_id}
            query={queryLowerCased}
            search={search}
            selectedEntity={selectedEntity}
            selectEntity={selectEntity}
            setTreeStatus={setTreeStatus}
            setTreeStatusOverride={setTreeStatusOverride}
            treeStatusOverride={treeStatusOverride}
            type={type}
            />
        </Node>
      ))}
    </div>
  </div>
);

const EnhancedBranch = compose(
  setDisplayName('EnhancedBioTreeBranch'),
  withProps(({
    query = '',
  }) => ({
    queryLowerCased: query.toLowerCase(),
  })),
  withState('emitterToken', 'setEmitterToken', null),
  withState('expanded', 'setExpanded', ({
    parentNode,
    treeStatusOverride,
  }) => (
    ['expanded', 'query matches'].includes(treeStatusOverride) ||
    parentNode === 'root'
  )),
  withHandlers({
    branchClickHandler: ({
      expanded,
      setExpanded,
      setTreeStatus,
      setTreeStatusOverride,
    }) => event => {
      event.stopPropagation();
      setExpanded(!expanded);
      setTreeStatus({
        type: `${expanded
          ? 'COLLAPSE'
          : 'EXPAND'}_NODE`,
      });
      setTreeStatusOverride();
    },
  }),
  withPropsOnChange(
    (
      {
        queryLowerCased,
        treeStatusOverride,
      },
      {
        queryLowerCased: nextQueryLowerCased,
        treeStatusOverride: nextTreeOverride,
      }
    ) => !(
      queryLowerCased === nextQueryLowerCased &&
      treeStatusOverride === nextTreeOverride
    ),
    ({
      entities,
      expanded,
      queryLowerCased,
      search,
      setExpanded,
      setTreeStatus,
      setTreeStatusOverride,
      treeStatusOverride,
      type,
    }) => {
      if (queryLowerCased.length > 0 && (
        entities.hits.edges.some(e => search(queryLowerCased, e).length) ||
        [
          'samples',
          'portions',
          'analytes',
          'aliquots',
          'slides',
        ].find(t => t.includes(queryLowerCased)) ||
        type.p.includes(queryLowerCased)
      )) {
        const message = 'query matches';
        setExpanded(true);
        setTreeStatus({
          payload: {
            expanded: message,
          },
          type: 'OVERRIDE_NODES',
        });
        setTreeStatusOverride(message);
      } else if (treeStatusOverride) {
        const override = treeStatusOverride === 'expanded';
        expanded === override || setExpanded(override);
      }
    }
  ),
  lifecycle({
    componentDidMount() {
      const {
        expanded,
        setTreeStatus,
      } = this.props;

      setTreeStatus({
        payload: {
          expanded,
          mounted: true,
        },
        type: 'TOTAL_NODES',
      });
    },
    componentWillMount(): void {
      const {
        setEmitterToken,
        setExpanded,
      } = this.props;
      const token = Emitter.addListener('expand', toExpand => {
        setExpanded(toExpand);
      });

      setEmitterToken(token);
    },
    componentWillUnmount(): void {
      const {
        emitterToken,
        expanded,
        setTreeStatus,
      } = this.props;

      emitterToken.remove();
      setTreeStatus({
        payload: {
          expanded,
          mounted: false,
        },
        type: 'TOTAL_NODES',
      });
    },
    // shouldComponentUpdate({
    // }) {
    // }
  }),
)(Branch);

export default EnhancedBranch;
