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
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';

import './styles.css';

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
    fullSlideIds: slides.map(slide => slide.file_id),
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
  const selectedOrFirstId = selectedId || head(slides).file_id;
  const selectedOrFirstSlide = slides.find(
    ({ file_id }) => file_id === selectedOrFirstId,
  );
  return (
    <Row>
      <Column
        style={{
          width: '250px',
          padding: '1rem 1rem 1rem 1rem',
        }}
      >
        {slides.map(({ file_id, submitter_id }) => (
          <Column key={file_id}>
            <ThumbnailLink
              merge
              query={{ selectedId: file_id }}
              style={{
                ...{ marginBottom: '1.5rem' },
                ...(selectedOrFirstId === file_id
                  ? {
                      backgroundColor: theme.secondary,
                      color: theme.white,
                    }
                  : {}),
              }}
            >
              <Row>{submitter_id}</Row>
              <img
                alt={`thumbnail of ${submitter_id}`}
                src={`${SLIDE_IMAGE_ENDPOINT}${file_id}?level=7&x=0&y=0`}
                style={{ maxWidth: '200px' }}
              />
            </ThumbnailLink>
          </Column>
        ))}
      </Column>
      <Column style={{ width: '100%' }}>
        <Row>
          <ZoomableImage imageId={selectedOrFirstId} />
        </Row>
        <Row style={{ justifyContent: 'flex-end', padding: '1rem' }}>
          <div id="details-button">
            <Dropdown
              style={{
                margin: 0,
                border: 'none',
                display: 'block',
              }}
              dropdownStyle={{
                marginTop: '15px',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
              }}
              button={
                <div
                  style={{
                    background: theme.primary,
                    color: 'white',
                    padding: '3px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Details
                </div>
              }
            >
              <div
                className="details-container"
                style={{
                  position: 'absolute',
                  padding: '5px',
                  background: 'white',
                  border: `1px solid ${theme.greyScale4}`,
                }}
              >
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
              </div>
            </Dropdown>
          </div>
        </Row>
      </Column>
    </Row>
  );
});
