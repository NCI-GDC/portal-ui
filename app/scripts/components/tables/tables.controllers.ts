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
      this.paging = $scope.paging;
      var currentSorting = $scope.paging.sort;

      $scope.sortColumns = _.reduce($scope.config.headings, (cols,col) => {

        if (col.sortable) {
          var obj = {
            key: col.id,
            name: col.displayName
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

          var sortObj = _.find($scope.sortColumns, (col: any) => { return col.key === sortField[0]; });

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

      // check localStorage for saved sorting
      var sortColumnsSaved = JSON.parse(this.$window.localStorage.getItem(this.$scope.config.title + '-sort'));
      _.each(sortColumnsSaved, (savedCol: Object) => {
        if (savedCol) {
          var sortObj = _.find($scope.sortColumns, (col: Object) => { return col.key === savedCol.key; });
          sortObj.sort = savedCol.sort || sortObj.sort;
          sortObj.order = savedCol.order || sortObj.order;
        }
      });

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
              return sortValue.sortMethod(a[sortValue.key], b[sortValue.key], order);
            }
            return defaultSort(a[sortValue.key], b[sortValue.key], order);
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

    updateSorting(): void {
      var save = _.reduce(this.$scope.sortColumns, (result, col) => {
                            var picked = _.pick(col, ['key', 'sort', 'order']);
                            if (picked && _.has(picked, 'sort')) {
                              result.push(picked);
                            }
                            return result;
                          }, []);

      this.$window.localStorage.setItem(this.$scope.config.title + '-sort',
                                        JSON.stringify(save));

      if (this.$scope.update) {
        this.clientSorting();
        return;
      }

      var pagination = this.LocationService.pagination();

      var sortString = "";

      _.each(this.$scope.sortColumns, (col: any, index: number) => {
        if(col.sort) {
          if (!col.order) {
            col.order = "asc";
          }

          sortString += col.key + ":" + col.order;

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

      $scope.$on("tableicious-loaded", () => {
        this.tableRendered = true;
      });

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

  interface IArrangeColumnsScope extends ng.IScope {
      listMap: any;
      list: any;
      order: any;
      config: any;
  }

  class ArrangeColumnsController {
    /* @ngInject */
    constructor(private $scope: IArrangeColumnsScope, private $window: IGDCWindowService) {
      //attempt to restore from localstorage
      var saved = JSON.parse($window.localStorage.getItem($scope.config.title + '-cols'));
      if (saved) {
        $scope.listMap = saved;
        var reordered = _.map($scope.listMap, (lmItem) => {
          var found = _.find($scope.list, (lItem) => {
            return lmItem.id === lItem.id;
          });
          if (found) {
            found.hidden = lmItem.hidden;
            found.canReorder = lmItem.canReorder;
            this.updateChildrenVisibility(found);
          }
          return found;
        });
        $scope.list = reordered;
      } else {
        this.initListMap();
      }

    }

    onMoved($index): void {
      this.$scope.listMap.splice($index,1);
      var list = this.$scope.list;
      this.$scope.list = this.$scope.listMap.map(function(elem){
        return _.find(list, function(li){
          return li.id === elem.id;
        });
      });
      this.$window.localStorage.setItem(this.$scope.config.title + '-cols', angular.toJson(this.$scope.listMap));
    }

    toggleVisibility(index: int): void {
      this.$scope.listMap[index].hidden = !this.$scope.listMap[index].hidden;
      var itemId = this.$scope.listMap[index].id;
      var matchingHeader = _.find(this.$scope.list, function(li) {
        return li.id === itemId;
      });
      if (matchingHeader) {
        matchingHeader.hidden = this.$scope.listMap[index].hidden;
        this.updateChildrenVisibility(matchingHeader);
      }
      this.$window.localStorage.setItem(this.$scope.config.title + '-cols', angular.toJson(this.$scope.listMap));
    }

    updateChildrenVisibility(parentCol: any): void {
      if (parentCol.children) {
          _.forEach(parentCol.children, (childCol) => { childCol.hidden = parentCol.hidden; });
      }
    }

    reset(): void {
      var reordered = _.map(this.$scope.config.order, (id) => {
          var found = _.find(this.$scope.list, (li) => {
            return id === li.id;
          });
          if (found) {
            found.hidden = false;
            found.canReorder = true;
            this.updateChildrenVisibility(found);
          }
          return found;
        });
      this.$scope.list = reordered;
      this.initListMap();
      this.$window.localStorage.removeItem(this.$scope.config.title + '-cols');
    }

    initListMap() {
     this.$scope.listMap = this.$scope.list.map(function (elem) {
              var composite = _.pick(elem, "id", "displayName", "hidden", "canReorder");
              if (composite.canReorder !== false) {
                composite.canReorder = true;
              }
              return composite;
        });
    }

  }

  angular.module("tables.controllers", ["location.services", "user.services"])
      .controller("TableSortController", TableSortController)
      .controller("GDCTableController", GDCTableController)
      .controller("ExportTableModalController", ExportTableModalController)
      .controller("ArrangeColumnsController", ArrangeColumnsController)
      .controller("ExportTableController", ExportTableController);
}

