import React from 'react';
import { withPropsOnChange, compose } from 'recompose';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import {
  getIds,
  caseMap,
  CASE_ID_FIELDS,
  CASE_ID_FIELD_DISPLAY,
} from '@ncigdc/utils/validateIds';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { theme } from '@ncigdc/theme';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

import Base from './Base';

const enhance = compose(
  Base(),
  withPropsOnChange(['unmatched'], ({ unmatched }) => {
    return {
      unmatched: unmatched.map(hit => ({ submitted: hit })),
    };
  }),
  withPropsOnChange(['matched'], ({ matched }) => {
    const submittedHeaders = [];
    const matchedCases = Object.entries(
      matched.reduce((acc, hit) => {
        const caseId = caseMap[hit].submitter_id.toUpperCase();
        acc[caseId] = (acc[caseId] || []).concat(hit);
        return acc;
      }, {}),
    )
      .map(([caseId, submitted]) => {
        const caseData = caseMap[caseId];
        return {
          submitted: CASE_ID_FIELDS.map((idField, i) => {
            const value =
              getIds(caseData, idField).filter(v =>
                submitted.includes(v.toUpperCase()),
              )[0] || '';

            if (value) submittedHeaders[i] = idField;
            return value;
          }),
          mapped: [caseId, caseMap[caseId].project.project_id],
        };
      })
      .map(row => ({
        ...row,
        submitted: row.submitted.filter((s, i) => submittedHeaders[i]),
      }));

    return {
      matchedCases,
      submittedHeaders: submittedHeaders
        .filter(Boolean)
        .map(h => CASE_ID_FIELD_DISPLAY[h] || h),
    };
  }),
);

export default enhance(
  ({ matched, matchedCases, unmatched, submittedHeaders, ...props }) => {
    const from = matched.length;
    const to = matchedCases.length;

    return (
      <TabbedLinks
        {...props}
        style={{ marginTop: '0.5rem' }}
        queryParam="uploadCaseTab"
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
                  }}
                >
                  <div>
                    {from} submitted case identifier{from > 1 ? 's' : ''}{' '}
                    mapped to{' '}
                    {to} unique GDC case{to > 1 ? 's' : ''}
                  </div>
                  <Button
                    style={{ ...visualizingButton }}
                    disabled={!matchedCases.length}
                    onClick={() =>
                      saveFile(
                        toTsvString(
                          matchedCases.map(item => ({
                            ...item.submitted.reduce((acc, field, i) => {
                              const key = `submitted${submittedHeaders[i]}`;
                              return Object.assign(acc, {
                                [key]: field,
                              });
                            }, {}),
                            mappedCaseId: item.mapped[0],
                            mappedProject: item.mapped[1],
                          })),
                        ),
                        'TSV',
                        `matched-case-list.tsv`,
                      )}
                  >
                    TSV
                  </Button>
                </Row>
                <EntityPageHorizontalTable
                  dividerStyle={{
                    borderLeft: `1px solid ${theme.greyScale3}`,
                  }}
                  data={matchedCases}
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Case Identifier',
                      subheadings: submittedHeaders,
                      thStyle: { textAlign: 'center' },
                    },
                    {
                      key: 'mapped',
                      title: 'Mapped To',
                      subheadings: [
                        CASE_ID_FIELD_DISPLAY.submitter_id,
                        'Project',
                      ],
                      thStyle: { textAlign: 'center' },
                    },
                  ]}
                />
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
                  }}
                >
                  <div>
                    {unmatched.length} submitted case identifier{unmatched.length > 1 ? 's' : ''}{' '}
                    not recognized
                  </div>
                  <Button
                    style={{ ...visualizingButton }}
                    disabled={!unmatched.length}
                    onClick={() =>
                      saveFile(
                        toTsvString(unmatched),
                        'TSV',
                        `unmatched-case-list.tsv`,
                      )}
                  >
                    TSV
                  </Button>
                </Row>
                <EntityPageHorizontalTable
                  data={unmatched}
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Case Identifier',
                      thStyle: { textAlign: 'center' },
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    );
  },
);
