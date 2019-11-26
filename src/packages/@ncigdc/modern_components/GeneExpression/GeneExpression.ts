// import React from 'react';
import {
  compose,
  setDisplayName,
} from 'recompose';

import GeneExpressionChart from './GeneExpressionChart';

export default compose(
  setDisplayName('EnhancedGeneExpression'),
)(GeneExpressionChart);
