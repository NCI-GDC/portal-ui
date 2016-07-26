module ngApp.projects.table.service {
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

  class ProjectsTableService {

    /* @ngInject */
    constructor(private DATA_CATEGORIES) {}

    filterFactory(url: string) : IWithFilterFn {
        return function(value: number, filters: Object[], $filter: ng.IFilterService)  {
          var filterString = _.isObject(filters) ? $filter("makeFilter")(filters, true) : null;
          var href = url + (filterString ? "?filters=" + filterString : "");
          var val = $filter("number")(value);
          return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
        };
    }

    withFilterF : IWithFilterFn = this.filterFactory("search/f");
    withFilter : IWithFilterFn = this.filterFactory("search/c");

    getdataCategory(dataCategories: DataCategory[], dataCategory:string): number {
      var data = _.find(dataCategories, {data_category: dataCategory});
      return data ? data.case_count : 0;
    }

    dataCategoryWithFilters(dataCategory: string, row: Row, $filter: ng.IFilterService): string {
      var fs = [{field: 'cases.project.project_id', value: row.project_id},
                {field: 'files.data_category', value: dataCategory}];
      return this.withFilter(this.getdataCategory(row.summary.data_categories, dataCategory), fs, $filter);
    }

    dataCategoryTotalWithFilters(dataCategory: string, data: Rows, $filter: ng.IFilterService): string {
    var fs = [{field: 'files.data_category', value: [dataCategory]},
              {field: 'cases.project.project_id', value: data.map(d => d.project_id)}];
      return this.withFilter(_.sum(_.map(data, row => this.getdataCategory(row.summary.data_categories, dataCategory))), fs, $filter);
    }

    withCurrentFilters(value: number, $filter: ng.IFilterService, LocationService: ILocationService) {
      var fs = _.map(LocationService.filters().content, x => ({
        field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
        value: x.content.value
      }));
      return this.withFilter(value, fs, $filter);
    }

    hasFilters(LocationService: ILocationService) : boolean {
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

    withProjectFilters(data: Object[], $filter: ng.IFilterService, LocationService: ILocationService, withFilterFn?: IWithFilterFn) : string {

      var wFilterFn : IWithFilterFn = withFilterFn || this.withFilter;
      var projectIDs = data.map(d => d.project_id);

      var countKey = withFilterFn !== this.withFilter ? 'file_count' : 'case_count';

      var fs = this.hasFilters(LocationService) && projectIDs.length
        ? [{ field: 'cases.project.project_id', value: projectIDs }]
        : [];

      var totalCount = data.reduce((acc, val) => acc + val.summary[countKey], 0);

      return wFilterFn(totalCount, fs, $filter);
    }

    model() {
      return {
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
              return this.withFilter(row.summary.case_count, fs, $scope.$filter);
            },
            sortable: true,
            hidden: false,
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) => this.withProjectFilters(data, $scope.$filter, $scope.LocationService, this.withFilter)
          }, {
            name: "Available Cases per Data Category",
            id: "summary.data_categories",
            thClassName: 'text-center',
            hidden: false,
            children: Object.keys(this.DATA_CATEGORIES).map(key => ({
              name: this.DATA_CATEGORIES[key].abbr,
              th:
                '<abbr data-uib-tooltip="' + this.DATA_CATEGORIES[key].full + '">'
              + this.DATA_CATEGORIES[key].abbr + '</abbr>',
              id: this.DATA_CATEGORIES[key].abbr,
              td: (row, $scope) => this.dataCategoryWithFilters(this.DATA_CATEGORIES[key].full, row, $scope.$filter),
              thClassName: 'text-right',
              tdClassName: 'text-right',
              total: (data, $scope) => this.dataCategoryTotalWithFilters(this.DATA_CATEGORIES[key].full, data, $scope.$filter)
            }))
          }, {
            name: "Files",
            id: "summary.file_count",
            td: (row, $scope) => {
              var fs = [{field: 'cases.project.project_id', value: row.project_id}]
              return this.withFilterF(row.summary.file_count, fs, $scope.$filter);
            },
            sortable: true,
            thClassName: 'text-right',
            tdClassName: 'text-right',
            total: (data, $scope) =>  this.withProjectFilters(data, $scope.$filter, $scope.LocationService, this.withFilterF)
          }, {
            name: "File Size",
            id: "file_size",
            td: (row, $scope) => row.summary && $scope.$filter("size")(row.summary.file_size),
            sortable: true,
            thClassName: 'text-right',
            tdClassName: 'text-right',
            hidden: true,
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
          "summary.file_size",
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
    }
  }

  angular.module("projects.table.service", [])
      .service("ProjectsTableService", ProjectsTableService);
}
