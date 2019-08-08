import React from 'react';
import { VennSvg } from '@ncigdc/components/Charts/Venn';
import SetOperations from './SetOperations';
import CohortComparison from '@ncigdc/modern_components/CohortComparison';
import CCIcon from '@ncigdc/theme/icons/CohortComparisonIcon';
import { withTheme } from '@ncigdc/theme';
import { TSetTypes } from '@ncigdc/dux/sets';
import Demo from './Demo';
import ClinicalDataAnalysis from '@ncigdc/theme/icons/ClinicalDataAnalysis';
import { DISPLAY_CDAVE } from '@ncigdc/utils/constants';
import ClinicalAnalysisContainer from '@ncigdc/modern_components/IntrospectiveType';
import defaultVariables from './defaultCDAVEvariables';

export type TSelectedSets = {
  [TSetTypes]: any,
};

type TAnalysis = {
  type: string,
  title: string,
  Icon: ReactComponent<*>,
  description: string,
  demoData: {
    sets: TSelectedSets,
    filters: {},
    type: string,
  },
  setInstructions: string,
  setDisabledMessage: (opts: { sets: TSelectedSets, type: string }) => ?string,
  setTypes: Array<string>,
  validateSets: TSelectedSets => boolean,
  ResultComponent: ReactComponent<*>,
};

const availableAnalysis: [TAnalysis] = [
  {
    type: 'set_operations',
    label: 'Set Operations',
    Icon: ({ style = {}, ...p }) => (
      <VennSvg
        {...p}
        style={{ width: 80, ...style }}
        numCircles={3}
        ops={[
          { op: 1 },
          { op: 2 },
          { op: 3 },
          { op: 4 },
          { op: 5 },
          { op: 6 },
          { op: 7 },
        ]}
        outlineColour="rgba(46, 90, 164, 0.62)"
        getFillColor={(d, i) => {
          if (d.op === 5) {
            return 'rgba(38, 166, 166, 0.65)';
          }
          if (d.op === 6) {
            return 'rgba(235, 233, 46, 0.79)';
          }
          if (d.op === 7) {
            return 'rgba(175, 58, 215, 0.8)';
          }
          return 'rgba(0,0,0,0)';
        }}
      />
    ),
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    demoData: {
      message:
        'Demo showing high impact mutations overlap in Bladder between Mutect, Varscan and Muse pipelines',
      sets: {
        ssm: {
          'demo-bladder-high-mutect2': 'Bladder, High impact, Mutect2',
          'demo-bladder-high-varscan': 'Bladder, High impact, Varscan',
          'demo-bladder-high-muse': 'Bladder, High impact, Muse',
        },
      },
      filters: {
        'demo-bladder-high-mutect2': {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'cases.primary_site', value: ['Bladder'] },
            },
            {
              op: 'in',
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
            },
            {
              op: 'in',
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['mutect2'],
              },
            },
          ],
        },
        'demo-bladder-high-varscan': {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'cases.primary_site', value: ['Bladder'] },
            },
            {
              op: 'in',
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
            },
            {
              op: 'in',
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['varscan'],
              },
            },
          ],
        },
        'demo-bladder-high-muse': {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'cases.primary_site', value: ['Bladder'] },
            },
            {
              op: 'in',
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
            },
            {
              op: 'in',
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['muse'],
              },
            },
          ],
        },
      },
      type: 'set_operations',
    },
    setInstructions: 'Select 2 or 3 of the same set type',
    setDisabledMessage: ({ sets, type }) =>
      ['case', 'gene', 'ssm'].filter(t => t !== type).some(t => sets[t])
        ? 'Please choose only one type'
        : Object.keys(sets[type] || {}).length >= 3
        ? `Please select two or three ${
            type === 'ssm' ? 'mutation' : type
          } sets`
        : null,
    setTypes: ['case', 'gene', 'ssm'],
    validateSets: sets => {
      const entries = Object.entries(sets);
      return (
        entries.length === 1 && // can only have one type
        // must have 2 or 3 sets selected
        (Object.keys(entries[0][1]).length === 2 ||
          Object.keys(entries[0][1]).length === 3)
      );
    },
    ResultComponent: props => {
      const type = ['case', 'gene', 'ssm'].find(t => props.sets[t]);

      return props.id.includes('demo-') ? (
        <Demo {...props}>
          <SetOperations
            type={type}
            sets={props.sets[type]}
            message={props.message}
          />
        </Demo>
      ) : (
        <SetOperations
          type={type}
          sets={props.sets[type]}
          message={props.message}
        />
      );
    },
  },
  {
    type: 'comparison',
    label: 'Cohort Comparison',
    Icon: withTheme(({ theme, style = {} }) => (
      <div>
        <CCIcon
          width="80px"
          height="80px"
          color1="rgb(105, 16, 48)"
          color2={theme.primary}
          style={style}
        />
      </div>
    )),
    description: `Display the survival analysis of your case sets and compare
    characteristics such as gender, vital status and age at diagnosis.`,
    demoData: {
      message:
        'Demo showing cases with pancreatic cancer with and without mutations in the gene KRAS.',
      sets: {
        case: {
          'demo-pancreas-kras': 'Pancreas - KRAS mutated',
          'demo-pancreas-no-kras': 'Pancreas - KRAS not mutated',
        },
      },
      filters: {
        'demo-pancreas-kras': {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'genes.symbol', value: ['KRAS'] },
            },
            {
              op: 'in',
              content: { field: 'cases.primary_site', value: ['Pancreas'] },
            },
          ],
        },
        'demo-pancreas-no-kras': {
          op: 'and',
          content: [
            {
              op: 'excludeifany',
              content: { field: 'genes.symbol', value: 'KRAS' },
            },
            {
              op: 'in',
              content: { field: 'cases.primary_site', value: ['Pancreas'] },
            },
          ],
        },
      },
      type: 'comparison',
    },
    setInstructions: 'Select 2 case sets',
    setDisabledMessage: ({ sets, type }) =>
      !['case'].includes(type)
        ? "This analysis can't be run with this type"
        : Object.keys(sets[type] || {}).length >= 2
        ? `You can only select two ${type === 'ssm' ? 'mutation' : type} set`
        : null,
    setTypes: ['case'],
    validateSets: sets =>
      ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 2),
    ResultComponent: props =>
      props.id.includes('demo-') ? (
        <Demo {...props}>
          <CohortComparison sets={props.sets} message={props.message} />
        </Demo>
      ) : (
        <CohortComparison sets={props.sets} message={props.message} />
      ),
  },
  ...(DISPLAY_CDAVE && [
    {
      type: 'clinical_data',
      label: 'Clinical Data Analysis',
      Icon: withTheme(({ theme, style = {} }) => (
        <div>
          <ClinicalDataAnalysis style={{ width: 80, height: 80, ...style }} />
        </div>
      )),
      description: `Display basic statistical analyses for your case set using data variables and configurations that you select as input.`,
      demoData: {
        message: 'Demo showing cases with pancreatic cancer',
        sets: {
          case: {
            'demo-pancreas': 'Pancreas',
          },
        },
        filters: {
          'demo-pancreas': {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'cases.primary_site', value: ['Pancreas'] },
              },
            ],
          },
        },
        type: 'clinical_data',
        displayVariables: { ...defaultVariables },
        name: 'Demo Clinical Analysis',
      },
      setInstructions: 'Set instructions',
      setTypes: ['case'],
      validateSets: sets =>
        sets &&
        ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 1),
      ResultComponent: props => {
        return props.id.includes('demo-') ? (
          <Demo {...props}>
            <ClinicalAnalysisContainer typeName={'ExploreCases'} {...props} />
          </Demo>
        ) : (
          <ClinicalAnalysisContainer typeName={'ExploreCases'} {...props} />
        );
      },
    },
  ]),
];

export default availableAnalysis;
