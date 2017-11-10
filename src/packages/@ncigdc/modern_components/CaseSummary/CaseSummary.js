import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { makeFilter } from '@ncigdc/utils/filters';
import CountCard from '@ncigdc/components/CountCard';
import FileIcon from '@ncigdc/theme/icons/File';
import AnnotationIcon from '@ncigdc/theme/icons/Edit';
import { withTheme } from '@ncigdc/theme';
import ImageViewerLink from '@ncigdc/components/Links/ImageViewerLink';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import { RepositorySlideCount } from '@ncigdc/modern_components/Counts';
import { MicroscopeIcon } from '@ncigdc/theme/icons';
import { iconButton } from '@ncigdc/theme/mixins';

const styles = {
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
};

const getAnnotationsLinkParams = annotations => {
  if (annotations.total === 1) {
    return {
      pathname: `/annotations/${annotations.edges[0].node.annotation_id}`,
    };
  } else if (annotations.total > 1) {
    return {
      pathname: '/annotations',
      query: {
        filters: makeFilter([
          {
            field: 'annotations.annotation_id',
            value: annotations.edges.map(
              ({ node: annotation }) => annotation.annotation_id,
            ),
          },
        ]),
      },
    };
  }

  return null;
};

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
  withTheme,
)(({ theme, viewer: { repository: { cases: { hits: { edges } } } } }) => {
  const p = edges[0].node;
  const totalFiles = p.files.hits.total;

  return (
    <Row spacing={theme.spacing}>
      <EntityPageVerticalTable
        id="summary"
        title={
          <span>
            <i className="fa fa-table" /> Summary
          </span>
        }
        thToTd={[
          { th: 'Case UUID', td: p.case_id },
          { th: 'Case ID', td: p.submitter_id },
          {
            th: 'Project',
            td: (
              <ProjectLink uuid={p.project.project_id}>
                {p.project.project_id}
              </ProjectLink>
            ),
          },
          { th: 'Project Name', td: p.project.name },
          { th: 'Disease Type', td: p.disease_type },
          { th: 'Program', td: p.project.program.name },
          { th: 'Primary Site', td: p.primary_site },
          {
            th: 'Images',
            td: (
              <RepositorySlideCount
                filters={makeFilter([
                  { field: 'cases.case_id', value: p.case_id },
                ])}
              >
                {count =>
                  count ? (
                    <span>
                      <Tooltip Component="View Slide Image">
                        <ImageViewerLink
                          isIcon
                          query={{
                            filters: makeFilter([
                              { field: 'cases.case_id', value: p.case_id },
                            ]),
                          }}
                        >
                          <MicroscopeIcon /> ({count})
                        </ImageViewerLink>
                      </Tooltip>
                      <Tooltip Component="Add to cart">
                        <Button
                          className="test-toggle-cart"
                          leftIcon={<ShoppingCartIcon />}
                          style={{ ...iconButton, marginLeft: '0.5rem' }}
                          disabled
                        />
                      </Tooltip>
                    </span>
                  ) : (
                    <span>--</span>
                  )}
              </RepositorySlideCount>
            ),
          },
        ]}
        style={{ flex: 1 }}
      />

      <Column style={{ width: '200px' }} spacing={theme.spacing}>
        <CountCard
          className="test-files-count"
          style={{ width: 'auto' }}
          title="FILES"
          count={totalFiles.toLocaleString()}
          icon={<FileIcon style={styles.icon} className="fa-3x" />}
          linkParams={
            totalFiles
              ? {
                  pathname: '/repository',
                  query: {
                    filters: makeFilter([
                      { field: 'cases.case_id', value: p.case_id },
                    ]),
                    facetTab: 'files',
                    searchTableTab: 'files',
                  },
                }
              : null
          }
        />
        <CountCard
          className="test-annotations-count"
          style={{ width: 'auto' }}
          title="ANNOTATIONS"
          count={p.annotations.hits.total.toLocaleString()}
          icon={<AnnotationIcon style={styles.icon} className="fa-3x" />}
          linkParams={getAnnotationsLinkParams(p.annotations.hits)}
        />
      </Column>
    </Row>
  );
});
