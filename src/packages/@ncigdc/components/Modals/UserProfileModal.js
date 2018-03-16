// @flow
import React from 'react';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Hidden from '@ncigdc/components/Hidden';
import { withTheme } from '@ncigdc/theme';
import Check from '@ncigdc/theme/icons/Check';
import { Row } from '@ncigdc/uikit/Flex';
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
      Object.keys(gdc_ids).reduce(
        (acc, projectId) => [...acc, ...gdc_ids[projectId]],
        [],
      ),
    ),
  ];

  const data = Object.keys(gdc_ids).map((projectId, i) => ({
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
      title={`Username: ${username}`}
      closeText="Done"
      contentStyle={{ padding: 0 }}
    >
      <div
        style={{
          overflow: 'auto',
          // calc instead of using flex because IE11 doesn't handle flex + max-height properly
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        <Row style={{ justifyContent: 'center' }}>
          <EntityPageHorizontalTable
            emptyMessage={'User has no projects'}
            headings={[
              { key: 'projectId', title: 'Project ID' },
              ...allValues.map(v => ({ key: v, title: v })),
            ]}
            style={{ width: '100%' }}
            data={data}
          />
        </Row>
      </div>
    </BaseModal>
  );
};

export default enhance(UserProfileModal);
