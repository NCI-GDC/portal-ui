// import React from 'react';
import {
  compose,
  setDisplayName,
} from 'recompose';

import GeneExpression from './GeneExpression';

export default compose(
  setDisplayName('EnhancedGeneExpression'),
)(GeneExpression);
