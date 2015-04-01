module ngApp.components.tables.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import ITableColumn = ngApp.components.tables.models.ITableColumn;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;
  import IUserService = ngApp.components.user.services.IUserService;
  import IGDCConfig = ngApp.IGDCConfig;

  interface ITableSortController {
    updateSorting(): void;
    paging: IPagination;
    activeSorting: any;
    setDefaultSorting(): void;
    clientSorting(): void;
    toggleSorting(item: any): void;
  }

  interface ITableScope extends ng.IScope {
    paging: IPagination;
    page: string;
    sortColumns: ITableColumn[];
    config: any;
    data: any;
    update: boolean;
  }

  class TableSortController implements ITableSortController {
    paging: IPagination;
    activeSorting: any = [];

    /* @ngInject */
    constructor(private $scope: ITableScope, private LocationService: ILocationService) {
      this.paging = $scope.paging;
      var currentSorting = $scope.paging.sort;

      $scope.sortColumns = _.reduce($scope.config.headings, (a,b) => {

        if (b.sortable) {
          var obj = {
            key: b.id,
            name: b.displayName
          };

          if (b.sortMethod) {
            obj.sortMethod = b.sortMethod;
          }

          a.push(obj);
        }

        return a;
      }, []);

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

            this.activeSorting.push(sortObj);
          }
        });

        if ($scope.update) {
          this.clientSorting();
        }
      } else {
        this.setDefaultSorting();
      }
    }

    setDefaultSorting(): void {
      this.activeSorting = [];
      this.activeSorting.push(this.$scope.sortColumns[0]);

      this.activeSorting[0].sort = true;
      this.activeSorting[0].order = "asc";
    }

    clientSorting(): void {
      function defaultSort(a, b, order) {
        if (order === "asc") {
          if (isNaN(a)) {
            if (a < b) return -1;
            if(a > b) return 1;
            return 0;
          } else {
            return a - b;
          }
        }

        if (order === "desc") {
          if (isNaN(a)) {
            if (a > b) return -1;
            if(a < b) return 1;
            return 0;
          } else {
            return b - a;
          }
        }
      }

      if (!this.activeSorting.length) {
        this.setDefaultSorting();
      }

      _.forEach(this.activeSorting, (sortValue, sortIndex) => {
        var order = sortValue.order || "asc";

        this.$scope.data.sort((a, b) => {
          var column = _.find(this.$scope.sortColumns, (column) => {
            return column.key === sortValue.key;
          });

          if (column.sortMethod) {
            return column.sortMethod(a[sortValue.key], b[sortValue.key], order);
          }

          return defaultSort(a[sortValue.key], b[sortValue.key], order);
        });
      });
    }

    toggleSorting(item: any): void {
      if (!item.sort) {
        item.sort = true;
        item.order = "asc";
        this.activeSorting.push(item);
      } else {
        item.sort = false;
        this.activeSorting.splice(this.activeSorting.indexOf(item), 1);
      }

      this.updateSorting();
    }

    updateSorting(): void {
      if (this.$scope.update) {
        this.clientSorting();
        return;
      }

      var pagination = this.LocationService.pagination();

      var sortString = "";

      _.each(this.activeSorting, (col: any, index: number) => {
        if (!col.order) {
          col.order = "asc";
        }

        sortString += col.key + ":" + col.order;

        if (index < (this.activeSorting.length - 1)) {
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

  interface IGDCTableController {
    setDisplayedData(newPaging?: any): void;
  }

  class GDCTableController implements IGDCTableController {
    sortingHeadings: any[] = [];
    displayedData: any[];

    /* @ngInject */
    constructor(private $scope: IGDCTableScope) {
      this.sortingHeadings = _.filter($scope.config.headings, (heading: any) => {
        return heading.sortable;
      });

      if ($scope.clientSide) {
        $scope.$on("cart-paging-update", (event: any, newPaging: any) => {
          this.setDisplayedData(newPaging);
        });
      }

      $scope.$watch("data", ()=> {
        this.setDisplayedData();
      }, true);

      this.setDisplayedData();
    }

    setDisplayedData(newPaging: any = this.$scope.paging) {
      if (this.$scope.clientSide) {
        this.$scope.paging.from = newPaging.from;
        this.$scope.paging.size = newPaging.size;
        this.$scope.paging.count = this.$scope.paging.size;
        this.$scope.paging.pages = Math.ceil(this.$scope.data.length /
                                             this.$scope.paging.size);
        this.$scope.paging.total = this.$scope.data.length;

        // Used to check if files are deleted and the overall count can't reach the page
        // we are on.
        while (this.$scope.paging.from > this.$scope.paging.total) {
          this.$scope.paging.page--;
          this.$scope.paging.from -= this.$scope.paging.size;
        }

        // Safe fallback
        if (this.$scope.paging.page < 0 || this.$scope.paging.from < 1) {
          this.$scope.paging.page = 1;
          this.$scope.paging.from = 1;
        }

        this.displayedData = _.assign([], this.$scope.data)
                              .splice(this.$scope.paging.from - 1, this.$scope.paging.size);

      } else {
        this.displayedData = this.$scope.data;
      }
    }
  }

  interface IExportScope extends ng.IScope {
    endpoint: string;
    size: number;
    fields: string[];
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
        "files": "participants.project.project_id",
        "participants": "project.project_id",
        "projects": "project_id"
      };

      var filters: Object = this.LocationService.filters();
      var url = this.LocationService.getHref();
      var abort = this.$q.defer();
      var modalInstance;

      if (projectsKeys[this.$scope.endpoint]) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[this.$scope.endpoint]);
      }

      if (this.$window.URL && this.$window.URL.createObjectURL) {
        var params = {
          filters: filters,
          fields: this.$scope.fields.join(),
          attachment: true,
          format: fileType,
          size: this.$scope.size
        };

        modalInstance = this.$modal.open({
          templateUrl: "components/tables/templates/export-modal.html",
          controller: "ExportTableModalController as etmc",
          backdrop: 'static'
        });

        modalInstance.result.then((data) => {
          if (data.cancel) {
            if (abort) {
              abort.resolve();
            } else {
              this.LocationService.setHref(url);
            }
          }
        });


        this.Restangular.all(this.$scope.endpoint)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob"
        })
        .get('', params).then((file) => {
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
                                     "&fields=" + this.$scope.fields.join() +
                                     "&size=" + this.$scope.size +
                                     "&filters=" + JSON.stringify(filters));
      }
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

