module ngApp.projects.models {
  import ILocationService = ngApp.components.location.ILocationService;

  type IWithFilterFn = (value: number, filters: Object[], $filter: ng.IFilterService) => string;

  type DataCategory = {
    case_count: number
  }

  type Summary = {
    data_categories: DataCategory[]
  }

  type Row = {
    project_id: string;
    summary: Summary;
  }

  type Rows = Row[];

  function filterFactory(url: string) : IWithFilterFn {
      return function(value: number, filters: Object[], $filter: ng.IFilterService)  {
        var filterString = _.isObject(filters) ? $filter("makeFilter")(filters, true) : null;
        var href = url + (filterString ? "?filters=" + filterString : "");
        var val = $filter("number")(value);
        return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
      };
  }

  var withFilterF : IWithFilterFn = filterFactory("search/f"),
      withFilter : IWithFilterFn = filterFactory("search/c");

  function getdataCategory(dataCategories: DataCategory[], dataCategory:string): number {
    var data = _.find(dataCategories, {data_category: dataCategory});
    return data ? data.case_count : 0;
  }

  function dataCategoryWithFilters(dataCategory: string, row: Row, $filter: ng.IFilterService): string {
    var fs = [{field: 'cases.project.project_id', value: row.project_id},
              {field: 'files.data_category', value: dataCategory}];
    return withFilter(getdataCategory(row.summary.data_categories, dataCategory), fs, $filter);
  }

  function dataCategoryTotalWithFilters(dataCategory: string, data: Rows, $filter: ng.IFilterService): string {
  var fs = [{field: 'files.data_category', value: [dataCategory]},
            {field: 'cases.project.project_id', value: data.map(d => d.project_id)}];
    return withFilter(_.sum(_.map(data, row => getdataCategory(row.summary.data_categories, dataCategory))), fs, $filter);
  }

  function withCurrentFilters(value: number, $filter: ng.IFilterService, LocationService: ILocationService) {
    var fs = _.map(LocationService.filters().content, x => ({
      field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
      value: x.content.value
    }));
    return withFilter(value, fs, $filter);
  }

  function hasFilters(LocationService: ILocationService) : boolean {
    var filters = _.get(LocationService.filters(), 'content', null),
        hasFiltersFlag = false;

    if (! filters) {
      return hasFiltersFlag;
    }

    for (var i = 0; i < filters.length; i++) {
      var field = _.get(filters[i], 'content.field', false);

      if (! field) {
        continue;
      }

      hasFiltersFlag = true;
      break;
    }

    return hasFiltersFlag;
  }

  function withProjectFilters(data: Object[], $filter: ng.IFilterService, LocationService: ILocationService, withFilterFn?: IWithFilterFn) : string {

    var projectIDs = [],
        totalCount = 0,
        wFilterFn : IWithFilterFn = withFilterFn || withFilter,
        fs = [];

    _.map(data, function(d) {


      if (! _.has(d, 'project_id')) {
        return;
      }

      projectIDs.push(d.project_id);

      var countKey = 'summary.case_count';

      if ( withFilterFn !== withFilter ) {
        countKey = 'summary.file_count';
      }

      totalCount += _.get(d, countKey, 0);

    });

    if (hasFilters(LocationService) && projectIDs.length) {
      fs.push({field: 'cases.project.project_id', value: projectIDs});
    }

    return wFilterFn(totalCount, fs, $filter);
  }

  var projectTableModel = {
    title: 'Projects',
    rowId: 'project_id',
    headings: [
      {
        name: "ID",
        id: "project_id",
        td: row => '<a href="projects/'+row.project_id +
                     '" data-uib-tooltip="' + row.name +
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
        toolTipText: row => row.disease_type,
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
          var fs = [{field: 'cases.project.project_id', value: row.project_id}]
          return withFilter(row.summary.case_count, fs, $scope.$filter);
        },
        sortable: true,
        hidden: false,
        thClassName: 'text-right',
        tdClassName: 'text-right',
        total: (data, $scope) => withProjectFilters(data, $scope.$filter, $scope.LocationService, withFilter)
      }, {
        name: "Available Cases per Data Category",
        id: "summary.data_categories",
        thClassName: 'text-center',
        hidden: false,
        children: [
          {
            name: 'Seq',
            th: '<abbr data-uib-tooltip="Sequencing Data">Seq</abbr>',
            id: 'Seq',
            td: (row, $scope) => dataCategoryWithFilters("Raw sequencing data", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("Raw sequencing data", data, $scope.$filter)
          }, {
            name: 'Exp',
            th: '<abbr data-uib-tooltip="Transcriptome Profiling">Exp</abbr>',
            id: 'Exp',
            td: (row, $scope) => dataCategoryWithFilters("Gene expression", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("Gene expression", data, $scope.$filter)
          }, {
            name: 'SNV',
            th: '<abbr data-uib-tooltip="Simple Nucleotide Variation">SNV</abbr>',
            id: 'SNV',
            td: (row, $scope) => dataCategoryWithFilters("Simple nucleotide variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("Simple nucleotide variation", data, $scope.$filter)
          }, {
            name: 'CNV',
            th: '<abbr data-uib-tooltip="Copy Number Variation">CNV</abbr>',
            id: 'CNV',
            td: (row, $scope) => dataCategoryWithFilters("Copy number variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("Copy number variation", data, $scope.$filter)
          }, {
            name: 'SV',
            th: '<abbr data-uib-tooltip="Structural Rearrangement">SV</abbr>',
            id: 'SV',
            td: (row, $scope) => dataCategoryWithFilters("Structural rearrangement", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("Structural rearrangement", data, $scope.$filter)
          }, {
            name: 'Meth',
            th: '<abbr data-uib-tooltip="DNA Methylation">Meth</abbr>',
            id: 'Meth',
            td: (row, $scope) => dataCategoryWithFilters("DNA methylation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters("DNA methylation", data, $scope.$filter)
          }, {
            name: 'Clinical',
            id: 'clinical',
            td: (row, $scope) => dataCategoryWithFilters("Clinical", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters('Clinical', data, $scope.$filter)
          }, {
            name: 'Biospecimen',
            id: 'biospecimen',
            td: (row, $scope) => dataCategoryWithFilters("Other", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => dataCategoryTotalWithFilters('Other', data, $scope.$filter)
          }
        ]
      }, {
        name: "Files",
        id: "summary.file_count",
        td: (row, $scope) => {
          var fs = [{field: 'cases.project.project_id', value: row.project_id}]
          return withFilterF(row.summary.file_count, fs, $scope.$filter);
        },
        sortable: true,
        thClassName: 'text-right',
        tdClassName: 'text-right',
        total: (data, $scope) =>  withProjectFilters(data, $scope.$filter, $scope.LocationService, withFilterF)
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
      "program.name",
      "summary.case_count",
      "summary.file_count",
      "summary.data_categories.data_category",
      "summary.data_categories.case_count",
    ],
    facets: [
      {
        name: 'project_id',
        facetType: 'free-text'
      }, {
        name: 'disease_type',
        facetType: 'terms'
      }, {
        name: 'program.name',
        facetType: 'terms'
      }, {
        name: 'primary_site',
        facetType: 'terms'
      }, {
        name: 'summary.experimental_strategies.experimental_strategy',
        facetType: 'terms'
      }, {
        name: 'summary.data_categories.data_category',
        facetType: 'terms'
    }]
  };
  angular.module("projects.table.model", [])
      .value("ProjectTableModel", projectTableModel);
}
