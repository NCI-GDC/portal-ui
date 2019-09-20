export default [
  (state, { // Reducer Function
    payload: {
      expanded,
      mounted,
    } = {},
    type,
  }) => {
    switch (type) {
      case 'COLLAPSE_NODE':
        return {
          ...state,
          collapsed: state.collapsed + 1,
          expanded: Math.max(state.expanded - 1, 0),
        };
      case 'EXPAND_NODE':
        return {
          ...state,
          collapsed: Math.max(state.collapsed - 1, 0),
          expanded: state.expanded + 1,
        };
      case 'TOTAL_NODES': {
        const quantity = (mounted ? 1 : -1);
        return {
          ...state,
          ...expanded
            ? {
              expanded: state.expanded + quantity,
            }
            : {
              collapsed: state.collapsed + quantity,
            },
          total: state.total + quantity,
        };
      }
      case 'OVERRIDE_NODES': {
        return {
          ...state,
          collapsed: expanded ? 0 : state.total,
          expanded: expanded ? state.total : 0,
        };
      }
      default:
        return state;
    }
  },
  { // initial state
    collapsed: 0,
    expanded: 0,
    total: 0,
  },
];
