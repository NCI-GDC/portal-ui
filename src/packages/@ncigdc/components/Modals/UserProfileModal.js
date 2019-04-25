// @flow
import React from 'react';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Hidden from '@ncigdc/components/Hidden';
import { withTheme } from '@ncigdc/theme';
import Check from '@ncigdc/theme/icons/Check';
import { Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(
  connect(({ auth: { user } }) => ({ user })),
  withTheme,
  withRouter,
);

const UserProfileModal = ({
  user: { username, projects },
  theme,
  push,
  query,
}) => {
  const { gdc_ids } = projects;

  const allValues = [
    ...new Set(
      gdc_ids && Object.keys(gdc_ids).reduce(
        (acc, projectId) => [...acc, ...gdc_ids[projectId]],
        [],
      ),
    ),
  ];

  const data = gdc_ids && Object.keys(gdc_ids).map((projectId, i) => ({
    projectId,
    ...allValues.reduce(
      (acc, v) => ({
        ...acc,
        [v]: gdc_ids[projectId].includes(v) ? (
          <span>
            <Check />
            <Hidden>True</Hidden>
          </span>
        ) : (
          <Hidden>False</Hidden>
        ),
      }),
      {},
    ),
  }));
  return (
    <BaseModal
      closeText="Done"
      contentStyle={{ padding: 0 }}
      title={`Username: ${username}`}>
      <div
        style={{
          overflow: 'auto',
          // calc instead of using flex because IE11 doesn't handle flex + max-height properly
          maxHeight: 'calc(100vh - 200px)',
        }}>
        <Column style={{ alignContent: 'center' }}>
          {data
            ? (
              <EntityPageHorizontalTable
                data={data}
                emptyMessage="User has no projects"
                headings={[
                  {
                    key: 'projectId',
                    title: 'Project ID',
                  },
                  ...allValues.map(v => ({
                    key: v,
                    title: v,
                  })),
                ]}
                style={{
                  padding: '2rem',
                  width: '100%',
                }} />
)
            : (
              <React.Fragment>
                {/* TODO Turn this into a proper styled component (message pannel?) */}
                <p style={{ padding: '2rem 2rem 0' }}>
                  You do not have any access to controlled access data for projects available in the GDC Data Portal.
                </p>
                <p style={{ padding: '0 2rem 1rem' }}>
For instructions on
                  <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data" target="_blank">how to apply for access to controlled data</a>
, please visit our documentation on how to apply for access through dbGAP.
                </p>
              </React.Fragment>
)}
        </Column>
      </div>
    </BaseModal>
  );
};

export default enhance(UserProfileModal);
