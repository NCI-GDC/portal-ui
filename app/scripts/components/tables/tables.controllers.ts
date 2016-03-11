module ngApp.components.tables.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import ITableColumn = ngApp.components.tables.models.ITableColumn;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;
  import IUserService = ngApp.components.user.services.IUserService;
  import IGDCConfig = ngApp.IGDCConfig;

  interface ITableSortController {
    updateSorting(): void;
    paging: IPagination;
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

    /* @ngInject */
    constructor(private $scope: ITableScope, private LocationService: ILocationService, private $window: IGDCWindowService) {
      this.paging = $scope.paging || {size: 20};
      var currentSorting = this.paging.sort || '';

      var headings = $scope.saved.length ?
          _.map($scope.saved, s => _.merge(_.find($scope.config.headings, {id: s.id}), s)) :
          $scope.config.headings;

      $scope.sortColumns = _.reduce(headings, (cols,col) => {

        if (col.sortable) {
          var obj = {
            id: col.id,
            name: col.name,
            sort: false
          };

          if (col.sortMethod) {
            obj.sortMethod = col.sortMethod;
          }
          cols.push(obj);
        }

        return cols;
      }, []);

      // We need to manually check the URL and parse any active sorting down
      if (currentSorting) {
        currentSorting = currentSorting.split(",");

        _.each(currentSorting, (sort: string) => {
          var sortField = sort.split(":");

          var sortObj = _.find($scope.sortColumns, (col: any) => { return col.id === sortField[0]; });

          // Update the internal sorting object to have sorting from URL values applied
          if (sortObj) {
            sortObj.sort = true;
            sortObj.order = sortField[1];
          }
        });

        if ($scope.update) {
          this.clientSorting();
        }
      }
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

      _.forEach(this.$scope.sortColumns, (sortValue, sortIndex) => {
        if (sortValue.sort) {
          var order = sortValue.order || "asc";
          this.$scope.data.sort((a, b) => {
            if(sortValue.sortMethod) {
              return sortValue.sortMethod(a[sortValue.id], b[sortValue.id], order);
            }
            return defaultSort(a[sortValue.id], b[sortValue.id], order);
          });
        }
      });
    }

    toggleSorting(item: any): void {
      if (!item.sort) {
        item.sort = true;
        item.order = "asc";
      } else {
        item.sort = false;
      }
      this.updateSorting();
    }

    saveToLocalStorage(): void {
      var save = _.map(this.$scope.config.headings, h => _.pick(h, 'id', 'hidden', 'sort', 'order'));
      this.$window.localStorage.setItem(this.$scope.config.title + '-col', angular.toJson(save));
    }

    updateSorting(): void {
      this.saveToLocalStorage();

      if (this.$scope.update) {
        this.clientSorting();
        return;
      }

      var pagination = this.LocationService.pagination();

      var sortString = "";

      _.each(this.$scope.sortColumns, (col: any, index: number) => {
        if (col.sort) {
          if (!col.order) {
            col.order = "asc";
          }

          sortString += col.id + ":" + col.order;

          if (index < (this.$scope.sortColumns.length - 1)) {
            sortString += ",";
          }
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
    saved: string[];
  }

  interface IGDCTableController {
    setDisplayedData(newPaging?: any): void;
    tableRendered: boolean;
    sortingHeadings: any[];
    displayedData: any[];
  }

  class GDCTableController implements IGDCTableController {
    sortingHeadings: any[] = [];
    displayedData: any[];
    tableRendered: boolean = false;

    /* @ngInject */
    constructor(private $scope: IGDCTableScope, $window: ng.IWindowService) {
      this.sortingHeadings = _.filter($scope.config.headings, (heading: any) => {
        return heading && heading.sortable;
      });

      if ($scope.clientSide) {
        $scope.$on("cart-paging-update", (event: any, newPaging: any) => {
          this.setDisplayedData(newPaging);
        });
      }

      $scope.$watch("data", ()=> {
        this.setDisplayedData();
      }, true);

      $scope.$on("tableicious-loaded", () => {
        this.tableRendered = true;
      });

      this.setDisplayedData();

      var decompressed = $window.localStorage.getItem($scope.config.title + '-col');
      $scope.saved = decompressed ? JSON.parse(decompressed) : [];

    }

    setDisplayedData(newPaging: any = this.$scope.paging) {
      if (this.$scope.clientSide) {
        this.$scope.paging.from = newPaging.from;
        this.$scope.paging.size = newPaging.size;
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
      if (this.$scope.paging)
        this.$scope.paging.count = this.displayedData && this.displayedData.length;
    }
  }

  interface IExportScope extends ng.IScope {
    endpoint: string;
    size: number;
    fields: string[];
    text: string;
    expand: string[];
  }

  interface IExportTableController {
    exportTable(fileType: string): void;
  }

  class ExportTableController implements IExportTableController {

    /* @ngInject */
    constructor(private $scope: IExportScope, private LocationService: ILocationService, private config: IGDCConfig,
                private $uibModal: any, private $q: ng.IQService, private Restangular: restangular.IProvider,
                private $window: ng.IWindowService, private UserService: IUserService, private $timeout: ng.ITimeoutService) {}

    exportTable(fileType: string): void {
      var projectsKeys = {
        "files": "cases.project.project_id",
        "cases": "project.project_id",
        "projects": "project_id"
      };

      var filters: Object = this.LocationService.filters();
      var fieldsAndExpand = _.reduce(this.$scope.headings, (result, field) => {
                              if(!_.get(field, 'hidden', false)) {
                                if(_.get(field, 'children')) {
                                  result.expand.push(field.id);
                                } else {
                                  result.fields.push(field.id);
                                }
                              }
                              return result;
                            }, {'fields': [], 'expand': []});
      var url = this.LocationService.getHref();
      var abort = this.$q.defer();
      var modalInstance;

      if (projectsKeys[this.$scope.endpoint]) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[this.$scope.endpoint]);
      }

      if (this.$window.URL && this.$window.URL.createObjectURL) {
        var params = {
          filters: filters,
          fields: fieldsAndExpand.fields.concat(this.$scope.fields || []).join(),
          expand: fieldsAndExpand.expand.concat(this.$scope.expand || []).join(),
          attachment: true,
          format: fileType,
          flatten: true,
          pretty: true,
          size: this.$scope.size
        };

        var modalOpenPromise = this.$timeout(() => {
          modalInstance = this.$uibModal.open({
            templateUrl: "components/tables/templates/export-modal.html",
            controller: "ExportTableModalController",
            controllerAs: "etmc",
            backdrop: true,
            keyboard: true,
            animation: false,
            size: "lg"
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
        }, 500);

        this.Restangular.all(this.$scope.endpoint)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob"
        })
        .get('', params)
        .then((file) => {
          if (modalOpenPromise) {
            this.$timeout.cancel(modalOpenPromise);
          }
          this.$window.saveAs(file.data, this.$scope.endpoint + "_" +
                              this.$window.moment().format('YYYY-MM-DD') + "." +
                              fileType.toLowerCase());
        })
        .finally(() => {
          if (modalInstance) {
            modalInstance.close({ cancel: true });
          }
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
    constructor(private $uibModalInstance) {}
    cancel(): void {
      this.$uibModalInstance.close({
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
