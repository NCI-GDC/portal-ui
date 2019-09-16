import React from 'react';
import { VennSvg } from '@ncigdc/components/Charts/Venn';
import CohortComparison from '@ncigdc/modern_components/CohortComparison';
import CCIcon from '@ncigdc/theme/icons/CohortComparisonIcon';
import { withTheme } from '@ncigdc/theme';
import ClinicalDataAnalysis from '@ncigdc/theme/icons/ClinicalDataAnalysis';
import { TSetTypes } from '@ncigdc/dux/sets';
import ClinicalAnalysisContainer from '@ncigdc/modern_components/IntrospectiveType';
import Demo from './Demo';
import SetOperations from './SetOperations';
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
  ResultComponent: ReactComponent<*>,
  validateSets: (TSelectedSets) => boolean,
};

const availableAnalysis: [TAnalysis] = [
  {
    demoData: {
      filters: {
        'demo-bladder-high-muse': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['muse'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-bladder-high-mutect2': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['mutect2'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-bladder-high-varscan': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['varscan'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message:
        'Demo showing high impact mutations overlap in Bladder between Mutect, Varscan and Muse pipelines',
      sets: {
        ssm: {
          'demo-bladder-high-muse': 'Bladder, High impact, Muse',
          'demo-bladder-high-mutect2': 'Bladder, High impact, Mutect2',
          'demo-bladder-high-varscan': 'Bladder, High impact, Varscan',
        },
      },
      type: 'set_operations',
    },
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    Icon: ({ style = {}, ...props }) => (
      <VennSvg
        {...props}
        getFillColor={(d, i) => (
          d.op === 5
          ? 'rgba(38, 166, 166, 0.65)'
          : d.op === 6
          ? 'rgba(235, 233, 46, 0.79)'
          : d.op === 7
          ? 'rgba(175, 58, 215, 0.8)'
          : 'rgba(0,0,0,0)'
        )}
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
        style={{
          width: 80,
          ...style,
        }}
        />
    ),
    label: 'Set Operations',
    ResultComponent: props => {
      const type = [
        'case',
        'gene',
        'ssm',
      ].find(t => props.sets[t]);

      return props.id.includes('demo-')
        ? (
          <Demo {...props}>
            <SetOperations
              message={props.message}
              sets={props.sets[type]}
              type={type}
              />
          </Demo>
        )
        : (
          <SetOperations
            message={props.message}
            sets={props.sets[type]}
            type={type}
            />
        );
    },
    setDisabledMessage: ({ sets, type }) => (
      [
        'case',
        'gene',
        'ssm',
      ].filter(t => t !== type).some(t => sets[t] && Object.keys(sets[t]).length > 0)
        ? 'Please choose only one type'
        : Object.keys(sets[type] || {}).length >= 3
        ? `Please select two or three ${
            type === 'ssm' ? 'mutation' : type
          } sets`
        : null),
    setInstructions: 'Select 2 or 3 of the same set type',
    setTypes: [
      'case',
      'gene',
      'ssm',
    ],
    type: 'set_operations',
    validateSets: sets => {
      const entries = Object.entries(sets);
      return (
        entries.length === 1 && // can only have one type
        // must have 2 or 3 sets selected
        (Object.keys(entries[0][1]).length === 2 ||
          Object.keys(entries[0][1]).length === 3)
      );
    },
  },
  {
    demoData: {
      filters: {
        'demo-pancreas-kras': {
          content: [
            {
              content: {
                field: 'genes.symbol',
                value: ['KRAS'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-pancreas-no-kras': {
          content: [
            {
              content: {
                field: 'genes.symbol',
                value: 'KRAS',
              },
              op: 'excludeifany',
            },
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message:
        'Demo showing cases with pancreatic cancer with and without mutations in the gene KRAS.',
      sets: {
        case: {
          'demo-pancreas-kras': 'Pancreas - KRAS mutated',
          'demo-pancreas-no-kras': 'Pancreas - KRAS not mutated',
        },
      },
      type: 'comparison',
    },
    description: `Display the survival analysis of your case sets and compare
    characteristics such as gender, vital status and age at diagnosis.`,
    Icon: withTheme(({ theme, style = {} }) => (
      <div>
        <CCIcon
          color1="rgb(105, 16, 48)"
          color2={theme.primary}
          height="80px"
          style={style}
          width="80px"
          />
      </div>
    )),
    label: 'Cohort Comparison',
    ResultComponent: props => (props.id.includes('demo-')
      ? (
        <Demo {...props}>
          <CohortComparison message={props.message} sets={props.sets} />
        </Demo>
      )
      : (
        <CohortComparison message={props.message} sets={props.sets} />
      )
    ),
    setDisabledMessage: ({ sets, type }) => (!['case'].includes(type)
        ? 'This analysis can\'t be run with this type'
        : Object.keys(sets[type] || {}).length >= 2
        ? `You can only select two ${type === 'ssm' ? 'mutation' : type} set`
        : null),
    setInstructions: 'Select 2 case sets',
    setTypes: ['case'],
    type: 'comparison',
    validateSets: sets => ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 2),
  },
  {
    demoData: {
      displayVariables: { ...defaultVariables },
      filters: {
        'demo-pancreas': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message: 'Demo showing cases with pancreatic cancer',
      name: 'Demo Clinical Analysis',
      sets: {
        case: {
          'demo-pancreas': 'Pancreas',
        },
      },
      type: 'clinical_data',
    },
    description: 'Display basic statistical analyses for the selected case set.',
    Icon: withTheme(({ theme, style = {} }) => (
      <div>
        <ClinicalDataAnalysis
          style={{
            width: 80,
            height: 80,
            ...style,
          }}
          />
      </div>
    )),
    label: 'Clinical Data Analysis',
    ResultComponent: props => (props.id.includes('demo-')
      ? (
        <Demo {...props}>
          <ClinicalAnalysisContainer typeName="ExploreCases" {...props} />
        </Demo>
      )
      : (
        <ClinicalAnalysisContainer
          typeName="ExploreCases"
          {...props}
          />
      )
    ),
    setInstructions: 'Select a case set',
    setTypes: ['case'],
    type: 'clinical_data',
    validateSets: sets => sets &&
      ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 1),
  },
];

export default availableAnalysis;
