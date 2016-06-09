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
  import IFacetsConfigService = ngApp.components.facets.services.IFacetsConfigService;
  import ICustomFacetsService = ngApp.components.facets.services.ICustomFacetsService;

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
    addMissing(facet: string): void;
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
    error: string = undefined;
    terms: string[];

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
        if ($scope.facet.buckets) {
          this.refresh($scope.facet.buckets);
        } else {
          this.error = $scope.facet;
        }
      }

      $scope.$watch("facet", (n, o) => {
        if (n === o) {
          return;
        }
        if (n.buckets) {
          this.refresh(n.buckets);
        } else {
          this.error = n;
        }
      });
    }

    add(facet: string, term: string): void {
      this.FacetService.addTerm(facet, term);
    }

    addMissing(facet: string): void {
      this.FacetService.addTerm(facet, 'MISSING', 'is');
    }

    remove(facet: string, term: string): void {
      (term === '_missing') ?
        this.FacetService.removeTerm(facet, 'MISSING', 'is') :
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

    clear(facet: string) {
      this.FacetService.removeFacet(facet);
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

    removeOp(facet: string, op: string, event: any) {
      if (event.which === 1 || event.which === 13) {
        this.FacetService.removeOp(facet, op);
      }
    }

    removeTerm(facet: string, term: string, event: any, op: string) {
      if (event.which === 1 || event.which === 13) {
        if (term === 'No Data') {
          this.FacetService.removeTerm(facet, 'MISSING', 'is');
        } else {
          this.FacetService.removeTerm(facet, term, op);
        }
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
      const missingAlias = 'No Data';
      const isMissing = (filter) => (filter.op === 'is' && filter.content.value === 'MISSING');
      // Since the UI cannot generate complex filter objects, the only exception we need to handle is having MISSING and `in` values together. We need to combine combine these values and push them up and make the operator an `in`.
      // If, in the future, the UI can generate more complex filter object, such as adding support to `not`, then this piece needs to be revisited.
      const filters = (this.LocationService.filters().content || []).map(f => {
        if (f.op === 'or' && _.isArray(f.content) && f.content.length) {
          return {
            op: 'in',
            content: {
              field: f.content[0].content.field,
              value: f.content.reduce((acc, o) => acc.concat(isMissing(o) ? missingAlias : o.content.value), [])
            }
          };
        } else if (isMissing(f)) {
          return {
            op: 'in',
            content: {
              field: f.content.field,
              value: [missingAlias]
            }
          };
        } else {
          return f;
        }
      });

      this.currentFilters = _.sortBy(filters, (item: any) => item.content.field);
    }

  }

  interface IFreeTextController {
    actives: string[];
    searchTerm: string;
    termSelected(): void;
    setTerm(): void;
    remove(term: string): void;
    refresh(): void;
    autoComplete(query: string): ng.IPromise<any>;
    autocomplete: boolean;
  }

  class FreeTextController extends Toggleable implements IFreeTextController {
    searchTerm: string = "";
    actives: string[] = [];
    autocomplete: boolean = true;
    lastInput: string = "";

    /* @ngInject */
    constructor(private $scope: IFreeTextFacetsScope,
                private LocationService: ILocationService,
                private FacetService: IFacetService) {

      this.autocomplete = $scope.autocomplete !== 'false';

      this.refresh();
      $scope.$watch("searchTerm", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh();
      });

      $scope.$on("$locationChangeSuccess", () => this.refresh());
    }

    saveInput(): void {
      this.searchTerm = this.searchTerm.replace(/[^a-zA-Z0-9-_.]/g, '');
      this.lastInput = this.searchTerm;
    }

    termSelected(addTerm: boolean = true): void {
      if(!addTerm) {
        this.searchTerm = this.lastInput;
        return;
      }

      var parts = this.$scope.field.split(".");
      var field = parts.length > 1 ? parts[parts.length - 1] : parts[0];

      if (this.actives.indexOf(this.searchTerm[field]) === -1) {
        var term = this.searchTerm;
        term = term[field];

        if (!term) {
          this.searchTerm = this.lastInput;
          return;
        }

        this.FacetService.addTerm(this.$scope.field, term);
        this.actives.push(this.searchTerm);
        this.searchTerm = "";
      } else {
        this.searchTerm = "";
      }
    }

    setTerm(): void {
      if (this.searchTerm === "") {
        return;
      }
      this.FacetService.addTerm(this.$scope.field, this.searchTerm);
      this.actives.push(this.searchTerm);
      this.searchTerm = "";
    }

    autoComplete(query: string): ng.IPromise<any> {
      return this.FacetService.autoComplete(this.$scope.entity, query, this.$scope.field);
    }

    prefixValue(query: string): ng.IPromise<any> {
      term = query.replace(/\*/g, '') + '*';
      var model = { term: term };
      model[this.$scope.field.split('.').pop()] = term;
      return [model];
    }

    remove(term: string): void {
      this.FacetService.removeTerm(this.$scope.field, term);
      this.refresh();
    }

    refresh(): void {
      this.actives = this.FacetService.getActiveIDs(this.$scope.field);
    }

  }

  class RangeFacetController extends Toggleable {
    activesWithOperator: Object;
    error: string = undefined;
    lowerBound: number = null;
    upperBound: number = null;
    conversionFactor: number = 365.25;
    selectedUnit: string = 'years';
    displayedMax: number = 0;
    displayedMin: number = 0;

    /* @ngInject */
    constructor(private $scope: IRangeFacetScope,
                private $filter: ng.IFilterService,
                private LocationService: ILocationService,
                private FacetService: IFacetService) {

      $scope.lowerBoundFinal = null;
      $scope.upperBoundFinal = null;
      $scope.data = $scope.facet || { count: '0',
                      max: '0',
                      min: '0'
                    };

      this.refresh();
      $scope.$on("$locationChangeSuccess", () => this.refresh());

      $scope.$watch("facet", (n, o) => {
        if (n === o || n === undefined) {
          return;
        }
        if (n) {
          $scope.data = n;
          this.convertMaxMin();
        } else {
          this.error = n;
        }
      });

    }

    // when textboxes change convert to days right away and store
    // when conversions are done after, it's always from days.
    inputChanged() {
      if (!this.$scope.convertDays || this.selectedUnit === 'days'){
        this.$scope.upperBoundFinal = this.upperBound;
        this.$scope.lowerBoundFinal = this.lowerBound;
      }
      else if (this.selectedUnit === 'years') {
        this.$scope.upperBoundFinal = this.upperBound ? Math.floor(this.upperBound * this.conversionFactor + this.conversionFactor - 1) : null;
        this.$scope.lowerBoundFinal = this.lowerBound ? Math.floor(this.lowerBound * this.conversionFactor) : null;
      }
    }

    unitClicked(): void {
      this.convertUserInputs();
      this.convertMaxMin();
    }

    convertUserInputs() {
      if (!this.$scope.convertDays || this.selectedUnit === 'days') {
        this.lowerBound = this.$scope.lowerBoundFinal;
        this.upperBound = this.$scope.upperBoundFinal;
      } else if (this.selectedUnit === 'years') {
        this.lowerBound = this.$scope.lowerBoundFinal ? Math.ceil(this.$scope.lowerBoundFinal / this.conversionFactor) : null;
        this.upperBound = this.$scope.upperBoundFinal ? Math.ceil((this.$scope.upperBoundFinal + 1 - this.conversionFactor) / this.conversionFactor) : null;
      }
    }

    convertMaxMin() {
      if (!this.$scope.convertDays || this.selectedUnit === 'days') {
        this.displayedMin = this.$scope.data.min;
        this.displayedMax = this.$scope.data.max;
      } else if (this.selectedUnit === 'years') {
        this.displayedMax = this.$filter("ageDisplay")(this.$scope.data.max, true, 0);
        this.displayedMin = this.$filter("ageDisplay")(this.$scope.data.min, true, 0);
      }
    }

    refresh(): void {
      const opValueMap = this.FacetService.facetOpValueMap(this.$scope.field);

      this.$scope.lowerBoundFinal = (opValueMap['>='] || [])[0] || null;
      this.$scope.upperBoundFinal = (opValueMap['<='] || [])[0] || null;
      this.convertMaxMin();
      this.convertUserInputs();
    }

    setBounds() {
      this.FacetService.removeOp(this.$scope.field, '>=');
      if (this.lowerBound) {
        this.FacetService.addTerm(this.$scope.field, this.$scope.lowerBoundFinal, ">=");
      }

      this.FacetService.removeOp(this.$scope.field, '<=');
      if (this.upperBound) {
        this.FacetService.addTerm(this.$scope.field, this.$scope.upperBoundFinal, "<=");
      }
    }
  }

  interface IDateFacetController {
    open($event: any, startOrEnd: string): void;
    refresh(): void;
    search(): void;
  }

  class DateFacetController extends Toggleable implements IDateFacetController {
    active: boolean = false;
    name: string = "";

    /* @ngInject */
    constructor(private $scope: IDateFacetScope,
                private $window: IGDCWindowService,
                private FacetService: IFacetService,
                private uibDateParser: any) {
      this.$scope.date = new Date();

      this.refresh();
      $scope.$on("$locationChangeSuccess", () => this.refresh());
      this.$scope.opened = false;
      this.$scope.dateOptions = {
          showWeeks: false,
          startingDay: 1
      };
      this.name = $scope.name;
    }

    refresh(): void {
      const facet = this.$scope.name;
      const actives = this.FacetService.getActiveIDs(facet);
      if (actives.length) {
        this.$scope.date = this.$window.moment(actives[0]).toDate();
      }
    }

    open($event: any): void{
      $event.preventDefault();
      $event.stopPropagation();
      this.$scope.opened = true;
    }

    search(): void {
      this.FacetService.removeOp(this.name, '>=');
      this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date).format('YYYY-MM-DD'), '>=');
    }

  }

  class CustomFacetsModalController {
    private ds: restangular.IElement;
    public selectedIndex: number;

      /* @ngInject */
      constructor(public facetFields: Array<Object>,
                  private $scope: ng.IScope,
                  private $rootScope: IRootScope,
                  private $uibModalInstance,
                  private $window: IGDCWindowService,
                  private Restangular: restangular.IService,
                  private FilesService: IFilesService,
                  private ParticipantsService: IParticipantsService,
                  private $filter: any,
                  private facetsConfig: any,
                  private LocationService: ILocationService,
                  private FacetsConfigService: IFacetsConfigService,
                  private CustomFacetsService: ICustomFacetsService,
                  private aggregations: any,
                  public docType: string) {
      this.selectedIndex = 0;

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
              if (_this.$uibModalStack) _this.$uibModalStack.dismissAll();
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
      this.$uibModalInstance.dismiss('cancel');
    }

    addFacet() {
      var selectedField = this.$scope.filteredFields[this.selectedIndex];
      if (!selectedField) return;
      var fileOptions = {
        fields: [],
        expand: [],
        facets: [selectedField['field']],
        filters: this.LocationService.filters()
      };

      if (selectedField['doc_type'] === "files") {
        this.FilesService.getFiles(fileOptions).then((data: IFiles) => {
          _.assign(this.aggregations, data.aggregations);
          }, (response) => {
            this.aggregations[selectedField['field']] = 'error';
            return this.aggregations;
          });
      } else if (selectedField['doc_type'] === "cases") {
        this.ParticipantsService.getParticipants(fileOptions).then((data: IParticipant) => {
          _.assign(this.aggregations, data.aggregations);
          }, (response) => {
            this.aggregations[selectedField['field']] = 'error';
            return this.aggregations;
          });
      }

      this.FacetsConfigService.addField(selectedField['doc_type'], selectedField['field'], selectedField['type']);
      this.$uibModalInstance.dismiss('added facet');
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
      var styles = window.getComputedStyle(document.getElementById('facets-list'));
      var marginHeight = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']) || 10;
      if (direction === Cycle.Up) {
        if (selectedElement.offsetTop < modalElement.scrollTop) {
          modalElement.scrollTop = modalElement.scrollTop - selectedElement.offsetHeight - marginHeight;
        }
      } else if (direction === Cycle.Down) {
        if (selectedElement.offsetTop + selectedElement.offsetHeight > modalElement.scrollTop + modalElement.clientHeight) {
          modalElement.scrollTop = modalElement.scrollTop + selectedElement.offsetHeight + marginHeight;
        }
      }
    }

    inputChanged() {
      if (this.$scope.filteredFields.length < this.selectedIndex) {
        this.selectedIndex = 0;
      }
    }

    toggleEmpty() {
      if (!this.CustomFacetsService.nonEmptyOnlyDisplayed) {
          this.$rootScope.$emit('ShowLoadingScreen');
          this.CustomFacetsService.getNonEmptyFacetFields(this.docType, this.facetFields)
          .then(data => {
            this.CustomFacetsService.nonEmptyOnlyDisplayed = true;
            this.facetFields = this.CustomFacetsService.filterFields(this.docType, data);
          }).finally(() => this.$rootScope.$emit('ClearLoadingScreen'));
      } else {
        this.$rootScope.$emit('ShowLoadingScreen');
        this.CustomFacetsService.getFacetFields(this.$scope.docType)
        .then(data => {
          this.CustomFacetsService.nonEmptyOnlyDisplayed = false;
          this.facetFields = this.CustomFacetsService.filterFields(this.docType, data);
        })
        .finally(() => this.$rootScope.$emit('ClearLoadingScreen'));
      }
    }

  }

  class AddCustomFacetsPanelController {
    private modalInstance: any;
    public defaultConfig: Array<Object>;

    /* @ngInject */
    constructor(private $scope: ng.IScope,
                private $uibModalStack: any,
                private $uibModal: any,
                private FacetsConfigService: IFacetsConfigService,
                private LocationService: ILocationService) {

      $scope.$on("$stateChangeStart", () => {
        if (this.modalInstance) {
          this.modalInstance.close();
        }
      });

    }

    openModal(): void {
      // Modal stack is a helper service. Used to figure out if one is currently
      // open already.
      if (this.$uibModalStack.getTop()) {
        return;
      }

      this.modalInstance = this.$uibModal.open({
        templateUrl: "components/facets/templates/add-facets-modal.html",
        backdrop: true,
        controller: "customFacetsModalController as cufc",
        keyboard: true,
        animation: false,
        size: "lg",
        resolve: {
            /** @ngInject */
            facetFields: (CustomFacetsService: ICustomFacetsService, $rootScope: IRootScope): ng.IPromise<any> => {
              $rootScope.$emit('ShowLoadingScreen');
              return CustomFacetsService.getFacetFields(this.$scope.docType)
                     .then(data => {
                        if (CustomFacetsService.nonEmptyOnlyDisplayed) {
                          return CustomFacetsService.getNonEmptyFacetFields(this.$scope.docType, _.map(data, (v, k) => v));
                        }
                        return data;
                      }).then(data => CustomFacetsService.filterFields(this.$scope.docType, data))
                      .finally(() => $rootScope.$emit('ClearLoadingScreen'));
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
      this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date), '>=');
    }

  }

  angular.module("facets.controllers", ["facets.services", "user.services", "files.services"])
        .controller("currentFiltersCtrl", CurrentFiltersController)
        .controller("freeTextCtrl", FreeTextController)
        .controller("rangeFacetCtrl", RangeFacetController)
        .controller("dateFacetCtrl", DateFacetController)
        .controller("customFacetsModalController", CustomFacetsModalController)
        .controller("addCustomFacetsPanelController", AddCustomFacetsPanelController)
        .controller("termsCtrl", TermsController);
}
