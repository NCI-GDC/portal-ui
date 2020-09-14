/* eslint-disable camelcase */
import { isEqual } from 'lodash';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Table, { Tr, Td } from '@ncigdc/uikit/Table';
import Loader from '@ncigdc/uikit/Loaders/Loader';

import SCRNASeqPlot from './SCRNASeqPlot';
import './styles.scss';
import AnalysisDownloadsButton from './AnalysisDownloadsButton';

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  pure,
  withPropsOnChange(
    (
      {
        plotsData,
      },
      {
        plotsData: nextPlotsData,
      },
    ) => !(
      isEqual(plotsData, nextPlotsData)
    ),
    ({ plotsData = {} }) => ({
      plotsDataList: Object.values(plotsData),
    }),
  ),
  withProps(({
    analysisInfo: {
      case_id,
      disease_type,
      primary_site,
      project_id,
      submitter_id,
      workflow_type,
    },
    plotsDataList,
  }) => ({
    analysisTable: [
      {
        link: `/cases/${case_id}`,
        name: 'Case ID',
        text: submitter_id,
      },
      {
        link: `/projects/${project_id}`,
        name: 'Project',
        text: project_id,
      },
      {
        name: 'Primary Site',
        text: primary_site,
      },
      {
        name: 'Disease Type',
        text: disease_type,
      },
      {
        name: 'Workflow Type',
        text: workflow_type,
      },
      {
        name: '# Cells',
        text: plotsDataList[0].data
          .reduce((arr, curr) => arr += curr.x.length, 0),
      },
    ],
  })),
  lifecycle({
    componentDidMount() {
      const {
        getWholeTsv,
        plotsDataList,
      } = this.props;
      plotsDataList.some(plotData => plotData.data.length > 0) || getWholeTsv();
    },
  }),
);

const SCRNASeq = ({
  analysisInfo: { case_id },
  analysisTable,
  loading,
  plotsDataList,
}) => (
  <Row
    style={{
      margin: '10px 0',
      padding: '2rem 3rem',
    }}
    >
    <Column
      style={{
        flex: '1 100%',
      }}
      >
      <Row
        style={{
          borderBottom: '1px solid #ccc',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        >
        <h1
          style={{
            margin: '0 0 10px 0',
          }}
          >
          Single Cell RNA Sequencing
        </h1>

        <Row>
          {loading || (
            <AnalysisDownloadsButton case_id={case_id} />
          )}
        </Row>
      </Row>
      {loading
        ? <Loader loading={loading} style={{ position: 'relative' }} />
        : (
          <Column>
            <Table
              body={(
                <tbody>
                  {analysisTable.map((row, i) => (
                    <Tr index={i} key={row.name}>
                      <Td><strong>{row.name}</strong></Td>
                      <Td>
                        {row.link
                          ? <a href={row.link} target="_blank">{row.text}</a>
                          : row.text}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              )}
              style={{
                marginBottom: 20,
                maxWidth: 500,
              }}
              />
            <div className="scrnaseq-row">
              {plotsDataList.length > 0
                ? plotsDataList.map(plot => (
                  <div
                    className="scrnaseq-column"
                    key={plot.name}
                    >
                    <div className="scrnaseq-card">
                      <SCRNASeqPlot
                        data={plot.data}
                        dataType={plot.name}
                        loading={loading}
                        />
                    </div>
                  </div>
                ))
                : 'No clustering plots available to be displayed'}
            </div>
          </Column>
      )}
    </Column>
  </Row>
);

export default enhance(SCRNASeq);
