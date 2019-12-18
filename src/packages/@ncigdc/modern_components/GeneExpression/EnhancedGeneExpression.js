// import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
// import { withRouter } from 'react-router-dom';

import GeneExpression from './GeneExpression';

export default compose(
  setDisplayName('EnhancedGeneExpression'),
  // withRouter,
  pure,
)(GeneExpression);
