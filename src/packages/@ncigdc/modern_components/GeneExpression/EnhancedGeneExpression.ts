// import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';

import GeneExpression from './GeneExpression';

export default compose(
  setDisplayName('EnhancedGeneExpression'),
  pure,
)(GeneExpression);
