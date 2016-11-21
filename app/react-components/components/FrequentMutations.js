import React from 'react';
import { compose, withState } from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import BarChart from '../charts/BarChart';
import theme from '../theme';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import SurvivalPlotWrapper from './SurvivalPlotWrapper';
import Button from '../uikit/Button';
import DownloadVisualizationButton from '../components/DownloadVisualizationButton';

const colors = scaleOrdinal(schemeCategory10);

const styles = {
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
};

let FrequentMutations = ({
  frequentMutations,
  numCasesAggByProject,
  project,
  totalNumCases,
  survivalMutation,
  setSurvivalMutation,
  survivalData,
  width,
}) => (
  <Column>
    {!!frequentMutations.length &&
      <div>
        <Row style={{paddingBottom: '2.5rem'}}>
          <span>
            <div style={{textAlign: 'right', marginRight: 50, marginLeft: 30}}>
              <DownloadVisualizationButton
                svg="#mutation-chart svg"
                data={frequentMutations.map(fm => _.omit(fm, 'consequence_type'))}
                slug="bar-chart"
                noText={true}
                tooltipHTML="Download image or data"
              />
            </div>

            <div id="mutation-chart">
              <BarChart
                data={frequentMutations.map(x => ({
                  label: x.genomic_dna_change,
                  value: (x.score),
                  tooltip: project
                    ? `<b>${x.genomic_dna_change}</b><br />
                      ${(x.num_affected_cases_project / numCasesAggByProject[project] * 100).toFixed(2)}%`
                    : `<b>${x.genomic_dna_change}</b><br />
                      ${(x.num_affected_cases_all / totalNumCases * 100).toFixed(2)}%`
                }))}
                margin={{ top: 30, right: 50, bottom: 105, left: 40 }}
                height={250}
                yAxis={{ title: 'Cases' }}
                styles={{
                  xAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                  yAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                  bars: {fill: theme.secondary},
                  tooltips: {
                    fill: '#fff',
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3
                  }
                }}
              />
            </div>
          </span>
          {survivalData && <span style={{flexGrow: 1, width: '50%', minWidth: 500}}>
            <SurvivalPlotWrapper
              rawData={survivalData}
              gene={survivalMutation}
              onReset={() => setSurvivalMutation(null)}
              height={250}
              width={width}
            />
          </span>}
        </Row>

        <EntityPageHorizontalTable
          headings={[
            { key: 'genomic_dna_change', title: 'DNA Change' },
            { key: 'mutation_subtype', title: 'Type' },
            { key: 'consequence_type', title: 'Consequences' },
            ...(project ? [{
              key: 'num_affected_cases_project',
              title: <span># Affected Cases<br />in {project}</span>
            }] : []),
            {
              key: 'num_affected_cases_all',
              title: project
                ? <span># Affected Cases<br />in All Projects</span>
                : <span># Affected Cases</span>,
            },
            {
              title: <i className="fa fa-bar-chart-o"><div style={styles.hidden}>add to survival plot</div></i>,
              key: 'survivalAnalysis',
              onClick: (d) => setSurvivalMutation(survivalMutation && d.survivalId === survivalMutation.survivalId ? null : d),
            },
          ]}
          data={frequentMutations.map(x => ({
            ...x,
            survivalId: x.ssm_id,
            genomic_dna_change: <a href={`/mutations/${x.ssm_id}`}>{x.genomic_dna_change}</a>,
            ...(project ? { num_affected_cases_project:
              `${x.num_affected_cases_project} / ${numCasesAggByProject[project]}
              (${(x.num_affected_cases_project / numCasesAggByProject[project] * 100).toFixed(2)}%)`
            } : {}),
            num_affected_cases_all:
              `${x.num_affected_cases_all} / ${totalNumCases}
              (${(x.num_affected_cases_all / totalNumCases * 100).toFixed(2)}%)`,
            survivalAnalysis: <div style={{ textAlign: 'center' }} ><SurvivalIcon style={{ color: colors(survivalMutation && survivalMutation.survivalId === x.ssm_id ? 1 : 0) }} /></div>,
          }))}
        />
      </div>
    }
    {!frequentMutations.length &&
      <span style={{padding: `2rem`}}>No mutation data to display</span>
    }
  </Column>
);


const enhance = compose(
  withState('survivalMutation', 'setSurvivalMutation', null),
);

export default enhance(FrequentMutations);
