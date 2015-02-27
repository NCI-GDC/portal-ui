module ngApp.components.tables.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import ITableColumn = ngApp.components.tables.models.ITableColumn;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;
  import IUserService = ngApp.components.user.services.IUserService;

  interface ITableSortController {
    updateSorting(): void;
    paging: IPagination;
  }

  interface ITableScope extends ng.IScope {
    paging: IPagination;
    page: string;
    sortColumns: ITableColumn[];
    config:any;
  }

  class TableSortController implements ITableSortController {
    paging: IPagination;

    /* @ngInject */
    constructor(private $scope: ITableScope, private LocationService: ILocationService) {
      this.paging = $scope.paging;
      var currentSorting = $scope.paging.sort;

      $scope.sortColumns = $scope.config.headings.reduce(function(a,b){

        if (b.sortable) {
          a.push({
            key:b.id,
            name:b.displayName
          })
        }

        return a;
      },[]);

      // We need to manually check the URL and parse any active sorting down
      if (currentSorting) {
        currentSorting = currentSorting.split(",");

        _.each(currentSorting, (sort: string) => {
          var sortField = sort.split(":");

          var sortObj = _.find($scope.sortColumns, (col: any) => { return col.key === sortField[0]; });

          // Update the internal sorting object to have sorting from URL values applied
          if (sortObj) {
            sortObj.sort = true;
            sortObj.order = sortField[1];
          }
        });
      }
    }

    updateSorting(): void {
      var pagination = this.LocationService.pagination();
      this.paging.sort = _.filter(this.$scope.sortColumns, (col: any) => { return col.sort; });

      var sortString = "";

      _.each(this.paging.sort, (col: any, index: number) => {
        if (!col.order) {
          col.order = "asc";
        }

        sortString += col.key + ":" + col.order;

        if (index < (this.paging.sort.length - 1)) {
          sortString += ",";
        }
      });

      this.paging.sort = sortString;

      pagination[this.$scope.page] = this.paging;
      this.LocationService.setPaging(pagination);
    }
  }

  interface IGDCTableScope extends ng.IScope {
    heading: string;
    data: any[];
    config: any;
    paging: IPagination;
    page: string;
    sortColumns: any;
    id: string;
  }

  class GDCTableController implements IGDCTableController {
    sortingHeadings: any[] = [];

    /* @ngInject */
    constructor(private $scope: IGDCTableScope) {
      this.sortingHeadings = _.filter($scope.config.headings, (heading: any) => { return heading.sortable; });
    }
  }

  interface IExportScope extends ng.IScope {
    endpoint: string;
    size: number;
  }

  interface IExportTableController {
    exportTable(fileType: string): void;
  }

  class ExportTableController implements IExportTableController {

    /* @ngInject */
    constructor(private $scope: IExportScope, private LocationService: ILocationService, private config: IGDCConfig,
                private $modal: any, private $q: ng.IQService, private Restangular: restangular.IProvider,
                private $window: ng.IWindowService, private UserService: IUserService) {}

    exportTable(fileType: string): void {
      var projectsKeys = {
        "files": "participants.project.code",
        "participants": "project.code",
        "projects": "code"
      };

      var filters: Object = this.LocationService.filters();
      var url = this.LocationService.getHref();
      var abort = this.$q.defer();
      var modalInstance = this.$modal.open({
        templateUrl: "components/tables/templates/export-modal.html",
        controller: "ExportTableModalController as etmc",
        backdrop: 'static'
      });

      if (projectsKeys[this.$scope.endpoint]) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[this.$scope.endpoint]);
      }

      if (this.$window.URL && this.$window.URL.createObjectURL) {
        this.Restangular.all(this.$scope.endpoint)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob"
        })
        .get('', {
          filters: filters,
          attachment: true,
          format: fileType,
          size: this.$scope.size
        }).then((file) => {
          var url = this.$window.URL.createObjectURL(file);
          var a = this.$window.document.createElement("a");
          a.setAttribute("href", url);
          a.setAttribute("download", this.$scope.endpoint + "." +
                         this.$window.moment().format() + "." +
                         fileType.toLowerCase());
          this.$window.document.body.appendChild(a);

          _.defer(() => {
            a.click();
            modalInstance.close({cancel: true});
            this.$window.document.body.removeChild(a);
          });
        });
      } else {
        this.LocationService.setHref(this.config.api + "/" +
                                     this.$scope.endpoint +
                                     "?attachment=true&format=" + fileType +
                                     "&size=" + this.$scope.size +
                                     "&filters=" + JSON.stringify(filters));
      }

      modalInstance.result.then((data) => {
        if (data.cancel) {
          if (abort) {
            abort.resolve();
          } else {
            this.LocationService.setHref(url);
          }
        }
      });
    }

  }

  class ExportTableModalController {

    /* @ngInject */
    constructor(private $modalInstance) {}
    cancel(): void {
      this.$modalInstance.close({
        cancel: true
      });
    }
  }

  angular.module("tables.controllers", ["location.services", "user.services"])
      .controller("TableSortController", TableSortController)
      .controller("GDCTableController", GDCTableController)
      .controller("ExportTableModalController", ExportTableModalController)
      .controller("ExportTableController", ExportTableController);
}

