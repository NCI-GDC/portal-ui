import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { makeFilter } from '@ncigdc/utils/filters';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import CountCard from '@ncigdc/components/CountCard';
import FileIcon from '@ncigdc/theme/icons/File';
import CaseIcon from '@ncigdc/theme/icons/Case';
import AnnotationIcon from '@ncigdc/theme/icons/Edit';

const SPACING = '2rem';

const styles = {
  countCard: {
    width: 'auto',
    marginBottom: SPACING,
  },
  column: {
    flexGrow: 1,
  },
  margin: {
    marginBottom: SPACING,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
  coloredSquare: {
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: 5,
  },
};

interface IProjectProps {
  viewer: {
    projects: {
      hits: {
        edges: {
          node: {
            project_id: string;
            dbgap_accession_number: string;
            name: string;
            disease_type: string;
            primary_site: string;
            program: {
              name: string;
              dbgap_accession_number: string;
            };
            summary: {
              case_count: number;
              file_count: number;
            };
            id: string;
          };
        };
      };
    };
    annotations: {
      hits: {
        total: number;
        edges: {
          node: {
            annotation_id: string;
            id: string;
          };
        };
      };
    };
  };
}
export default compose<IProjectProps, React.Component>(
  branch(
    ({ viewer }) => !viewer.projects.hits.edges[0],
    renderComponent(() => <div>No project found.</div>)
  )
)(({ viewer: { annotations, projects: { hits: { edges } } } }) => {
  const project = edges[0].node;

  const projectFilter = [
    {
      field: 'cases.project.project_id',
      value: project.project_id,
    },
  ];
  const dbgapAccessionNumber =
    project.program.dbgap_accession_number || project.dbgap_accession_number;
  interface IColumnsProps {
    th: string | JSX.Element;
    td: number | string | JSX.Element;
  }
  const basicColumns = [
    { th: 'Project ID', td: project.project_id },
    {
      th: (
        <span style={{ textTransform: 'none' }}>dbGaP Study Accession</span>
      ),
      td: (
        <a
          href={
            'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=' +
            dbgapAccessionNumber
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {dbgapAccessionNumber}
        </a>
      ),
    },
    { th: 'Project Name', td: project.name },
    { th: 'Program', td: project.program.name },
  ];
  const collapsibleListColumns = [
    ...basicColumns.slice(0, 3),
    {
      th: 'Disease Type',
      td: (
        <span>
          {project.disease_type.length > 1 && (
            <CollapsibleList
              data={project.disease_type.slice(0).sort()}
              limit={0}
              toggleStyle={{ fontStyle: 'normal' }}
              liStyle={{
                whiteSpace: 'normal',
                listStyleType: 'disc',
                listStylePosition: 'inside',
              }}
              expandText={`${project.disease_type.length} Disease Types`}
              collapseText="collapse"
            />
          )}
          {project.disease_type.length <= 1 && project.disease_type}
        </span>
      ),
    },
    {
      th: 'Primary Site',
      td: (
        <span>
          {project.primary_site.length > 1 && (
            <CollapsibleList
              data={project.primary_site.slice(0).sort()}
              limit={0}
              toggleStyle={{ fontStyle: 'normal' }}
              liStyle={{
                whiteSpace: 'normal',
                listStyleType: 'disc',
                listStylePosition: 'inside',
              }}
              expandText={`${project.primary_site.length} Primary Sites`}
              collapseText="collapse"
            />
          )}
          {project.primary_site.length <= 1 && project.primary_site}
        </span>
      ),
    },
    basicColumns[3],
  ];
  const SummaryTable = (columns: IColumnsProps[]) => (
    <EntityPageVerticalTable
      id="summary"
      title={
        <span>
          <i className="fa fa-table" /> Summary
        </span>
      }
      description={
        <div style={{ paddingLeft: '10px', marginBottom: '20px' }}>
          <div>
            The project has controlled access data which requires dbGaP Access.
            See instructions for{' '}
            <a
              href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
              target="_blank"
              rel="noopener noreferrer"
            >
              Obtaining Access to Controlled Data.
            </a>
          </div>
        </div>
      }
      thToTd={columns}
    />
  );
  return (
    <Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
      <span style={{ ...styles.column, ...styles.margin }}>
        {SummaryTable(
          project.primary_site.length <= 1
            ? collapsibleListColumns
            : basicColumns
        )}
      </span>

      <Column style={{ ...styles.margin, width: '200px' }}>
        <CountCard
          title="CASES"
          count={project.summary.case_count.toLocaleString()}
          icon={<CaseIcon style={styles.icon} className="fa-3x" />}
          style={styles.countCard}
          linkParams={
            project.summary.case_count
              ? {
                  merge: 'replace',
                  pathname: '/repository',
                  query: {
                    filters: makeFilter(projectFilter),
                    facetTab: 'cases',
                    searchTableTab: 'cases',
                  },
                }
              : null
          }
        />
        <CountCard
          title="FILES"
          count={project.summary.file_count.toLocaleString()}
          icon={<FileIcon style={styles.icon} className="fa-3x" />}
          style={styles.countCard}
          linkParams={
            project.summary.file_count
              ? {
                  pathname: '/repository',
                  query: {
                    filters: makeFilter(projectFilter),
                    facetTab: 'files',
                    searchTableTab: 'files',
                  },
                }
              : null
          }
        />
        <CountCard
          title="ANNOTATIONS"
          count={annotations.hits.total.toLocaleString()}
          icon={<AnnotationIcon style={styles.icon} className="fa-3x" />}
          style={{ ...styles.countCard, marginBottom: 0 }}
          linkParams={
            annotations.hits.total
              ? {
                  merge: 'replace',
                  pathname: `/annotations${annotations.hits.total.toLocaleString() ===
                  '1'
                    ? `/${annotations.hits.edges[0].node.annotation_id}`
                    : ''}`,
                  query: {
                    filters:
                      annotations.hits.total > 1 &&
                      makeFilter([
                        {
                          field: 'annotations.project.project_id',
                          value: project.project_id,
                        },
                      ]),
                  },
                }
              : null
          }
        />
      </Column>
    </Row>
  );
});
