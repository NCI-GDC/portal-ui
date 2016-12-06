import React from 'react';
import { compose, withState } from 'recompose';
import _ from 'lodash';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import BarChart from '../charts/BarChart';
import theme from '../theme';
import { clickable } from '../theme/mixins';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import SurvivalPlotWrapper from './SurvivalPlotWrapper';
import TogglableUl from '../uikit/TogglableUl';
import Button from '../uikit/Button';
import Tooltip from '../uikit/Tooltip';
import DownloadVisualizationButton from '../components/DownloadVisualizationButton';

let impactBubble = {
  color: 'white',
  padding: '2px 5px',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: 'bold',
  display: 'inline-block',
  width: '20px',
}

let impactColors = {
  HIGH: 'rgb(185, 36, 36)',
  MODERATE: 'rgb(193, 158, 54)',
  LOW: 'rgb(49, 161, 60)',
};

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
  impact: {
    HIGH: {
      ...impactBubble,
      backgroundColor: impactColors.HIGH,
    },
    MODERATE: {
      ...impactBubble,
      backgroundColor: impactColors.MODERATE,
    },
    LOW: {
      ...impactBubble,
      backgroundColor: impactColors.LOW,
    },
  }
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
}) => {
  return (
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

              <div id="mutation-chart" style={{ padding:'10px' }}>
                <BarChart
                  data={frequentMutations.map(x => ({
                    label: x.genomic_dna_change,
                    value: (x.score),
                    tooltip: project
                      ? `<b>${x.genomic_dna_change}</b><br />
                        <b>${x.num_affected_cases_project} cases affected in ${project}</b><br />
                        <b>${x.num_affected_cases_project} / ${numCasesAggByProject[project]} (${(x.num_affected_cases_project / numCasesAggByProject[project] * 100).toFixed(2)}%)</b>`
                      : `<b>${x.genomic_dna_change}</b><br />
                        <b>${x.num_affected_cases_all} cases affected in all projects</b><br />
                        <b>${x.num_affected_cases_all} / ${totalNumCases} (${(x.num_affected_cases_all / totalNumCases * 100).toFixed(2)}%)`,
                    href: `mutations/${x.ssm_id}`
                  }))}
                  margin={{ top: 30, right: 50, bottom: 105, left: 40 }}
                  height={250}
                  title="Distribution of Most Frequent Mutations"
                  yAxis={{ title: '# Affected Cases' }}
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
                title: <span># Affected Cases<br />in {numCasesAggByProject[project]} {project} Cases</span>
              }] : []),
              {
                key: 'num_affected_cases_all',
                title: project
                  ? <span># Affected Cases<br />in {totalNumCases} from All Projects</span>
                  : <span># Affected Casesin {totalNumCases}</span>,
              },
              {
                key: 'impact',
                title: 'Impact',
                style: { textAlign: 'center' },
              },
              {
                title: <span className="fa fa-bar-chart-o"><div style={styles.hidden}>add to survival plot</div></span>,
                key: 'survival_plot',
              },
            ]}
            data={frequentMutations.map(x => ({
              ...x,
              survivalId: '',
              genomic_dna_change: <a href={`/mutations/${x.ssm_id}`}>{x.genomic_dna_change}</a>,
              ...(project ? { num_affected_cases_project:
                `${x.num_affected_cases_project}
                (${(x.num_affected_cases_project / numCasesAggByProject[project] * 100).toFixed(2)}%)`
              } : {}),
              num_affected_cases_all:
                <TogglableUl
                  items={[
                    `${x.num_affected_cases_all} (${(x.num_affected_cases_all / totalNumCases * 100).toFixed(2)}%)`,
                    ...Object.entries(x.num_affected_cases_by_project)
                      .map(([k, v]) => `${k}: ${v} (${(v / totalNumCases * 100).toFixed(2)}%)`)
                  ]}
                />,
              impact: !['LOW', 'MODERATE', 'HIGH'].includes(x.impact) ? null :
                <Tooltip innerHTML={x.impact}>
                  <span
                    style={styles.impact[x.impact]}
                  >
                    {x.impact.slice(0, 1)}
                  </span>
                </Tooltip>,
              survival_plot:
                <Tooltip innerHTML={`Add ${x.genomic_dna_change} to surival plot`}>
                  <span
                    onClick={setSurvivalMutation}
                  >
                    <span className={`fa fa-bar-chart-o ${clickable}`}>
                      <div style={styles.hidden}>add to survival plot</div>
                    </span>
                  </span>
                </Tooltip>
            }))}
          />
        </div>
      }
      {!frequentMutations.length &&
        <span style={{padding: `2rem`}}>No mutation data to display</span>
      }
    </Column>
  );
}


const enhance = compose(
  withState('survivalMutation', 'setSurvivalMutation', null),
);

export default enhance(FrequentMutations);
