import React from 'react';
import { capitalize } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import ExploreLink, { defaultExploreQuery } from '@ncigdc/components/Links/ExploreLink';
import ManageSetsLink from '@ncigdc/components/Links/ManageSetsLink';
import pluralize from '@ncigdc/utils/pluralize';
import { commaSeparatedList } from '@ncigdc/utils/string';

const headings = setType => [
  {
    key: 'select',
    style: {
      width: '6rem',
    },
    title: 'Select',
  },
  Array.isArray(setType)
    ? {
      key: 'type',
      title: 'Type',
    }
    : {},
  {
    key: 'name',
    title: 'Name',
  },
  {
    key: 'count',
    style: { textAlign: 'right' },
    title: Array.isArray(setType)
      ? 'Items'
      : `# ${pluralize(capitalize(setType))}`,
  },
].filter(heading => Object.keys(heading).length);

const SetTable = ({
  analysisType,
  setInstructions,
  setsData,
  setType,
  step,
  styles,
}) => (
  <Row style={styles.rowStyle}>
    <Column style={{ flex: 1 }}>
      <h2
        style={{
          color: '#c7254e',
          fontSize: '1.8rem',
        }}
        >
        {typeof setInstructions === 'string'
          ? setInstructions
          : `${
            step ? `Step ${step}: ` : ''
          }Select a ${setType} set`}
      </h2>

      <div style={{ marginBottom: 15 }}>
        {`You can create and save ${
          commaSeparatedList(setType, 'oxford').replace('ssm', 'mutation')
          } sets from the `}

        <ExploreLink query={defaultExploreQuery}>Exploration Page</ExploreLink>

        {analysisType === 'gene_expression' && (
          <React.Fragment>
            {', or upload custom ones at the '}
            <ManageSetsLink>Manage Sets Page</ManageSetsLink>
          </React.Fragment>
        )}

        .
      </div>

      {typeof setInstructions === 'object' && (
        <div style={{ marginBottom: 15 }}>
          {setInstructions[setType]}
        </div>
      )}

      {setsData.length > 0
        ? (
          <EntityPageHorizontalTable
            data={setsData}
            headings={headings(setType)}
            />
        )
        : (
          <Row>
            <strong>
              {`You have not saved any${
                Array.isArray(setType) ? '' : ` ${setType}`
                } sets yet`}
            </strong>
          </Row>
        )}
    </Column>
  </Row>
);

export default SetTable;
