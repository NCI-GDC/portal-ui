module ngApp.projects.models {
  import ILocationService = ngApp.components.location.ILocationService;
  
  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = 'search/c?filters=' + filterString;
    var val = $filter("number")(value);
    return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
  }
  function getDataType(dataTypes: Object[], dataType:string): number {
    var data = _.find(dataTypes, {data_type: dataType});
    return data ? data.case_count : 0;
  }
  function dataTypeWithFilters(dataType: string, row: Object[], $filter: ng.IFilterService) {
    var fs = [{field: 'cases.project.project_id', value: row.project_id},
              {field: 'files.data_type', value: dataType}];
    return withFilter(getDataType(row.summary.data_types, dataType), fs, $filter);
  }

  function dataTypeTotalWithFilters(dataType: string, data: Object[], $filter: ng.IFilterService, LocationService: ILocationService) {
    var fs = _.map(LocationService.filters().content, x => ({
      field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
      value: x.content.value  
    }));
    fs.push({field: 'files.data_type', value: [dataType]});
    
    return withFilter(_.sum(_.map(data, row => getDataType(row.summary.data_types, dataType))), fs, $filter);
  }

  function withCurrentFilters(value: number, $filter: ng.IFilterService, LocationService: ILocationService) {
    var fs = _.map(LocationService.filters().content, x => ({
      field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
      value: x.content.value  
    }));
    console.log(value, fs);
    return withFilter(value, fs, $filter);
  }

  var projectTableModel = {
    title: 'Projects',
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
        draggable: true,
        total: data => '<strong>Total</strong>',
        colSpan: 4
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
      }, {
        name: "Cases",
        id: "summary.case_count",
        td: (row, $scope) => {
          var fs = [{name: 'cases.project.project_id', value: row.project_id}]
          return withFilter(row.summary.case_count, fs, $scope.$filter);
        },
        sortable: true,
        hidden: false,
        thClassName: 'text-right',
        tdClassName: 'text-right',
        total: (data, $scope) => withCurrentFilters(_.sum(_.pluck(data, "summary.case_count")), $scope.$filter, $scope.LocationService)
      }, {
        name: "Available Cases per Data Type",
        id: "summary.data_types",
        thClassName: 'text-center',
        hidden: false,
        children: [
          {
            name: 'Clinical',
            id: 'clinical',
            td: (row, $scope) => dataTypeWithFilters("Clinical", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters('Clinical', data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'Array',
            th: '<abbr data-tooltip="Raw microarray data">Array</abbr>',
            id: 'Array',
            td: (row, $scope) => dataTypeWithFilters("Raw microarray data", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Raw microarray data", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'Seq',
            th: '<abbr data-tooltip="Raw sequencing data">Seq</abbr>',
            id: 'Seq',
            td: (row, $scope) => dataTypeWithFilters("Raw sequencing data", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Raw sequencing data", data, $scope.$filter, $scope.LocationService)
          }, {
            name: "SNV",
            th: '<abbr data-tooltip="Simple nucleotide variation">SNV</abbr>',
            id: "SNV",
            td: (row, $scope) => dataTypeWithFilters("Simple nucleotide variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Simple nucleotide variation", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'CNV',
            th: '<abbr data-tooltip="Copy number variation">CNV</abbr>',
            id: 'cnv',
            td: (row, $scope) => dataTypeWithFilters("Copy number variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Copy number variation", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'SV',
            th: '<abbr data-tooltip="Structural rearrangement">SV</abbr>',
            id: 'sv',
            td: (row, $scope) => dataTypeWithFilters("Structural rearrangement", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Structural rearrangement", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'Exp',
            th: '<abbr data-tooltip="Gene expression">Exp</abbr>',
            id: 'Exp',
            td: (row, $scope) => dataTypeWithFilters("Gene expression", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Gene expression", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'PExp',
            th: '<abbr data-tooltip="Protein expression">PExp</abbr>',
            id: 'pexp',
            td: (row, $scope) => dataTypeWithFilters("Protein expression", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Protein expression", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'Meth',
            th: '<abbr data-tooltip="DNA methylation">Meth</abbr>',
            id: 'meth',
            td: (row, $scope) => dataTypeWithFilters("DNA methylation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("DNA methylation", data, $scope.$filter, $scope.LocationService)
          }, {
            name: 'Other',
            id: 'other',
            td: (row, $scope) => dataTypeWithFilters("Other", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataTypeTotalWithFilters("Other", data, $scope.$filter, $scope.LocationService)
          }
        ]
      }, {
        name: "Files",
        id: "summary.file_count",
        td: (row, $scope) => {
          var fs = [{field: 'cases.project.project_id', value: row.project_id}]
          return withFilter(row.summary.file_count, fs, $scope.$filter);
        },
        sortable: true,
        thClassName: 'text-right',
        tdClassName: 'text-right',
        total: (data, $scope) => withCurrentFilters(_.sum(_.pluck(data, "summary.file_count")), $scope.$filter, $scope.LocationService)
      }, {
        name: "File Size",
        id: "file_size",
        td: (row, $scope) => row.summary && $scope.$filter("size")(row.summary.file_size),
        sortable: true,
        thClassName: 'text-right',
        tdClassName: 'text-right',
        total: (data, $scope) => $scope.$filter("size")(_.sum(_.pluck(data, "summary.file_size")))
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
