import { isEqual } from 'lodash';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';

import SCRNASeqPlot from './SCRNASeqPlot';
import { buttonList } from './SCRNASeqPlot/utils';
import './styles.scss';
import {
  DownloadButton,
  // ToolbarButton,
} from './toolbar';

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  pure,
  withHandlers({
    handleAnalysisClick: () => {
      console.log('clicked analysis dropdown item');
    },
  }),
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
  handleAnalysisClick,
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
          {/* <ToolbarButton
          //   faClass="fa-angle-double-down"
          //   label="Get TSV"
          //   name="downloadAnalysis"
          //   onToolbarClick={getWholeTsv}
          //  />
          */}

          <DownloadButton
            onAnalysisClick={handleAnalysisClick}
            {...buttonList.downloadAnalysis}
            />
        </Row>
      </Row>
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
  </Row>
);

export default enhance(SCRNASeq);
