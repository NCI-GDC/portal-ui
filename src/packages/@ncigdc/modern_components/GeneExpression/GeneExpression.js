/* eslint-disable camelcase */

import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import moment from 'moment';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { fetchApi } from '@ncigdc/utils/ajax';
import { processStream } from '@ncigdc/utils/data';
import saveFile from '@ncigdc/utils/filesaver';
import withRouter from '@ncigdc/utils/withRouter';

import GeneExpressionChart from './GeneExpressionChart';

// import mockData from './inchlib/data';
import * as helper from './helpers';

const GeneExpression = ({
  downloadFiles,
  visualizationData,
}) => (
  <Column style={{ marginBottom: '1rem' }}>
    <Row
      style={{
        margin: '20px 0',
        padding: '2rem 3rem',
      }}
      >
      <Column
        style={{
          flex: '1 0 auto',
        }}
        >
        <h1 style={{ margin: '0 0 20px' }}>Gene Expression</h1>
        {visualizationData && (
          <GeneExpressionChart
            handleClickInchlibLink={helper.handleClickInchlibLink}
            handleFileDownloads={downloadFiles}
            visualizationData={visualizationData}
            />
        )}
      </Column>
    </Row>
  </Column>
);

export default compose(
  setDisplayName('EnhancedGeneExpression'),
  // optional: small, local dataset for working on UI,
  // because the mock API endpoint result is large (120k data points).
  // can be removed when the full API is available.
  // withState('visualizationData', 'setVisualizationData', mockData.inchlib),
  withState('visualizationData', 'setVisualizationData', null),
  withHandlers(({ sets, sets: { case_ids = [], gene_ids = [] } }) => {
    // demo uses arrays of case & gene IDs instead of a case & gene set
    const isDemo = case_ids.length > 0 && gene_ids.length > 0;
    const body = {
      ...isDemo
        ? sets
        : {
          case_set_id: Object.keys(sets.case)[0],
          gene_set_id: Object.keys(sets.gene)[0],
        },
    };

    return {
      downloadFiles: () => async format => {
        switch (format.toLowerCase()) {
          case 'tsv': {
            const { body: stream } = (await fetchApi('gene_expression/values', {
              body,
              fullResponse: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }) || {});

            return stream
              ? processStream('GeneExpression.Download', stream.getReader())()
                .then(parsedStream => saveFile(
                  parsedStream,
                  'tsv',
                  `gene-expression-values.${
                    moment().format('YYYY-MM-DD-HHmmss')
                  }.tsv`,
                ))
                .catch(error => console.error(error))
              : console.error('Gene Expression TSV download error, empty response from server');
          }
          default:
            return console.info('unhandled download format');
        }
      },
      fetchVisualizationData: ({
        setVisualizationData,
      }) => () => {
        fetchApi('gene_expression/visualize', {
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(data => {
            data && data.inchlib && setVisualizationData(data.inchlib);
          })
          .catch(error => console.error(error));
      },
    };
  }),
  lifecycle({
    componentDidMount() {
      const { fetchVisualizationData } = this.props;
      fetchVisualizationData();
    },
  }),
  withRouter,
  pure,
)(GeneExpression);
