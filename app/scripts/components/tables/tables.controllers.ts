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
    constructor(private $scope: ITableScope, private LocationService: ILocationService, private $window: IGDCWindowService, private LZString) {
      this.paging = $scope.paging;
      var currentSorting = $scope.paging.sort;

      $scope.sortColumns = _.reduce($scope.config.headings, (cols,col) => {

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

      this.restoreFromLocalStorage();
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
      var toSave = _.reduce(this.$scope.sortColumns, (result, col) => {
                            var picked = _.pick(col, ['id', 'sort', 'order']);
                            if (picked && _.has(picked, 'sort')) {
                              var saveObj = {
                                             'id': picked['id'],
                                             'sort': picked['sort'] ? 1 : 0,
                                             }
                              if (picked['sort']) {
                                saveObj['order'] = picked['order'];
                              }
                              result.push(saveObj);
                            }
                            return result;
                          }, []);

      this.$window.localStorage.setItem(this.$scope.config.title + '-sort',
                                        this.LZString.compress(JSON.stringify(toSave)));
    }

    restoreFromLocalStorage(): void {
      var decompressed = this.LZString.decompress(this.$window.localStorage.getItem(this.$scope.config.title + '-sort'));
      var sortColumnsSaved = decompressed ? JSON.parse(decompressed) : null;
      _.each(sortColumnsSaved, (savedCol: Object) => {
        if (savedCol) {
          var sortObj = _.find(this.$scope.sortColumns, (col: Object) => { return col.id === savedCol.id; });
          if (sortObj) {
            sortObj.sort = savedCol.sort ? true : false;
            sortObj.order = savedCol.order;
          }
        }
      });
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
      this.$scope.paging.count = this.displayedData.length;
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
          fields: fieldsAndExpand.fields.join(),
          expand: fieldsAndExpand.expand.join(),
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
          modalInstance.close({cancel: true});
          this.$window.saveAs(file, this.$scope.endpoint + "." +
                              this.$window.moment().format() + "." +
                              fileType.toLowerCase());
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

