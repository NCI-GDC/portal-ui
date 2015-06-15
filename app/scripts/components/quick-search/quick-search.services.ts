module ngApp.components.quickSearch.services {

  interface IQuickSearchService {
    getDetails(type: string, id: string): ng.IPromise<any>;
    goTo(entity: string, id: string): void;
  }

  class QuickSearchService implements IQuickSearchService {
    /* @ngInject */
    constructor(private $state: ng.ui.IStateService, private $modalStack,
                private FilesService, private ParticipantsService, private ProjectsService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableParticipantsModel: TableiciousConfig,
                private ProjectTableModel: TableiciousConfig) {}

    getDetails(type: string, id: string): ng.IPromise<any> {
      if (type === "file") {
        return this.FilesService.getFile(id, {
            fields: this.SearchTableFilesModel.fields,
            expand: this.SearchTableFilesModel.expand
          })
          .then((data) => {
            return data;
          });
      } else if (type === "project") {
        return this.ProjectsService.getProject(id, {
            fields: this.ProjectTableModel.fields,
            expand: this.ProjectTableModel.fields
          })
          .then((data) => {
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
            return data;
          });
      }
    }

    goTo(entity: string, id: string): void {
      if (this.$state.params[entity + "Id"] === id) {
        this.$modalStack.dismissAll();
        return;
      }

      var options = {};
      options[entity + "Id"] = id;
      this.$state.go(entity, options, { inherit: false });
    }
  }

  angular
    .module("quickSearch.services", [
      "ui.bootstrap.modal",
      "facets.services",
      "files.services",
      "participants.services",
      "projects.services",
      "search.table.files.model",
      "search.table.participants.model",
      "projects.table.model"
    ])
    .service("QuickSearchService", QuickSearchService);
}