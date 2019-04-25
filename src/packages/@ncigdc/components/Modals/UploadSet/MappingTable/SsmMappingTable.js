import React from 'react';
import { withPropsOnChange, compose } from 'recompose';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import {
  getIds,
  ssmMap,
  SSM_ID_FIELDS,
  SSM_ID_FIELD_DISPLAY,
} from '@ncigdc/utils/validateIds';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { theme } from '@ncigdc/theme';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import pluralize from '@ncigdc/utils/pluralize';

import Base from './Base';

const enhance = compose(
  Base(),
  withPropsOnChange(['unmatched'], ({ unmatched }) => {
    return {
      unmatched: unmatched.map(ssm => ({ submitted: ssm })),
    };
  }),
  withPropsOnChange(['matched'], ({ matched }) => {
    const submittedHeaders = [];
    const matchedSsm = Object.entries(
      matched.reduce((acc, ssm) => {
        acc[ssmMap[ssm.toUpperCase()].ssm_id] = (acc[
          ssmMap[ssm.toUpperCase()].ssm_id
        ] || []
        ).concat(ssm);
        return acc;
      }, {}),
    )
      .map(([ssmId, submitted]) => {
        const ssmData = ssmMap[ssmId.toUpperCase()];
        const temp = SSM_ID_FIELDS.map((idField, i) => {
          const value = getIds(ssmData, idField).filter(v => submitted.includes(v.toUpperCase()),)[0];

          if (value) {
            submittedHeaders[i] = idField;
            return value;
          }
          return '';
        });

        return {
          submitted: temp,
          mapped: [ssmId],
        };
      })
      .map(row => ({
        ...row,
        submitted: row.submitted.filter((s, i) => submittedHeaders[i]),
      }));

    return {
      matchedSsm,
      submittedHeaders: submittedHeaders
        .filter(Boolean)
        .map(h => SSM_ID_FIELD_DISPLAY[h]),
    };
  }),
);

export default enhance(
  ({
    matched, matchedSsm, unmatched, submittedHeaders, ...props
  }) => {
    const from = matched.length;
    const to = matchedSsm.length;

    return (
      <TabbedLinks
        {...props}
        links={[
          {
            id: 'matched',
            text: `Matched (${from})`,
            component: (
              <div>
                <Row
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '1rem',
                  }}>
                  <div>
                    {from}
                    {' '}
submitted mutation
                    {pluralize('identifier', from)}
                    {' '}
                    mapped to
                    {' '}
                    {to}
                    {' '}
unique GDC
                    {' '}
                    {pluralize('mutation', to)}
                  </div>
                  <Button
                    disabled={!matchedSsm.length}
                    onClick={() => saveFile(
                      toTsvString(
                        matchedSsm.map(item => ({
                          ...item.submitted.reduce(
                            (acc, field, i) => Object.assign(acc, {
                              [`submitted${submittedHeaders[i]}`]: field,
                            }),
                            {},
                          ),
                          mappedSsmId: item.mapped[0],
                        })),
                      ),
                      'TSV',
                      'matched-mutation-list.tsv',
                    )}
                    style={{ ...visualizingButton }}>
                    TSV
                  </Button>
                </Row>
                <EntityPageHorizontalTable
                  data={matchedSsm}
                  dividerStyle={{
                    borderLeft: `1px solid ${theme.greyScale3}`,
                  }}
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Mutation Identifier',
                      subheadings: submittedHeaders,
                      thStyle: { textAlign: 'center' },
                    },
                    {
                      key: 'mapped',
                      title: 'Mapped To',
                      subheadings: ['GDC Mutation ID'],
                      thStyle: { textAlign: 'center' },
                    },
                  ]} />
              </div>
            ),
          },
          {
            id: 'unmatched',
            text: `Unmatched (${unmatched.length})`,
            component: (
              <div>
                <Row
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '1rem',
                  }}>
                  <div>
                    {unmatched.length}
                    {' '}
submitted mutation
                    {' '}
                    {pluralize('identifier', unmatched.length)}
                    {' '}
not recognized
                  </div>
                  <Button
                    disabled={!unmatched.length}
                    onClick={() => saveFile(
                      toTsvString(unmatched),
                      'TSV',
                      'unmatched-mutation-list.tsv',
                    )}
                    style={{ ...visualizingButton }}>
                    TSV
                  </Button>
                </Row>
                <EntityPageHorizontalTable
                  data={unmatched}
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Mutation Identifier',
                      thStyle: { textAlign: 'center' },
                    },
                  ]} />
              </div>
            ),
          },
        ]}
        queryParam="uploadSsmTab" />
    );
  },
);
