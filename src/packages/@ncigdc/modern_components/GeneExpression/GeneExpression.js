/* eslint-disable camelcase */
import {
  capitalize,
  isEqual,
  truncate,
} from 'lodash';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';
import moment from 'moment';

import ValidationResults from '@ncigdc/components/analysis/geneExpression/ValidationResults';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import countComponents from '@ncigdc/modern_components/Counts';
import Chip from '@ncigdc/uikit/Chip';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { fetchApi } from '@ncigdc/utils/ajax';
import { processStream } from '@ncigdc/utils/data';
import saveFile from '@ncigdc/utils/filesaver';
import withRouter from '@ncigdc/utils/withRouter';

import DemoDescription from './DemoDescription';
import GeneExpressionChart from './GeneExpressionChart';

import * as helper from './helpers';

const featureNamesAllowList = [
  // alphabetized
  'age_at_diagnosis',
  'case_id',
  'ethnicity',
  'gender',
  'race',
  'submitter_id',
  'vital_status',
];

const formatColumnMetadata = ({ feature_names, features }) => {
  // alphabetize by feature name & remove unwanted features
  const obj = featureNamesAllowList.reduce((acc, curr) => ({
    ...acc,
    [curr]: features[feature_names.indexOf(curr)],
  }), {});

  return ({
    feature_names: Object.keys(obj),
    features: Object.values(obj),
  });
};

const GeneExpression = ({
  downloadFiles,
  isDemo,
  isLoading,
  loadingHandler,
  sets,
  validationResults,
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
          width: '100%',
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

        {isDemo && <DemoDescription />}

        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
          >
          <EntityPageHorizontalTable
            data={Object.entries(sets).map(([setType, set]) => {
              const [setId, setLabel] = Object.entries(set)[0];
              const id = `set-table-${setType}-${setId}-select`;
              const CountComponent = countComponents[setType];

              return {
                count: (
                  <CountComponent
                    filters={{
                      content: {
                        field: `${setType}s.${setType}_id`,
                        value: `set_id:${setId}`,
                      },
                      op: '=',
                    }}
                    >
                    {count => (
                      <span>
                        {count === 0 ? (
                          0
                        ) : (
                          <ExploreLink
                            query={{
                              filters: {
                                content: [
                                  {
                                    content: {
                                      field: `${setType}s.${setType}_id`,
                                      value: [`set_id:${setId}`],
                                    },
                                    op: 'IN',
                                  },
                                ],
                                op: 'AND',
                              },
                              searchTableTab: `${setType}s`,
                            }}
                            target="_blank"
                            >
                            {count.toLocaleString()}
                          </ExploreLink>
                        )}
                      </span>
                    )}
                  </CountComponent>
                ),
                id,
                set: (
                  <label
                    htmlFor={id}
                    >
                    <span
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        marginRight: '1rem',
                      }}
                      >
                      {`${capitalize(setType)}s:`}
                    </span>

                    {setLabel.length > 30
                      ? (
                        <Tooltip
                          Component={(
                            setLabel
                          )}
                          >
                          {truncate(setLabel, { length: 30 })}
                        </Tooltip>
                      )
                      : setLabel}
                  </label>
                ),
              };
            })}
            headings={[
              {
                key: 'set',
                style: { width: 100 },
                title: 'Set',
              },
              {
                key: 'count',
                style: { textAlign: 'right' },
                title: '# Items',
              },
            ]}
            tableBodyCellStyle={{
              width: '100%',
            }}
            tableBodyRowStyle={{
              backgroundColor: '#fff',
            }}
            tableContainerStyle={{
              boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
              marginBottom: '1rem',
              marginRight: '2.5rem',
              padding: '1rem',
              width: '33rem',
              zIndex: 6,
            }}
            tableHeadingStyle={{
              backgroundColor: '#fff',
              fontSize: '1.5rem',
            }}
            />

          <ValidationResults
            key="validation"
            styles={{
              alignItems: 'center',
              boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
              marginBottom: '1rem',
              padding: '1rem',
              paddingBottom: 'calc(1rem - 10px)',
            }}
            validationResults={validationResults}
            />
        </section>

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
      id,
      sets,
    }) => ({
      isDemo: id.includes('demo-'),
      parsedSets: (
        Object.keys(sets).length > 0 && {
          case_set_id: Object.keys(sets.case)[0],
          gene_set_id: Object.keys(sets.gene)[0],
        }),
    }),
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
        .then(data => {
          if (data) {
            if (data.inchlib) {
              const column_metadata = formatColumnMetadata(data.inchlib.column_metadata);
              const dataFiltered = {
                ...data.inchlib,
                column_metadata,
              };
              setVisualizationData(dataFiltered, () => setIsLoading(false));
            }
          } else {
            handleError();
          }
        })
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
