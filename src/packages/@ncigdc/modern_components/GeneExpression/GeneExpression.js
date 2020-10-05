/* eslint-disable camelcase */
import { isEqual } from 'lodash';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';
import moment from 'moment';

import Chip from '@ncigdc/uikit/Chip';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { fetchApi } from '@ncigdc/utils/ajax';
import { processStream } from '@ncigdc/utils/data';
import saveFile from '@ncigdc/utils/filesaver';
import withRouter from '@ncigdc/utils/withRouter';

import GeneExpressionChart from './GeneExpressionChart';

import * as helper from './helpers';

const GeneExpression = ({
  downloadFiles,
  isDemo,
  isLoading,
  loadingHandler,
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
        <h1
          style={{
            alignItems: 'center',
            display: 'flex',
            margin: '0 0 20px',
          }}
          >
          Gene Expression
          <Chip
            label="BETA"
            style={{
              marginLeft: '1rem',
            }}
            />
        </h1>

        {isDemo && (
          <section>
            <p>
              Try out the beta release of our new tool for gene expression analysis.
              <br />
              Display the gene expression heatmap for sets of cases and genes of your choice.
            </p>
            <p>
              <strong>COMING SOON:</strong>
              {' Filter genes by expression level, and select genes that are highly variable.'}
            </p>
            <p>
              {'Please send us your feedback at: '}
              <a href="mailto:support@nci-gdc.datacommons.io">support@nci-gdc.datacommons.io</a>
            </p>
          </section>
        )}

        {isLoading
          ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                justifyContent: 'center',
              }}
              >
              <h3 style={{ marginBottom: '2rem' }}>{isLoading}</h3>
              <Spinner />
            </div>
          )
          : visualizationData
            ? (
              <GeneExpressionChart
                handleClickInchlibLink={helper.handleClickInchlibLink}
                handleFileDownloads={downloadFiles}
                handleLoading={loadingHandler}
                visualizationData={visualizationData}
                />
            )
            : (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  height: 250,
                  justifyContent: 'center',
                }}
                >
                Something went wrong with the visualization request. Please try again later.
              </div>
            )}
      </Column>
    </Row>
  </Column>
);

export default compose(
  setDisplayName('EnhancedGeneExpression'),
  withState('isLoading', 'setIsLoading', 'Getting data...'),
  withState('visualizationData', 'setVisualizationData', null),
  withPropsOnChange(
    (props, nextProps) => !(
      isEqual(props.sets, nextProps.sets)
    ),
    ({
      setIsLoading,
      sets: {
        case_ids = [],
        gene_ids = [],
        ...sets
      },
    }) => {
      const isDemo = case_ids.length > 0 && gene_ids.length > 0;

      setIsLoading('Loading...');

      return ({
        isDemo,
        parsedSets: isDemo
          ? {
            case_ids,
            gene_ids,
          }
          : (
            Object.keys(sets).length > 0 && {
              case_set_id: Object.keys(sets.case)[0],
              gene_set_id: Object.keys(sets.gene)[0],
            }),
      });
    },
  ),
  withHandlers(() => ({
    downloadFiles: ({ parsedSets }) => async format => {
      switch (format.toLowerCase()) {
        case 'tsv': {
          const { body: stream } = (
            await fetchApi('gene_expression/values', {
              body: parsedSets,
              fullResponse: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }) || {} // in case the call fails
          );

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
      parsedSets,
      setIsLoading,
      setVisualizationData,
    }) => () => {
      const handleError = err => {
        console.error(err);
        setIsLoading(false);
      };

      setIsLoading('Getting data...');

      fetchApi('gene_expression/visualize', {
        body: parsedSets,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => (
          data
            ? data.inchlib && setVisualizationData(data.inchlib, () => setIsLoading(false))
            : handleError()
        ))
        .catch(handleError);
    },
    loadingHandler: ({
      setIsLoading,
    }) => chartIsLoading => {
      // This is for future implementation, to allow InchLib to change the message.
      // e.g. "Loading heatmap", "Loading visualization"
      setIsLoading(chartIsLoading);
    },
  })),
  withPropsOnChange(
    (props, nextProps) => !(
      isEqual(props.parsedSets, nextProps.parsedSets)
    ),
    ({
      fetchVisualizationData,
      parsedSets,
    }) => {
      parsedSets && fetchVisualizationData();
    },
  ),
  withRouter,
  pure,
)(GeneExpression);
