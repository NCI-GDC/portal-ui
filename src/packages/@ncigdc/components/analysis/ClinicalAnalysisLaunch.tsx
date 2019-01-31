import React, { ComponentType } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { theme } from '@ncigdc/theme/index';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DemoButton from './DemoButton';
import Button from '@ncigdc/uikit/Button';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import countComponents from '@ncigdc/modern_components/Counts';
// import { Tooltip } from '@ncigdc/uikit/Tooltip';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

import { TSetTypes } from '@ncigdc/dux/sets';
import { TSelectedSets } from './availableAnalysis';
import { IGroupFilter } from '@ncigdc/utils/filters/types';

interface ICaseDemoSet {
  case: Record<string, string>;
}
interface IDemoData {
  message: string;
  sets: {
    case: ICaseDemoSet;
  };
  filters: IGroupFilter;
  type: string;
}

interface IProps {
  onCancel: () => void;
  onRun: (sets: TSelectedSets) => void;
  type: string;
  label: string;
  Icon: () => React.Component;
  description: string;
  demoData: IDemoData; // fix
  setInstructions: string;
  // setDisabledMessage: (
  //   { sets, type }: { sets: Record<TSetTypes, string>; type: string },
  // ) => boolean | undefined;
  setTypes: string[];
  validateSets: (sets: TSelectedSets) => boolean;
  ResultComponent: () => React.Component;
  sets: Record<TSetTypes, string>;
  // selectedSets: { [K in TSetTypes]: string };
  selectedSet: Record<TSetTypes, string>;
  setSelectedSet: (arg: any) => void; // fix
  configs: IConfig[]; // fix
  selectedConfig: IConfig;
  setSelectedConfig: (config: IConfig) => void;
}

// type TConfigVariables = string[];
// type TConfigName = string;
// type TConfig = Record<TConfigName, TConfigVariables>;

interface IConfig {
  name: string;
  variables: string[];
}

const styles = {
  rowStyle: {
    marginTop: 'auto',
    padding: '1rem 2.5rem 1rem',
    borderBottom: `1px solid ${theme.greyScale5}`,
  },
};

const defaultVariables: string[] = [
  'Ethnicity',
  'Gender',
  'Race',
  'Age at Diagnosis',
  'Cause of Death',
];

const defaultConfig: IConfig = {
  name: 'Default',
  variables: defaultVariables,
};

const enhance = compose(
  connect(({ sets }: any) => ({ sets })),
  withState('selectedSet', 'setSelectedSet', {}),
  withState('selectedConfig', 'setSelectedConfig', defaultConfig)
);

const ClinicalAnalysisLaunch: ComponentType<IProps> = ({
  onCancel,
  onRun,
  type,
  demoData,
  selectedSet,
  validateSets,
  description,
  label,
  Icon,
  sets,
  setTypes,
  setSelectedSet,
  configs = [defaultConfig, { name: 'Foo', variables: ['foo', 'bar'] }],
  selectedConfig,
  setSelectedConfig,
}: IProps) => {
  const cohortHeadings = [
    { key: 'select', title: 'Select' },
    { key: 'name', title: 'Case Set Name' },
    { key: 'count', title: '#Cases', style: { textAlign: 'right' } },
  ];

  const configurationHeadings = [
    { key: 'select', title: 'Select' },
    { key: 'name', title: 'Configuration Name' },
    { key: 'variables', title: 'Variables' },
  ];

  const setArray: any[] = [];
  const setData: any[] = Object.entries(sets)
    .filter(([setType]) => setTypes.includes(setType))
    .map(([setType, mappedSets]) => {
      const CountComponent = countComponents[setType];

      return Object.entries(mappedSets).map(([setId, l]: [string, any]) => {
        const id = `set-table-${setType}-${setId}-select`;
        const checked = Boolean((selectedSet[setType] || {})[setId]);

        return {
          select: (
            <input
              style={{
                marginLeft: 3,
              }}
              id={id}
              type="radio"
              value={setId}
              onChange={e => {
                const targetId = e.target.value;
                const setIdPath = [setType, targetId];
                setSelectedSet(_.set({}, setIdPath, mappedSets[targetId]));
              }}
              checked={checked}
              aria-label={`Select ${name} set`}
            />
          ),
          name: <label htmlFor={id}>{_.truncate(l, { length: 70 })}</label>,
          count: (
            <CountComponent
              filters={{
                op: '=',
                content: {
                  field: `${setType}s.${setType}_id`,
                  value: `set_id:${setId}`,
                },
              }}
            />
          ),
        };
      });
    })
    .reduce((acc, rows) => acc.concat(rows), setArray);

  const configData = configs.map(({ name, variables }) => {
    const checked = selectedConfig.name === name;

    return {
      select: (
        <input
          style={{
            marginLeft: 3,
          }}
          id={name}
          type="radio"
          value={name}
          onChange={e => {
            const configName = e.target.value;
            setSelectedConfig(
              _.find(configs, c => c.name === configName) || defaultConfig
            );
          }}
          checked={checked}
          aria-label={`Select ${name} configuration`}
        />
      ),
      name: <label htmlFor={name}>{_.truncate(name, { length: 70 })}</label>,
      variables:
        variables && variables.length > 1 ? (
          <CollapsibleList
            liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
            toggleStyle={{ fontStyle: 'normal' }}
            data={variables.slice(0).sort()}
            limit={0}
            expandText={`${variables.length} Variables`}
            collapseText="collapse"
          />
        ) : (
          variables[0]
        ),
    };
  });

  return (
    <Column style={{ width: '70%', paddingLeft: '1rem', paddingTop: '2rem' }}>
      <Row
        spacing={'10px'}
        style={{ ...styles.rowStyle, justifyContent: 'space-between' }}
      >
        <Icon />
        <Column>
          <Row>
            <h1 style={{ fontSize: '2rem' }}>{label}</h1>
          </Row>
          <Row>{description}</Row>
        </Column>
        <Column style={{ paddingTop: 5 }}>
          <Row spacing={'5px'}>
            <Button onClick={onCancel}>Back</Button>
            <DemoButton demoData={demoData} type={type} />
          </Row>
        </Column>
      </Row>
      <Row style={styles.rowStyle}>
        <Column style={{ flex: 1 }}>
          <h2 style={{ color: '#c7254e', fontSize: '1.8rem' }}>
            Step 1: Select a cohort
          </h2>
          <div style={{ marginBottom: 15 }}>
            You can create and save case sets from the{' '}
            <ExploreLink>Exploration Page</ExploreLink>.
          </div>

          {setData.length > 0 && (
            <EntityPageHorizontalTable
              data={setData}
              headings={cohortHeadings}
            />
          )}
        </Column>
      </Row>
      <Row style={styles.rowStyle}>
        <Column style={{ flex: 1 }}>
          <h2 style={{ color: '#c7254e', fontSize: '1.8rem' }}>
            Step 2: Select an analysis configuration
          </h2>
          <div style={{ marginBottom: 15 }}>
            You can re-use previously saved analysis configurations.
          </div>
          <EntityPageHorizontalTable
            data={configData}
            headings={configurationHeadings}
          />
        </Column>
      </Row>
      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          disabled={!validateSets(selectedSet)}
          onClick={() => onRun(selectedSet)}
        >
          Run
        </Button>
      </Row>
    </Column>
  );
};

export default enhance(ClinicalAnalysisLaunch);
