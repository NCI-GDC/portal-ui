import {
  capitalize,
  get,
  isEqual,
  omit,
  set,
  truncate,
} from 'lodash';
import countComponents from '@ncigdc/modern_components/Counts';
import Chip from '@ncigdc/uikit/Chip';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { theme } from '@ncigdc/theme/index';
import DemoButton from './DemoButton';
import SetTable from './SetTable';
import ValidationResults from './geneExpression/ValidationResults';

export const styles = {
  rowStyle: {
    borderBottom: `1px solid ${theme.greyScale5}`,
    marginTop: 'auto',
    maxWidth: 1100,
    padding: '1rem 2.5rem 1rem',
  },
};

const SelectSet = ({
  analysisProps: {
    demoData,
    description,
    Icon,
    introText = '',
    isBeta,
    label,
    setInstructions,
    setTypes,
    type,
  },
  checkDataHandler,
  isClinical,
  isGeneExpression,
  isReadyToRun,
  isReadyToValidate,
  onCancel,
  runHandler,
  setsData,
  validationResults,
}) => (
  <Column
    style={{
      paddingLeft: '1rem',
      paddingTop: '2rem',
      width: '70%',
    }}
    >
    <Row
      spacing="10px"
      style={{
        ...styles.rowStyle,
        justifyContent: 'space-between',
      }}
      >
      <Icon />
      <Column style={{ flex: 1 }}>
        <h1
          style={{
            alignItems: 'center',
            display: 'flex',
            fontSize: '2rem',
          }}
          >
          {label}

          {isBeta && (
            <Chip
              label="BETA"
              style={{
                marginLeft: '0.5rem',
              }}
              />
          )}
        </h1>
        {introText || description}
      </Column>
      <Column style={{ paddingTop: 5 }}>
        <Row spacing="5px">
          <Button onClick={onCancel}>Back</Button>
          <DemoButton demoData={demoData} type={type} />
        </Row>
      </Column>
    </Row>

    {isGeneExpression
      ? setTypes
        .map((setType, typeStep) => (
          <SetTable
            analysisType={type}
            key={setType}
            setInstructions={setInstructions}
            setsData={setsData(setType)}
            setType={setType}
            step={typeStep + 1}
            styles={styles}
            />
        ))
        .concat(
          <ValidationResults
            key="validation"
            styles={styles}
            validationResults={validationResults}
            />,
        )
      : (
        <SetTable
          isClinical={isClinical}
          setInstructions={setInstructions}
          setsData={setsData()}
          setType={setTypes.length > 1 ? setTypes : setTypes[0]}
          styles={styles}
          />
      )}

    <Row
      style={{
        ...styles.rowStyle,
        border: 'none',
        justifyContent: 'flex-end',
      }}
      >
      {isGeneExpression && (
        <Button
          disabled={!isReadyToValidate}
          onClick={checkDataHandler}
          style={{
            marginRight: 5,
          }}
          >
          Check Data
        </Button>
      )}
      <Button
        disabled={!isReadyToRun}
        onClick={runHandler}
        >
        Run
      </Button>
    </Row>
  </Column>
);

export default compose(
  setDisplayName('EnhancedSelectSet'),
  connect(({ sets = {} }) => ({ sets })),
  withState('selectedSets', 'setSelectedSets', {}),
  withState('validationData', 'setValidationData', {}),
  withProps(({
    analysisProps: {
      type,
    },
  }) => ({
    isClinical: type === 'clinical_data',
    isGeneExpression: type === 'gene_expression',
  })),
  withPropsOnChange(
    (
      {
        selectedSets,
        validationData,
      },
      {
        selectedSets: nextSelectedSets,
        validationData: nextValidationData,
      },
    ) => !(
      isEqual(selectedSets, nextSelectedSets) &&
      isEqual(validationData === nextValidationData)
    ),
    ({
      analysisProps: {
        validateSets,
      },
      isGeneExpression,
      selectedSets,
      validationData,
    }) => {
      if (isGeneExpression) {
        const selectedSetsGroupName = Object.keys(selectedSets).length === 2
          ? ['case', 'gene']
            .map(setType =>
              Object.keys(selectedSets[setType])
                .reduce((acc, selectedSet) => acc.concat(selectedSet).join('-')), [])
            .join('--')
          : '';
        const enoughSetsSelected = validateSets.quantity(selectedSets);
        const validationResults = validationData[selectedSetsGroupName];

        return {
          isReadyToRun: validationResults &&
            ['ready'].includes(validationResults.status) &&
            enoughSetsSelected,
          isReadyToValidate: !validationResults && enoughSetsSelected,
          selectedSetsGroupName,
          validationResults,
        };
      }

      return {
        isReadyToRun: validateSets(selectedSets),
      };
    },
  ),
  withHandlers({
    checkDataHandler: ({
      analysisProps: {
        validateSets: {
          availability,
        },
      },
      selectedSets,
      selectedSetsGroupName,
      setValidationData,
    }) => async event => {
      const availabilityResults = await availability(selectedSets);

      setValidationData(previousValidationResults => ({
        ...previousValidationResults,
        [selectedSetsGroupName]: availabilityResults,
      }));
    },
    runHandler: ({
      onRun,
      selectedSets,
    }) => event => onRun(selectedSets),
    setsData: ({
      analysisProps: {
        setDisabledMessage = () => {},
        setTypes,
      },
      isClinical,
      isGeneExpression,
      selectedSets,
      sets,
      setSelectedSets,
    }) => specificType => Object.entries(sets)
      .filter(([setType]) => (
        specificType
          ? setType === specificType
          : setTypes.includes(setType)
      ))
      .map(([setType, mappedSets]) => {
        const CountComponent = countComponents[setType];

        return Object.entries(mappedSets)
          .map(([setId, l]: [string, any]) => {
            const id = `set-table-${setType}-${setId}-select`;
            const checked = get(selectedSets, `${setType}.${setId}`, false);
            const msg = !checked && setDisabledMessage({
              sets: selectedSets,
              type: setType,
            });

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
                  />
              ),
              name: <label htmlFor={id}>{truncate(l, { length: 70 })}</label>,
              select: (
                <Tooltip
                  Component={msg}
                  style={{
                    cursor: msg ? 'not-allowed' : 'initial',
                  }}
                  >
                  <input
                    checked={checked}
                    disabled={msg}
                    id={id}
                    onChange={({ target }) => {
                      const targetId = target.value;
                      const setIdPath = [setType, targetId];

                      setSelectedSets(
                        isClinical || isGeneExpression //  for radio buttons
                          ? set( // switch the radio button
                            omit({ ...selectedSets }, setType), // keep only the sets of other types
                            setIdPath,
                            mappedSets[targetId], // then add the one selected set
                          )
                          : get(selectedSets, setIdPath) // for checkboxes
                            // is it checked?
                            ? Object.keys(omit({ ...selectedSets[setType] }, setIdPath)).length
                              // if it is not the only set of its type
                              ? { // remove the selected set
                                ...selectedSets,
                                [setType]: omit({ ...selectedSets[setType] }, setIdPath),
                              }
                              // else, remove the empty set type
                              : omit({ ...selectedSets }, setType)
                            // else, check it
                            : set(
                              { ...selectedSets },
                              setIdPath,
                              mappedSets[targetId],
                            ),
                      );
                    }}
                    style={{
                      marginLeft: 3,
                      pointerEvents: msg ? 'none' : 'initial',
                    }}
                    type={isClinical || isGeneExpression ? 'radio' : 'checkbox'}
                    value={setId}
                    />
                </Tooltip>
              ),
              type: capitalize(setType === 'ssm' ? 'mutations' : `${setType}s`),
            };
          });
      })
      .reduce((acc, rows) => acc.concat(rows), []),
  }),
  pure,
)(SelectSet);
