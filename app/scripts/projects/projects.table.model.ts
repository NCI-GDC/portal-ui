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
        td: (row, $scope) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.participant_count, fs, $scope.$filter);
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
            td: (row, $scope) => dataTypeWithFilters("Clinical", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Array',
            th: '<abbr data-tooltip="Raw microarray data">Array</abbr>',
            id: 'Array',
            td: (row, $scope) => dataTypeWithFilters("Raw microarray data", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Seq',
            th: '<abbr data-tooltip="Raw sequencing data">Seq</abbr>',
            id: 'Seq',
            td: (row, $scope) => dataTypeWithFilters("Raw sequencing data", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: "SNV",
            th: '<abbr data-tooltip="Simple nucleotide variation">SNV</abbr>',
            id: "SNV",
            td: (row, $scope) => dataTypeWithFilters("Simple nucleotide variation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'CNV',
            th: '<abbr data-tooltip="Copy number variation">CNV</abbr>',
            id: 'cnv',
            td: (row, $scope) => dataTypeWithFilters("Copy number variation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'SV',
            th: '<abbr data-tooltip="Structural rearrangement">SV</abbr>',
            id: 'sv',
            td: (row, $scope) => dataTypeWithFilters("Structural rearrangement", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Exp',
            th: '<abbr data-tooltip="Gene expression">Exp</abbr>',
            id: 'Exp',
            td: (row, $scope) => dataTypeWithFilters("Gene expression", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'PExp',
            th: '<abbr data-tooltip="Protein expression">PExp</abbr>',
            id: 'pexp',
            td: (row, $scope) => dataTypeWithFilters("Protein expression", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Meth',
            th: '<abbr data-tooltip="DNA methylation">Meth</abbr>',
            id: 'meth',
            td: (row, $scope) => dataTypeWithFilters("DNA methylation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Other',
            id: 'other',
            td: (row, $scope) => dataTypeWithFilters("Other", row, $scope.$filter),
            tdClassName: 'text-right'
          }
        ]
      }, {
        name: "Files",
        id: "summary.file_count",
        td: (row, $scope) => {
          const fs = [{name: 'participants.project.project_id', value: row.project_id}] 
          return withFilter(row.summary.file_count, fs, $scope.$filter);
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