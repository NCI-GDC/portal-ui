module ngApp.projects.models {
  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    const filterString = $filter("makeFilter")(filters, true);
    const href = 'search/p?filters=' + filterString;
    const val = '{{' + value + '|number:0}}'; 
    return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
  }
  function getDataType(dataTypes: Object[], dataType:string): number {
    const data = _.find(dataTypes, {data_type: dataType});
    return data ? data.participant_count : 0;
  }
  function dataTypeWithFilters(dataType: string, row: Object[], $filter: ng.IFilterService) {
    const fs = [
                  {name: 'participants.project.project_id', value: row.project_id},
                  {name: 'files.data_type', value: dataType}
                ];
    return withFilter(getDataType(row.summary.data_types, dataType), fs, $filter);
  }
  
  var projectTableModel = {
    title: 'Projects',
    order: ['project_id', 'disease_type', 'primary_site', 'program.name', 'summary.participant_count', 'data_types', 'summary.file_count', 'file_size'],
    rowId: 'project_id',
    headings: [
      {
        name: "ID",
        id: "project_id",
        td: row => '<a href="projects/'+row.project_id + 
                     '" data-tooltip="' + row.name +
                     '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + 
                     row.project_id + 
                   '</a>',
        sortable: true,
        hidden: false,
        draggable: true
      }, {
        name: "Disease Type",
        id: "disease_type",
        tdClassName: 'truncated-cell',
        td: row => row.disease_type,
        sortable: true,
        hidden: false,
        draggable: true
      }, {
        name: "Primary Site",
        id: "primary_site",
        tdClassName: 'truncated-cell',
        td: row => row.primary_site,
        sortable: true,
        hidden: false,
        canReorder: true,
        enabled: true
      }, {
        name: "Program",
        id: "program.name",
        td: row => row.program && row.program.name,
        sortable: true,
        hidden: false
      },
      {
        name: "Cases",
        id: "summary.participant_count",
        td: (row, $filter) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.participant_count, fs, $filter);
        },
        sortable: true,
        hidden: false,
        tdClassName: 'text-right'
      }, {
        name: "Available Cases per Data Type",
        id: "data_types",
        thClassName: 'text-center',
        hidden: false,
        children: [
          {
            name: 'Clinical',
            id: 'clinical',
            td: (row, $filter) => dataTypeWithFilters("Clinical", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'Array',
            id: 'Array',
            td: (row, $filter) => dataTypeWithFilters("Raw microarray data", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'Seq',
            id: 'Seq',
            td: (row, $filter) => dataTypeWithFilters("Raw sequencing data", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: "SNV",
            id: "SNV",
            td: (row, $filter) => dataTypeWithFilters("Simple nucleotide variation", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'CNV',
            id: 'cnv',
            td: (row, $filter) => dataTypeWithFilters("Copy number variation", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'SV',
            id: 'sv',
            td: (row, $filter) => dataTypeWithFilters("Structural rearrangement", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'Exp',
            id: 'Exp',
            td: (row, $filter) => dataTypeWithFilters("Gene expression", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'PExp',
            id: 'pexp',
            td: (row, $filter) => dataTypeWithFilters("Protein expression", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'Meth',
            id: 'meth',
            td: (row, $filter) => dataTypeWithFilters("DNA methylation", row, $filter),
            tdClassName: 'text-right'
          }, {
            name: 'Other',
            id: 'other',
            td: (row, $filter) => dataTypeWithFilters("Other", row, $filter),
            tdClassName: 'text-right'
          }
        ]
      }, {
        name: "Files",
        id: "summary.file_count",
        td: (row, $filter) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.file_count, fs, $filter);
        },
        sortable: true,
        tdClassName: 'text-right'
      }, {
        name: "File Size",
        id: "file_size",
        td: row => row.summary && '{{' + row.summary.file_size + '|size}}',
        sortable: true,
        tdClassName: 'text-right'
      }
    ],
    fields: [
      "disease_type",
      "state",
      "primary_site",
      "project_id",
      "name",
      "program.name"
    ],
    expand: [
      "summary",
      "summary.data_types",
      "summary.experimental_strategies",
    ]
  };
  angular.module("projects.table.model", [])
      .value("ProjectTableModel", projectTableModel);
}