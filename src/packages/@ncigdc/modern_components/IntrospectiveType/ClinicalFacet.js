import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  // withState,
  withProps,
} from 'recompose';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme/index';
import { withTheme } from '@ncigdc/theme';
import FacetWrapper from '@ncigdc/components/FacetWrapper';

import { CLINICAL_PREFIXES } from '@ncigdc/utils/constants';
//
// const MAX_VISIBLE_FACETS = 5;
//
// const getPlotType = field => {
//   if (!field || !field.type) {
//     return 'categorical';
//   }
//   if (field.type.name === 'Float') {
//     return 'continuous';
//   } else {
//     return 'categorical';
//   }
// };
//
// const styles = {
//   category: theme => ({
//     color: theme.primary,
//   }),
// };
//
// const FacetToggle = ({ name, style = {}, collapsed, setCollapsed }) => (
//   <Row
//     style={{
//       alignItems: 'center',
//       padding: '0 10px 0 5px',
//       backgroundColor: theme.greyScale6,
//     }}
//   >
//     <h3
//       style={{ ...style, margin: '10px 0', cursor: 'pointer' }}
//       onClick={() => setCollapsed(!collapsed)}
//     >
//       <AngleIcon
//         style={{
//           paddingRight: '0.5rem',
//           transform: `rotate(${collapsed ? 270 : 0}deg)`,
//         }}
//       />
//       {name}
//     </h3>
//   </Row>
// );
//
// const ToggleMoreLink = styled.div({
//   margin: '10px 0 10px  auto',
//   color: ({ theme }) => theme.greyScale7,
//   fontSize: '1.2rem',
//   cursor: 'pointer',
//   ':link': {
//     color: ({ theme }) => theme.greyScale7,
//   },
//   ':visited': {
//     color: ({ theme }) => theme.greyScale7,
//   },
// });
//
// const FacetCheckbox = ({
//   fieldName,
//   dispatch,
//   analysis_id,
//   fieldType,
//   analyses,
//   disabled,
//   plotTypes,
//   checked,
//   toggleAction,
// }) => (
//   <div
//     onClick={() => {
//       if (disabled) {
//         return null;
//       }
//       dispatch(
//         toggleAction({ fieldName, id: analysis_id, fieldType, plotTypes })
//       );
//     }}
//   >
//     <label htmlFor={fieldName}>
//       <Hidden>{fieldName}</Hidden>
//     </label>
//     <input
//       readOnly
//       type="checkbox"
//       style={{
//         pointerEvents: 'none',
//         flexShrink: 0,
//         verticalAlign: 'middle',
//       }}
//       disabled={disabled}
//       name={fieldName}
//       aria-label={fieldName}
//       checked={checked}
//     />
//   </div>
// );

export default compose(
  branch(
    ({ __type, name }) => !__type,
    renderComponent(({ __type, name }) => (
      <div style={{ paddingRight: 10 }}>No fields found.</div>
    ))
  ),
  withProps(({ __type: { fields, name } }) => {
    return fields;
  }),
  withTheme
  // withState('collapsed', 'setCollapsed', false),
  // withState('showingMore', 'setShowingMore', false)
)(({ __type, theme }) => {
  // dispatch, // setCollapsed, // collapsed, // setShowingMore, // showingMore,
  const { name, description, fields } = __type;
  console.log(fields);
  // {description: "", doc_type: "files", field: "analysis.input_files.data_type", full: "files.analysis.input_files.data_type", type: "keyword"}
  return (
    <Column style={{ marginBottom: 2 }}>
      <h3>{name}</h3>
      {fields.map((field, i) => {
        const fieldObj = {
          field: field.name,
          description: field.description,
          full: `${CLINICAL_PREFIXES[__type]}.${field.name}`,
          type: field.type.name,
          doc_type: 'cases',
        };
        return (
          <FacetWrapper
            relayVarName="exploreCaseCustomFacetFields"
            key={fieldObj.full}
            facet={fieldObj}
            title={_.startCase(fieldObj.full.split('.').pop())}
            aggregation={null}
            // aggregation={parsedFacets[fieldObj.field]}
            // relay={relay}
            additionalProps={{ style: { paddingBottom: 0 } }}
            style={{
              position: 'relative',
              paddingLeft: '10px',
            }}
            headerStyle={{ fontSize: '14px' }}
            collapsed={true}
            maxNum={5}
          />
        );
      })}
      {/* <FacetToggle
          name={_.capitalize(name)}
          style={styles.category(theme)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        {!collapsed && (
          <Column
            style={{
              padding: '0 10px',
            }}
          >
            {_.orderBy(whitelistedFields, 'name', 'asc')
              .filter(f => !f.type.fields) // filters out nested, like diagnoses.treatments
              .slice(0, showingMore ? Infinity : MAX_VISIBLE_FACETS)
              .map(field => ({
                fieldDescription: field.description,
                fieldName: `${CLINICAL_PREFIXES[name]}.${field.name}`,
                type: field.type,
                plotTypes: getPlotType(field),
              }))
              .map(({ fieldDescription, fieldName, type, plotTypes }, i) => {
                const checked = Object.keys(currentAnalysis.variables).includes(
                  fieldName
                );
                const toggleAction = checked
                  ? removeClinicalAnalysisVariable
                  : addClinicalAnalysisVariable;
                return (
                  <Row
                    key={i}
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: `1px solid ${theme.greyScale5}`,
                    }}
                  >
                    <Row style={{ alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.4rem' }}>
                        {humanify({
                          term: fieldName.replace(
                            `${CLINICAL_PREFIXES[_.capitalize(name)]}.`,
                            ''
                          ),
                        })}
                      </h4>
                      <Tooltip
                        Component={
                          <div style={{ maxWidth: '24em' }}>
                            {fieldDescription}
                          </div>
                        }
                      >
                        <QuestionIcon
                          style={{
                            color: theme.greyScale7,
                            margin: '10px 5px 10px',
                          }}
                        />
                      </Tooltip>
                    </Row>
                    <FacetCheckbox
                      fieldName={fieldName}
                      analysis_id={analysis_id}
                      fieldType={name}
                      disabled={!type.name}
                      plotTypes={plotTypes}
                      checked={checked}
                      toggleAction={toggleAction}
                      dispatch={dispatch}
                    />
                  </Row>
                );
              })}
            {whitelistedFields.length > MAX_VISIBLE_FACETS && (
              <Row>
                <ToggleMoreLink onClick={() => setShowingMore(!showingMore)}>
                  {showingMore
                    ? 'Less...'
                    : whitelistedFields.length - MAX_VISIBLE_FACETS &&
                      `${whitelistedFields.length - 5} More...`}
                </ToggleMoreLink>
              </Row>
            )}
            {whitelistedFields.length === 0 && <Row>No fields found</Row>}
          </Column>
        )} */}
    </Column>
  );
});
