import React from 'react';

import { compose, mapProps, branch, renderComponent } from 'recompose';
import { head } from 'lodash';

import withRouter from '@ncigdc/utils/withRouter';
import styled from '@ncigdc/theme/styled';

import { SLIDE_IMAGE_ENDPOINT } from '@ncigdc/utils/constants';
import { Row, Column } from '@ncigdc/uikit/Flex';
import ZoomableImage from '@ncigdc/components/ZoomableImage';
import Link from '@ncigdc/components/Links/Link';
import { withTheme } from '@ncigdc/theme';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';

const ThumbnailLink = styled(Link, {
  color: ({ theme }) => theme.greyScale1,
  padding: '0 1rem 1rem 1rem',
  textDecoration: 'none',
  ':link': {
    textDecoration: 'none',
    color: ({ theme }) => theme.greyScale1,
    fontSize: '1rem',
  },
  ':hover': {
    backgroundColor: ({ theme }) => theme.greyScale4,
    fontSize: '1rem',
  },
});

export default compose(
  withRouter,
  withTheme,
  branch(
    ({ slides }) => slides.length === 0,
    renderComponent(() => (
      <Row style={{ padding: '1rem' }}>
        No slides associated with this case.
      </Row>
    )),
  ),
  mapProps(({ slides, ...rest }) => ({
    fullSlideIds: slides.map(
      ({ submitter_id, slide_id }) => `${submitter_id}.${slide_id}`,
    ),
    slides,
    ...rest,
  })),
  mapProps(({ fullSlideIds, query, ...rest }) => ({
    selectedId:
      query.selectedId && fullSlideIds.includes(query.selectedId)
        ? query.selectedId
        : null,
    ...rest,
  })),
)(({ slides, query, selectedId, theme }) => {
  const selectedOrFirstId =
    selectedId || `${head(slides).submitter_id}.${head(slides).slide_id}`;
  const selectedOrFirstSlide = slides.find(
    ({ submitter_id, slide_id }) =>
      `${submitter_id}.${slide_id}` === selectedOrFirstId,
  );
  return (
    <Row>
      <Column
        style={{
          width: '250px',
          padding: '1rem 1rem 1rem 1rem',
        }}
      >
        {slides.map(({ submitter_id, slide_id }) => (
          <Column key={`${submitter_id}.${slide_id}`}>
            <ThumbnailLink
              merge
              query={{ selectedId: `${submitter_id}.${slide_id}` }}
              style={{
                ...{ marginBottom: '1.5rem' },
                ...(selectedOrFirstId === `${submitter_id}.${slide_id}`
                  ? { backgroundColor: theme.secondary, color: theme.white }
                  : {}),
              }}
            >
              {submitter_id}
              <img
                alt={`thumbnail of ${submitter_id}`}
                src={`${SLIDE_IMAGE_ENDPOINT}/${submitter_id}.${slide_id}_files/8/0_0.png`}
                style={{ maxWidth: '200px' }}
              />
            </ThumbnailLink>
          </Column>
        ))}
      </Column>
      <Column style={{ width: '100%' }}>
        <Row>
          <ZoomableImage
            imageUrl={`${SLIDE_IMAGE_ENDPOINT}/${selectedOrFirstId}.dzi`}
          />
        </Row>
        <Row style={{ justifyContent: 'flex-end', padding: '1rem' }}>
          <Tooltip
            Component={
              <EntityPageVerticalTable
                thToTd={[
                  ...Object.entries(
                    selectedOrFirstSlide,
                  ).map(([key, value]) => ({
                    th: key,
                    td: value,
                  })),
                ]}
              />
            }
          >
            <Button>Details</Button>
          </Tooltip>
        </Row>
      </Column>
    </Row>
  );
});
