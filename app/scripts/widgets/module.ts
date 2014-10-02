module ngApp.widgets {
  "use strict";

  import IWidgetsService = ngApp.widgets.services.IWidgetsService;
  import IWidget = ngApp.widgets.models.IWidget;

  /* @ngInject */
  function widgetsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("widgets", {
      url: "/widgets",
      controller: "WidgetsController as wsc",
      templateUrl: "widgets/templates/widgets.html",
      resolve: {
        widgets: (WidgetsService: IWidgetsService) => {
          return WidgetsService.getWidgets();
        }}
    });

    $stateProvider.state("widget", {
      url: "/widgets/:widgetId",
      controller: "WidgetController as wc",
      templateUrl: "widgets/templates/widget.html",
      resolve: {
        widget: ($stateParams: ng.ui.IStateParamsService, WidgetsService: IWidgetsService): ng.IPromise<IWidget> => {
          return WidgetsService.getWidget($stateParams["widgetId"]);
        }
      }
    });
  }

  angular
      .module("ngApp.widgets", [
        "widgets.controller",
        "ui.router.state"
      ])
      .config(widgetsConfig);
}
