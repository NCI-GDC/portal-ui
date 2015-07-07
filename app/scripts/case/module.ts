module ngApp.cases {
  "use strict";

  import ICasesService = ngApp.cases.services.ICasesService;
  import ICase = ngApp.cases.models.ICase;

  /* @ngInject */
  function casesConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("case", {
      url: "/cases/:caseId",
      controller: "CaseController as pc",
      templateUrl: "case/templates/case.html",
      resolve: {
        case: ($stateParams: ng.ui.IStateParamsService, CasesService: ICasesService): ng.IPromise<ICase> => {
          return CasesService.getCase($stateParams["caseId"], {
            fields: [
              "case_id",
              "submitter_id",
              "annotations.annotation_id"
           ],
           expand: [
            "clinical",
            "files",
            "project",
            "project.program",
            "summary",
            "summary.experimental_strategies",
            "summary.data_types",
            "samples",
            "samples.portions",
            "samples.portions.analytes",
            "samples.portions.analytes.aliquots",
            "samples.portions.analytes.aliquots.annotations",
            "samples.portions.analytes.annotations",
            "samples.portions.submitter_id",
            "samples.portions.slides",
            "samples.portions.annotations",
            "samples.portions.center",
           ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.cases", [
        "cases.controller",
        "ui.router.state"
      ])
      .config(casesConfig);
}
