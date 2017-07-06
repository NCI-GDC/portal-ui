<Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
  <span style={{ ...styles.column, ...styles.margin }}>
    <EntityPageVerticalTable
      id="summary"
      title={<span><i className="fa fa-table" /> Summary</span>}
      thToTd={[
        { th: 'Project ID', td: projectId },
        { th: 'Project Name', td: projectName },
        {
          th: 'Disease Type',
          td: <CollapsibleList data={diseaseType} />,
        },
        {
          th: 'Primary Site',
          td: <CollapsibleList data={primarySite} />,
        },
        { th: 'Program', td: programName },
      ]}
    />
  </span>

  <Column style={{ ...styles.margin, width: '200px' }}>
    <CountCard
      title="CASES"
      count={caseCount.toLocaleString()}
      icon={<CaseIcon style={styles.icon} className="fa-3x" />}
      style={styles.countCard}
      linkParams={
        caseCount
          ? {
              merge: 'replace',
              pathname: '/repository',
              query: {
                filters: makeFilter(projectFilter),
              },
            }
          : null
      }
    />
    <CountCard
      title="FILES"
      count={fileCount.toLocaleString()}
      icon={<FileIcon style={styles.icon} className="fa-3x" />}
      style={styles.countCard}
      linkParams={
        fileCount
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
      count={totalAnnotations.toLocaleString()}
      icon={<AnnotationIcon style={styles.icon} className="fa-3x" />}
      style={{ ...styles.countCard, marginBottom: 0 }}
      linkParams={
        totalAnnotations
          ? {
              merge: 'replace',
              pathname: `/annotations${totalAnnotations === 1
                ? `/${annotations[0].annotation_id}`
                : ''}`,
              query: {
                filters:
                  totalAnnotations > 1 &&
                    makeFilter([
                      {
                        field: 'annotations.project.project_id',
                        value: projectId,
                      },
                    ]),
              },
            }
          : null
      }
    />
  </Column>
</Row>;
