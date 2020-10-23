/* eslint-disable camelcase */
// import { graphql } from 'react-relay';
import {
  compose,
  setDisplayName,
  withHandlers,
  // withPropsOnChange,
  withState,
} from 'recompose';

import { fetchApi } from '@ncigdc/utils/ajax';
import {
  processStream,
//   streamedXSVtoJSON,
  wholeXSVtoJSON,
} from '@ncigdc/utils/data';

import { IS_DEV } from '@ncigdc/utils/constants';

import { DESIREDHEADERS } from './constants';
import {
  clusteringDataTemplate,
  shapeClusteringData,
} from './helpers';

// import { makeFilter } from '@ncigdc/utils/filters';
// import { withRouter } from 'react-router-dom';
// import { BaseQuery } from '@ncigdc/modern_components/Query';

// temporarily importing data
// import { fetchApi } from '@ncigdc/utils/ajax';
// import stubData from './stubData';

export default (Component: ReactClass<*>) =>
  compose(
    setDisplayName('EnhancedSCRNASeq.relay'),
    withState('loading', 'setLoading', true),
    withState('data', 'setData', clusteringDataTemplate),
    withHandlers({
      // getChunkedTsv: ({
      //   setData,
      //   setLoading,
      // }) => async () => {
      //   // const file = await import('./stubData/seurat.tsv');
      //   // const { body: stream } = await fetch(`http://localhost:3000${file}`);
      //   const { body: stream } = await fetch('https://raw.githubusercontent.com/NCI-GDC/portal-ui/PRTL-3173/src/packages/%40ncigdc/modern_components/SCRNASeq/stubData/seurat.tsv');
      //
      //   const shapePlotData = (parsedChunk, getNext) =>
      //     setData(prev => shapeClusteringData(parsedChunk, prev), getNext);
      //
      //   // this function will memoise both column headers and incomplete rows from partial chunks
      //   const tsvToJSON = streamedXSVtoJSON(
      //     shapePlotData,
      //     DESIREDHEADERS.map(header => header.toLowerCase()),
      //   );
      //
      //   processStream('EnhancedSCRNASeq.relay', stream.getReader(), tsvToJSON)()
      //     // .then(response => setLoading(console.log('stream received')))
      //     .catch(error => console.error(error));
      // },
      getWholeTsv: ({
        analysisInfo: { file_id },
        setData,
        setLoading,
      }) => async () => {
        // const file = await import('./stubData/seurat.tsv');
        // const { body: stream } = await fetch(`http://localhost:3000${file}`);

        const { body: stream } = await fetchApi(
          `data/${file_id}`,
          {
            fullResponse: true,
          },
        );

        const tsvToJSON = wholeXSVtoJSON(
          'EnhancedSCRNASeq.relay',
          DESIREDHEADERS.map(header => header.toLowerCase()),
        );

        const shapePlotData = parsedChunk =>
          setData(
            prev => shapeClusteringData(tsvToJSON(parsedChunk), prev),
            () => setLoading(IS_DEV && console.timeEnd('EnhancedSCRNASeq.relay')),
          );

        processStream('EnhancedSCRNASeq.relay', stream.getReader())()
          .then(shapePlotData)
          .catch(error => console.error(error));
      },
    }),
    // withRouter,
    // withPropsOnChange(['entityType, entityId'], ({ entityType, entityId }) => {
    //   return {
    //     variables: {
    //       filters: makeFilter([
    //         {
    //           field: fieldMap[entityType],
    //           value: entityId,
    //         },
    //       ]),
    //     },
    //   };
    // }),
  )((props: Object) => (
    <Component plotsData={props.data} {...props} />
    // <Component plotsData={stubData} {...props} />

    //   <BaseQuery
    //     name="SampleType"
    //     parentProps={props}
    //     variables={props.variables}
    //     Component={Component}
    //     query={graphql`
    //       query SampleType_relayQuery($filters: FiltersArgument) {
    //         repository {
    //           cases {
    //             hits(first: 1, filters: $filters) {
    //               edges {
    //                 node {
    //                   samples {
    //                     hits(first: 1, filters: $filters) {
    //                       edges {
    //                         node {
    //                           sample_type
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     `}
    //   />
    // );
  ));
