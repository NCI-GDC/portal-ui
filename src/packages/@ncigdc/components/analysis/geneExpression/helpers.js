// current limit by InchLib rendering capabilities
export const MAXDATAPOINTS = localStorage.GE_MAXDATAPOINTS || 120000;
const MINCASES = localStorage.GE_MINCASES || 5;
const MINGENES = localStorage.GE_MINGENES || 5;

export const validateGeneExpressionAvailability = ({
  cases: {
    with_gene_expression_count: casesWithGE,
    without_gene_expression_count: casesWithoutGE,
  },
  genes: {
    with_gene_expression_count: genesWithGE,
    without_gene_expression_count: genesWithoutGE,
  },
} = {
  cases: {},
  genes: {},
}) => ({
  casesData: {
    withGE: casesWithGE,
    withoutGE: casesWithoutGE,
  },
  geneCoverage: genesWithoutGE > 0 ? 'some' : 'all',
  status: (
    casesWithGE === undefined
      ? 'error'
    : casesWithGE < MINCASES ||
      genesWithGE < MINGENES
      ? 'notEnough'
    : casesWithGE * genesWithGE > MAXDATAPOINTS
      ? 'tooMany'
    : 'ready'
  ),
});
