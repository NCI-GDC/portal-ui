module ngApp.components.facets.controllers {
  import IFilesService = ngApp.files.services.IFilesService;

  enum KeyCode {
    Space = 32,
    Enter = 13,
    Esc = 27,
    Left = 37,
    Right = 39,
    Up = 38,
    Down = 40,
    Tab = 9
  }
  enum Cycle { Up = -1, Down = 1 }	

  import IFacetScope = ngApp.components.facets.models.IFacetScope;
  import IFacetService = ngApp.components.facets.services.IFacetService;
  import IFreeTextFacetsScope = ngApp.components.facets.models.IFreeTextFacetsScope;
  import IRangeFacetScope = ngApp.components.facets.models.IRangeFacetScope;
  import IDateFacetScope = ngApp.components.facets.models.IDateFacetScope;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;

  class Toggleable {

      constructor(public collapsed: boolean) {
      }

      toggle(event: any, property: string) {
        if (event.which === 1 || event.which === 13) {
          this[property] = !this[property];
        }

        if (property === "collapsed") {
          angular.element(event.target).attr("aria-collapsed", this.collapsed.toString());
        }
      }
    }

   export interface ITermsController {
    add(facet: string, term: string): void;
    remove(facet: string, term: string): void;
    actives: string[];
    inactives: string[];
    displayCount: number;
    originalDisplayCount: number;
    collapsed: boolean;
    expanded: boolean;
    toggle(event: any, property: string): void;
  }

  class TermsController implements ITermsController {
    title: string = "";
    name: string = "";
    displayCount: number = 5;
    originalDisplayCount: number = 5;
    collapsed: boolean = false;
    expanded: boolean = false;
    actives: string[] = [];
    inactives: string[] = [];

    /* @ngInject */
    constructor(private $scope: IFacetScope, private FacetService: IFacetService,
                private UserService: IUserService) {
      this.collapsed = $scope.collapsed === 'true' ? true : false;
      this.expanded = !!$scope.expanded;
      this.displayCount = this.originalDisplayCount = $scope.displayCount || 5;
      this.title = $scope.title;
      // TODO api should re-format the facets
      this.name = $scope.name;
      if ($scope.facet) {
        this.refresh($scope.facet.buckets);
      }

      $scope.$watch("facet", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh(n.buckets);
      });
    }

    add(facet: string, term: string): void {
      this.FacetService.addTerm(facet, term);
    }

    remove(facet: string, term: string): void {
      this.FacetService.removeTerm(facet, term);
    }

    refresh(terms) {
      var projectCodeKeys = [
        "project_id",
        "cases.project.project_id",
        "annotations.project.project_id",
        "project.project_id"
      ];

      if (projectCodeKeys.indexOf(this.name) !== -1) {
        terms = this.UserService.setUserProjectsTerms(terms);
      }

      this.terms = terms;
      this.actives = this.FacetService.getActives(this.name, terms);
      this.inactives = _.difference(terms, this.actives);
    }

    toggle(event: any, property: string) {
      if (event.which === 1 || event.which === 13) {
        this[property] = !this[property];
      }

      if (property === "collapsed") {
        angular.element(event.target).attr("aria-collapsed", this.collapsed.toString());
      }

      if (property === "expanded") {
        this.displayCount = this.expanded ? this.inactives.length : this.originalDisplayCount;
      }
    }
  }

  interface ICurrentFiltersController {
    build(): void;
    currentFilters: any;
    removeTerm(facet: string, term: string, event: any, op: string): void;
  }

  class CurrentFiltersController implements ICurrentFiltersController {
    currentFilters: any = [];

    /* @ngInject */
    constructor($scope: ng.IScope,
                private LocationService: ILocationService,
                private FacetService: IFacetService,
                private UserService: IUserService) {

      this.build();

      $scope.$on("$locationChangeSuccess", () => this.build());
    }

    removeTerm(facet: string, term: string, event: any, op: string) {
      if (event.which === 1 || event.which === 13) {
        this.FacetService.removeTerm(facet, term, op);
      }
    }

    isInMyProjects(filter: any) {
      var validCodes = [
        "project_id",
        "cases.project.project_id"
      ];

      return validCodes.indexOf(filter.content.field) !== -1 && this.UserService.currentUser &&
             this.UserService.currentUser.isFiltered;
    }

    resetQuery() {
      this.LocationService.clear();
    }

    expandTerms(event: any, filter: any) {
      if (event.which === 1 || event.which === 13) {
        filter.expanded = !filter.expanded;
      }
    }

    build() {
      this.currentFilters = _.sortBy(this.LocationService.filters().content, function(item: any) {
        return item.content.field;
      });
    }

  }

  interface IFreeTextController {
    actives: string[];
    searchTerm: string;
    termSelected(): void;
    remove(term: string): void;
    refresh(): void;
    autoComplete(query: string): ng.IPromise<any>;
  }

  class FreeTextController extends Toggleable implements IFreeTextController {
    searchTerm: string = "";
    actives: string[] = [];

    /* @ngInject */
    constructor(private $scope: IFreeTextFacetsScope,
                private LocationService: ILocationService,
                private FacetService: IFacetService) {
      this.refresh();
      $scope.$watch("searchTerm", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh();
      });

      $scope.$on("$locationChangeSuccess", () => this.refresh());
    }

    termSelected(): void {
      var parts = this.$scope.field.split(".");
      var field = parts.length > 1 ? parts[parts.length - 1] : parts[0];

      if (this.actives.indexOf(this.searchTerm[field]) === -1) {
        var term = this.searchTerm;
        term = term[field];

        this.FacetService.addTerm(this.$scope.field, term);
        this.actives.push(this.searchTerm);
        this.searchTerm = "";
      } else {
        this.searchTerm = "";
      }
    }

    autoComplete(query: string): ng.IPromise<any> {
      return this.FacetService.autoComplete(this.$scope.entity, query, this.$scope.field);
    }

    remove(term: string): void {
      this.FacetService.removeTerm(this.$scope.field, term);
      this.refresh();
    }

    refresh(): void {
      this.actives = this.FacetService.getActiveIDs(this.$scope.field);
    }

  }

  interface IRangeFacetController {
    boundChange(upperOrLower: string): void;
  }

  class RangeFacetController extends Toggleable implements IRangeFacetController {
    activesWithOperator: Object;

    /* @ngInject */
    constructor(private $scope: IRangeFacetScope,
                private LocationService: ILocationService,
                private FacetService: IFacetService) {

      $scope.data = [];
      $scope.dataUnitConverted = [];
      $scope.lowerBoundOriginalDays = null;
      $scope.upperBoundOriginalDays = null;

      if(!$scope.unitsMap) {
        $scope.unitsMap = [
              {
                "label": "none",
                "conversionDivisor": 1,
              }
            ];
      }

      $scope.selectedUnit = $scope.unitsMap[0];

      this.refresh();
      $scope.$on("$locationChangeSuccess", () => this.refresh());

      $scope.$watch("facet", (n, o) => {
        if ((n === o && ($scope.min !== undefined || $scope.max !== undefined)) || n === undefined) {
          return;
        }

        $scope.data = _.reject(n.buckets, (bucket) => { return bucket.key === "_missing"; });
        $scope.dataUnitConverted = this.unitConversion($scope.data);
        this.getMaxMin($scope.dataUnitConverted);
      });

      var _this = this;
      $scope.unitClicked = function() {
        $scope.dataUnitConverted = _this.unitConversion($scope.data);
        _this.getMaxMin($scope.dataUnitConverted);
        _this.$scope.lowerBound = _this.$scope.lowerBoundOriginalDays ? Math.floor(_this.$scope.lowerBoundOriginalDays / _this.$scope.selectedUnit.conversionDivisor) : null;
        _this.$scope.upperBound = _this.$scope.upperBoundOriginalDays ? Math.ceil(_this.$scope.upperBoundOriginalDays / _this.$scope.selectedUnit.conversionDivisor) : null;
      };

    }

    unitConversion(data: Object[]): Object[] {
      if(this.$scope.unitsMap) {
        return _.reduce(data, (result, datum) => {
          var newKey = Math.floor(datum.key/this.$scope.selectedUnit.conversionDivisor);
          var summed = _.find(result, _.matchesProperty('key', newKey));
          if (summed) {
            summed.doc_count = summed.doc_count + datum.doc_count;
          } else {
            result.push({
              "key": newKey,
              "doc_count": datum.doc_count
            });
          }
          return result;
        }, []);
      } else {
        return data;
      }
    }

    getMaxMin(data: Object[]): void {
      this.$scope.min = _.min(data, (bucket) => {
          return bucket.key === '_missing' ? Number.POSITIVE_INFINITY : parseInt(bucket.key, 10);
        }).key;
        if (this.$scope.min === '_missing') {
          this.$scope.min = null;
        }
        this.$scope.max = _.max(data, (bucket) => {
          return bucket.key === '_missing' ? Number.NEGATIVE_INFINITY : parseInt(bucket.key, 10);
        }).key;
        if (this.$scope.max === '_missing') {
          this.$scope.max = null;
        }
    }

    refresh(): void {
      this.activesWithOperator = this.FacetService.getActivesWithOperator(this.$scope.field);
      if (_.has(this.activesWithOperator, '>=')) {
        this.$scope.lowerBound = Math.floor(this.activesWithOperator['>='] / this.$scope.selectedUnit.conversionDivisor);
      } else {
        this.$scope.lowerBound = null;
      }
      if (_.has(this.activesWithOperator, '<=')) {
        this.$scope.upperBound = Math.ceil(this.activesWithOperator['<='] / this.$scope.selectedUnit.conversionDivisor);
      } else {
        this.$scope.upperBound = null;
      }
    }

    inputChanged() {
      var numRegex = /^\d+$/;
      if (this.$scope.lowerBound) {
        if(!numRegex.test(this.$scope.lowerBound)) {
          this.$scope.lowerBound = 0;
        }
      }

      if (this.$scope.upperBound) {
        if(!numRegex.test(this.$scope.upperBound)) {
          this.$scope.upperBound = 0;
        }
      }
      this.$scope.lowerBoundOriginalDays = this.$scope.lowerBound * this.$scope.selectedUnit.conversionDivisor;
      this.$scope.upperBoundOriginalDays = this.$scope.upperBound * this.$scope.selectedUnit.conversionDivisor;
    }

    setBounds() {
      if (this.$scope.lowerBound) {
        if (_.has(this.activesWithOperator, '>=')) {
          this.FacetService.removeTerm(this.$scope.field, null, ">=");
        }
        this.FacetService.addTerm(this.$scope.field, this.$scope.lowerBound * this.$scope.selectedUnit.conversionDivisor, ">=");
      } else {
        this.FacetService.removeTerm(this.$scope.field, null, ">=");
      }
      if (this.$scope.upperBound) {
        if (_.has(this.activesWithOperator, '<=')) {
          this.FacetService.removeTerm(this.$scope.field, null, "<=");
        }
        this.FacetService.addTerm(this.$scope.field, this.$scope.upperBound * this.$scope.selectedUnit.conversionDivisor, "<=");
      } else {
        this.FacetService.removeTerm(this.$scope.field, null, "<=");
      }
    }
  }

  interface IDateFacetController {
    open($event: any, startOrEnd: string): void;
    refresh(): void;
    search(): void;
  }

  class DateFacetController extends Toggleable implements IDateFacetController {
    /* @ngInject */
    active: boolean = false;
    name: string = "";

    constructor(private $scope: IDateFacetScope, private $window: IGDCWindowService, private FacetService: IFacetService) {
      this.$scope.date = $window.moment().format("MM/DD/YYYY");

      this.refresh();
      $scope.$on("$locationChangeSuccess", () => this.refresh());
      this.$scope.opened = false;
      this.$scope.dateOptions = {
          formatDay: "DD",
          formatMonth: "MMMM",
          formatDayHeader: "dd",
          formatDayTitle: "MMMM YYYY",
          formatYear: "YYYY",
          formatMonthTitle: "YYYY",
          showWeeks: false,
          startingDay: 1
      };
      this.name = $scope.name;
    }

    refresh(): void {
      var actives = this.FacetService.getActivesWithValue(this.$scope.name);
      if (_.size(actives) > 0) {
        this.$scope.date = this.$window.moment(actives[this.$scope.name] * 1000);
      }
    }

    open($event: any): void{
      $event.preventDefault();
      $event.stopPropagation();
      this.$scope.opened = true;
    }

    search(): void {
      var actives = this.FacetService.getActivesWithValue(this.$scope.name);
      if (_.size(actives) > 0) {
        this.FacetService.removeTerm(this.name, undefined, '>=');
      }
      this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date).format('X'), '>=');
    }

  }

  class CustomFacetsController {
    private ds: restangular.IElement;
    public selectedIndex: number;
    private offsets: Array<number>;

      /* @ngInject */
      constructor(public facetFields: Array<Object>,
                  private $scope: ng.IScope,
                  private $modalInstance,
                  private $window: IGDCWindowService,
                  private Restangular: restangular.IService,
                  private FilesService: IFilesService,
                  private ParticipantsService: IParticipantsService,
                  private $filter: any,
                  private facetsConfig: any,
                  private LocationService: ILocationService,
                  private aggregations: any,
                  public docType: string) {

      this.selectedIndex = 0;

      this.offsets = [];

      var _this = this;
      $scope.keyboardListener = function(e: any) {
        var key = e.which || e.keyCode
        switch (key) {
            case KeyCode.Enter:
              e.preventDefault();
              _this.addFacet();
              break;
            case KeyCode.Up:
              e.preventDefault();
              _this.setSelectedIndex(Cycle.Up);
              break;
            case KeyCode.Down:
              e.preventDefault();
              _this.setSelectedIndex(Cycle.Down);
              break;
            case KeyCode.Esc:
              _this.$modalStack.dismissAll();
              break;
            case KeyCode.Tab:
              e.preventDefault();
              break;
          }
      };

      $scope.itemHover = function(index: number) {
        _this.selectedIndex = index;
      };

    }

    closeModal(): void {
      this.$modalInstance.dismiss('cancel');
    }

    addFacet() {
      var selectedField = this.$scope.filteredFields[this.selectedIndex];
      var fileOptions = {
        fields: [],
        expand: [],
        facets: [selectedField['field']],
        filters: this.LocationService.filters()
      };

      if (selectedField['doc_type'] === "files") {
        this.FilesService.getFiles(fileOptions).then((data: IFiles) => {
          _.assign(this.aggregations, data.aggregations);
        });
      } else if (selectedField['doc_type'] === "cases") {
        this.ParticipantsService.getParticipants(fileOptions).then((data: IParticipant) => {
          _.assign(this.aggregations, data.aggregations);
        });
      }

      this.facetsConfig.unshift({
          name: selectedField['field'],
          title: selectedField['field'],
          collapsed: false,
          facetType: selectedField['type'] === 'long' ? "range" : "terms",
          removable: true
      });
      this.$modalInstance.dismiss('added facet');
    }

    setSelectedIndex(direction: Cycle) {
      if (direction == Cycle.Up) {
        if (this.selectedIndex === 0) {
          this.selectedIndex = (this.$scope.filteredFields.length - 1);
          document.getElementById('add-facets-modal').scrollTop = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-')).offsetTop;
        } else {
          this.selectedIndex--;
          this.scrollToSelected(Cycle.Up);
        }
      }
      if (direction == Cycle.Down) {
        if (this.selectedIndex  === (this.$scope.filteredFields.length - 1)) {
          this.selectedIndex = 0;
          document.getElementById('add-facets-modal').scrollTop = 0;
        } else {
          this.selectedIndex++;
          this.scrollToSelected(Cycle.Down);
        }
      }
    }

    scrollToSelected(direction: Cycle) {
      var modalElement = document.getElementById('add-facets-modal')
      var selectedElement = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-'));
      this.offsets = [];
      for (var i = 0; i < this.$scope.filteredFields.length; i++) {
        this.offsets.push(document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[i].field, '-')).offsetTop);
      }
      var currentTopPos = modalElement.scrollTop;
      var nearestIndex = -1;
      var minDiff = Number.MAX_VALUE;
      for (var i = 0; i < this.offsets.length; i++) {
        var currentDiff = Math.abs(currentTopPos - this.offsets[i]);
        if (currentDiff < minDiff) {
          minDiff = currentDiff;
          nearestIndex = i;
        }
      }
      if (direction === Cycle.Up) {
        if (selectedElement.offsetTop < modalElement.scrollTop) {
          modalElement.scrollTop = this.offsets[nearestIndex-1]
        }
      } else if (direction === Cycle.Down) {
        if (selectedElement.offsetTop + 4 > modalElement.scrollTop + modalElement.clientHeight) {
          modalElement.scrollTop = this.offsets[nearestIndex+1];
        }
      }
    }

    inputChanged() {
      if (this.$scope.filteredFields.length < this.selectedIndex) {
        this.selectedIndex = 0;
      }
    }
  }

  class AddCustomFacetsController {
    private modalInstance: any;
    public defaultConfig: Array<Object>;

    /* @ngInject */
    constructor(private $scope: ng.IScope,
                private $modalStack,
                private $modal,
                private LocationService: ILocationService) {

      this.defaultConfig = _.clone($scope.facetsConfig, true);
      $scope.$on("$stateChangeStart", () => {
        if (this.modalInstance) {
          this.modalInstance.close();
        }
      });

    }

    openModal(): void {
      // Modal stack is a helper service. Used to figure out if one is currently
      // open already.
      if (this.$modalStack.getTop()) {
        return;
      }

      this.modalInstance = this.$modal.open({
        templateUrl: "components/facets/templates/add-facets-modal.html",
        backdrop: true,
        controller: "customFacetsCtrl as cufc",
        keyboard: true,
        animation: false,
        size: "lg",
        resolve: {
            /** @ngInject */
            facetFields: (CustomFacetsService: ICustomFacetsService): ng.IPromise<any> => {
              return CustomFacetsService.getFacetFields(this.$scope.docType);
            },
            facetsConfig: () => { return this.$scope.facetsConfig; },
            aggregations: () => { return this.$scope.aggregations; },
            docType: () => { return this.$scope.docType; }
          }
      });
    }

    reset(): void {
      this.LocationService.clear();
      this.$scope.facetsConfig = _.clone(this.defaultConfig, true);
    }

  }

  angular.module("facets.controllers", ["facets.services", "user.services", "files.services"])
        .controller("currentFiltersCtrl", CurrentFiltersController)
        .controller("freeTextCtrl", FreeTextController)
        .controller("rangeFacetCtrl", RangeFacetController)
        .controller("dateFacetCtrl", DateFacetController)
        .controller("customFacetsCtrl", CustomFacetsController)
        .controller("addCustomFacetsController", AddCustomFacetsController)
        .controller("termsCtrl", TermsController);
}
