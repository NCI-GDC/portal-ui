module ngApp.components.exportTable.services {

  export interface IFilterAndExpands {
    fields: string[];
    expand: string[];
  }

  export interface IExportTableService {
    getFieldsAndExpand(headings, initial): IFilterAndExpands;
    exportTable(any): void;
  }

  class ExportTableService implements IExportTableService {
    /* @ngInject */
    constructor(
      private LocationService,
      private SearchCasesTableService,
      private SearchTableFilesModel,
      private DATA_CATEGORIES,
      private UserService,
      private config
    ) {}

    getFieldsAndExpand(headings, initial = { fields: [], expand: [] }): IFilterAndExpands {
      return headings.reduce((acc, x) => ({
        expand: [ ...acc.expand, ...(!x.hidden && x.children ? [ x.id ] : []) ],
        fields: [ ...acc.fields, ...(!x.hidden && x.isField && !x.children ? [ x.id ] : []) ],
      }), initial);
    }

    getModel(endpoint: string) {
      switch(endpoint) {
        case 'cases':
          return this.SearchCasesTableService.model();
        case 'files':
          return this.SearchTableFilesModel
        default:
          return [];
      }
    }

    buildParams({ headings, fields, expand, format, size, endpoint, sendAllFields }) {
      var projectsKeys = {
        files: "cases.project.project_id",
        cases: "project.project_id",
        projects: "project_id"
      };

      var filters = this.LocationService.filters();

      if (projectsKeys[endpoint]) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[endpoint]);
      }

      var fieldsAndExpand = this.getFieldsAndExpand(headings);
      var model = this.getModel(endpoint);

      var tsvHeadings = headings.reduce((acc, x) => ([
        ...acc,
        ...(!x.hidden && x.isField
          ? x.id === `summary.data_categories`
            ? Object.keys(this.DATA_CATEGORIES).map(k =>
              `${this.DATA_CATEGORIES[k].abbr}~~~summary.data_categories.${this.DATA_CATEGORIES[k].full}`
            )
            : [`${x.name}~~~${x.id}`]
          : []),
      ]), []);

      fields = sendAllFields
        ? model.fields || []
        : [ ...fieldsAndExpand.fields, ...(fields || []) ];

      expand = sendAllFields
        ? model.expand || []
        : [ ...fieldsAndExpand.expand, ...(expand || []) ];

      return {
        fields: fields.join(),
        expand: expand.join(),
        headings: tsvHeadings.join(),
        attachment: true,
        flatten: true,
        pretty: true,
        filters,
        format,
        size
      };
    }

    exportTable({
      params,
      endpoint,
      downloadInProgress,
      download
    }): void {
      const inProgress = (state) => (() => { downloadInProgress = state; }).bind(this);
      // const checkProgress = download(params, `${this.config.auth_api}/${endpoint}`, (e) => e.parent());
      const checkProgress = download(params, `${this.config.api}/${endpoint}`, (e) => e.parent());
      checkProgress(inProgress(true), inProgress(false));
    }
  }

angular
  .module("export-table.service", [
    "location.services",
    "user.services",
    "ngApp.core",
    "search.table.files.model",
    "search.cases.table.service",
  ])
  .service("ExportTableService", ExportTableService);
}
