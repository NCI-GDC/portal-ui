module ngApp.projects.models {
  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    const filterString = $filter("makeFilter")(filters, true);
    const href = 'search/p?filters=' + filterString;
    const val = '{{' + value + '|number:0}}'; 
    return "<a href='" + href + "'>" + val + '</a>';
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
        th: "ID",
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
        th: "Disease Type",
        id: "disease_type",
        tdClassName: 'truncated-cell',
        td: row => row.disease_type,
        sortable: true,
        hidden: false,
        draggable: true
      }, {
        th: "Primary Site",
        id: "primary_site",
        tdClassName: 'truncated-cell',
        td: row => row.primary_site,
        sortable: true,
        hidden: false,
        canReorder: true,
        enabled: true
      }, {
        th: "Program",
        id: "program.name",
        td: row => row.program.name,
        sortable: true,
        hidden: false
      },
      {
        th: "Cases",
        id: "summary.participant_count",
        td: (row, $filter) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.participant_count, fs, $filter);
        },
        sortable: true,
        hidden: false,
        tdClassName: 'text-right'
      }, {
        th: "Available Cases per Data Type",
        id: "data_types",
        thClassName: 'text-center',
        hidden: false,
        children: [
          {
            th: 'Clinical',
            id: 'clinical',
            td: (row, $filter) => dataTypeWithFilters("Clinical", row, $filter)
          }, {
            th: 'Array',
            id: 'Array',
            td: (row, $filter) => dataTypeWithFilters("Raw microarray data", row, $filter)
          }, {
            th: 'Seq',
            id: 'Seq',
            td: (row, $filter) => dataTypeWithFilters("Raw sequencing data", row, $filter)
          }, {
            th: "SNV",
            id: "SNV",
            td: (row, $filter) => dataTypeWithFilters("Simple nucleotide variation", row, $filter)
          }, {
            th: 'CNV',
            id: 'cnv',
            td: (row, $filter) => dataTypeWithFilters("Copy number variation", row, $filter)
          }, {
            th: 'SV',
            id: 'sv',
            td: (row, $filter) => dataTypeWithFilters("Structural rearrangement", row, $filter)
          }, {
            th: 'Exp',
            id: 'Exp',
            td: (row, $filter) => dataTypeWithFilters("Gene expression", row, $filter)
          }, {
            th: 'PExp',
            id: 'pexp',
            td: (row, $filter) => dataTypeWithFilters("Protein expression", row, $filter)
          }, {
            th: 'Meth',
            id: 'meth',
            td: (row, $filter) => dataTypeWithFilters("DNA methylation", row, $filter)
          }, {
            th: 'Other',
            id: 'other',
            td: (row, $filter) => dataTypeWithFilters("Other", row, $filter)
          }
        ]
      }, {
        th: "Files",
        id: "summary.file_count",
        td: (row, $filter) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.file_count, fs, $filter);
        },
        sortable: true,
        tdClassName: 'text-right'
      }, {
        th: "File Size",
        id: "file_size",
        td: row => '{{' + row.summary.file_size + '|size}}',
        sortable: true,
        tdClassName: 'text-right'
      }
    ],
    fields: [
      "disease_type",
      "state",
      "primary_site",
      "project_id",
      "name"
    ],
    expand: [
      "summary",
      "summary.data_types",
      "summary.experimental_strategies",
      "program"
    ]
  };
  angular.module("projects.table.model", [])
      .value("ProjectTableModel", projectTableModel);
}