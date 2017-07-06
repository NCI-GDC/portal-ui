<SummaryCard
  tableTitle="Cases and File Counts by Data Category"
  pieChartTitle="File Counts by Data Category"
  data={dataCategories.map((item, i) => {
    const filters = makeFilter([
      ...projectFilter,
      { field: 'files.data_category', value: [item.data_category] },
    ]);

    return {
      id: item.data_category,
      data_category: (
        <span>
          <div
            style={{
              ...styles.coloredSquare,
              backgroundColor: colors20(i),
            }}
          />
          {item.data_category}
        </span>
      ),
      case_count: item.case_count > 0
        ? <Link
            merge="replace"
            pathname="/repository"
            query={{
              filters,
              facetTab: 'cases',
              searchTableTab: 'cases',
            }}
          >
            {item.case_count.toLocaleString()}
          </Link>
        : '0',
      file_count: item.file_count
        ? <Link
            merge="replace"
            pathname="/repository"
            query={{
              filters,
              facetTab: 'files',
              searchTableTab: 'files',
            }}
          >
            {item.file_count.toLocaleString()}
          </Link>
        : '0',
      file_count_value: item.file_count,
      tooltip: (
        <span>
          <b>{item.data_category}</b><br />
          {item.file_count} file{item.file_count > 1 ? 's' : ''}
        </span>
      ),
      clickHandler: () => {
        const newQuery = mergeQuery(
          {
            filters,
            facetTab: 'files',
            searchTableTab: 'files',
          },
          query,
          'replace',
        );
        const q = removeEmptyKeys({
          ...newQuery,
          filters: newQuery.filters && JSURL.stringify(newQuery.filters),
        });
        push({ pathname: '/repository', query: q });
      },
    };
  })}
  footer={`${dataCategories.length} Data Categories`}
  path="file_count_value"
  headings={[
    { key: 'data_category', title: 'Data Category', color: true },
    {
      key: 'case_count',
      title: 'Cases',
      style: { textAlign: 'right' },
    },
    {
      key: 'file_count',
      title: 'Files',
      style: { textAlign: 'right' },
    },
  ]}
/>;
