module ngApp.components.quickSearch.controllers {

  interface IQuickSearchModalController {
    searchQuery: string;
    results: any[];
    selectedItem: any;
    displayItem: any;
    getDetails(type, id): ng.IPromise<any>;
    goTo(entity: string, id: string): void;
    keyboardListener(e: any): void;
    search(): void;
  }

  class QuickSearchModalController implements IQuickSearchModalController {
    searchQuery: string = "";
    results: any[];
    selectedItem: any;
    displayItem: any;

    /* @ngInject */
    constructor(private $modalInstance, private FacetService, private $window,
                private FilesService, private ParticipantsService, private ProjectsService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableParticipantsModel: TableiciousConfig,
                private ProjectTableModel: TableiciousConfig,
                private AnnotationsTableModel: TableiciousConfig,
                private $state: ng.ui.IStateService) {}

    getMatchingTerms(obj, matchedTerms, baseId) {
      var skipKeys = [
        "_index",
        "_score",
        "_type"
      ];

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && skipKeys.indexOf(key) === -1) {
          if (_.isArray(obj[key])) {
            for (var i = 0; i < obj[key].length; i++) {
              this.getMatchingTerms(obj[key][i], matchedTerms, baseId);
            }
          }

          // Array check first here is important to distingquish types.
          if (_.isObject(obj[key])) {
            this.getMatchingTerms(obj[key], matchedTerms, baseId);
          }

          if (typeof obj === "string" && obj !== baseId) {
            if (obj.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1) {
              matchedTerms.push(obj);
            }
          }
        }
      }
    }

    getDetails(type, id): ng.IPromise<any> {
      if (type === "file") {
        return this.FilesService.getFile(id, {
            fields: this.SearchTableFilesModel.fields,
            expand: this.SearchTableFilesModel.expand
          })
          .then((data) => {
            this.displayItem = data;
            return data;
          });
      } else if (type === "project") {
        return this.ProjectsService.getProject(id, {
            fields: this.ProjectTableModel.fields,
            expand: this.ProjectTableModel.fields
          })
          .then((data) => {
            this.displayItem = data;
            return data;
          });
      } else if (type === "participant") {
        var expand = this.SearchTableParticipantsModel.expand.slice();

        // We don't need the files/summary information for display. Prune it for smaller
        // response sizes
        expand.splice(expand.indexOf("files"), 1);
        expand.splice(expand.indexOf("summary.data_types"), 1);
        expand.splice(expand.indexOf("summary.experimental_strategies"), 1);

        return this.ParticipantsService.getParticipant(id, {
            fields: this.SearchTableParticipantsModel.fields,
            expand: expand
          })
          .then((data) => {
            this.displayItem = data;
            return data;
          });
      }
    }

    goTo(entity, id) {
      if (this.$state.params[entity + "Id"] === id) {
        this.$modalInstance.close();
        angular.element(this.$window.document).off("keydown");
        return;
      }

      var options = {};
      options[entity + "Id"] = id;
      angular.element(this.$window.document).off("keydown");
      this.$state.go(entity, options, { inherit: false });
    }

    keyboardListener(e: any) {
      var self = this;

      function selectItem(dir) {
        var list = angular.element("#quick-search-list"),
            selected = list.find(".selected"),
            listChildren = list.children(),
            newIndex;

        _.forEach(list.children(), (elem, index) => {
          if (elem === selected[0]) {
            _.filter(self.results.hits, (item) => { return item.selected; }).selected = false;

            if (dir === "down" && index + 1 < listChildren.length) {

              newIndex = index + 1;
            } else if (dir === "up" && index - 1 >= 0) {
              newIndex = index - 1;
            } else {
              newIndex = index;
            }
          }
        });

        selected.removeClass("selected");
        angular.element(listChildren[newIndex]).addClass("selected");
        self.results.hits[newIndex].selected = true;
        self.selectedItem = self.results.hits[newIndex];
        self.getDetails(self.selectedItem._type, self.selectedItem._id);
      }

      var modalInput = angular.element("#quick-search-modal input")
      // Down Key
      if (e.which === 40) {
        e.preventDefault();
        selectItem("down");
        return;
      }

      // Up Key
      if (e.which === 38) {
        e.preventDefault();
        selectItem("up");
        return;
      }

      // Enter Key
      if (e.which === 13) {
        this.goTo(this.selectedItem._type, this.selectedItem._id);
        return;
      }

      if (e.which === 27) {
        angular.element(this.$window.document).off("keydown");
        this.$modalInstance.close();
        return;
      }

      // Ignored Keys
      var ignoredKeys = [
        91, // Left Command/Meta
        93, // Right Command/Meta
        20, // CAPS
        17, // Control
        18, // Alt/Option
        9, // Tab
        39, // Right Key
        37 // Left Key
      ];

      if (ignoredKeys.indexOf(e.which) === -1 && !modalInput.is(":focus")) {
        // Focus input and add that value
        modalInput.focus();
      }
    }

    setupListeners() {
      if (!this.results.hits.length) {
        return;
      }

      this.results.hits[0].selected = true;
      this.selectedItem = this.results.hits[0];

      this.getDetails(this.selectedItem._type, this.selectedItem._id)
        .then((data) => {
          // Race condition can occur with quick responses. Just always clear
          // active event listeners here.
          angular.element(this.$window.document).off("keydown");
          angular.element(this.$window.document).on("keydown", (e) => {
            this.keyboardListener(e);
          });
        });
    }

    itemHover(e: any, item: any) {
      var list = angular.element("#quick-search-list"),
          selected = list.find(".selected");

      selected.removeClass("selected");
      angular.element(e.target).addClass("selected");
      item.selected = true;
      this.selectedItem = item;
      this.getDetails(this.selectedItem._type, this.selectedItem._id);
    }

    search() {
      if (!this.searchQuery || !this.searchQuery.trim()) {
        this.results = [];
        this.selectedItem = null;
        this.displayItem = null;
        return;
      }

      angular.element(this.$window.document).off("keydown");

      this.FacetService.searchAll(this.searchQuery.trim())
      .then((data) => {
        if (!data.length) {
          this.selectedItem = null;
        }
        this.results = null;

        for (var i = 0; i < data.hits.length; i++) {
          var matchedTerms = [];
          this.getMatchingTerms(data.hits[i], matchedTerms, data.hits[i]._id);
          matchedTerms = _.uniq(matchedTerms);

          // Three is just an arbitrary number I picked based on space.
          if (matchedTerms.length > 3) {
            matchedTerms.sort((a, b) => {
              var aPercentage = this.searchQuery.length / a.length;
              var bPercentage = this.searchQuery.length / b.length;
              if (a > b) {
                return -1;
              }

              if (a < b) {
                return 1;
              }

              return 0;
            });

            matchedTerms = matchedTerms.slice(0, 3);
          }

          data.hits[i].matchedTerms = matchedTerms;
        }

        this.results = _.assign({}, data);
        this.setupListeners();
      });
    }
  }

  angular
      .module("quickSearch.controller", [
        "facets.services",
        "files.services",
        "participants.services",
        "projects.services",
        "search.table.files.model",
        "search.table.participants.model",
        "projects.table.model"
      ])
      .controller("QuickSearchModalController", QuickSearchModalController);
}
