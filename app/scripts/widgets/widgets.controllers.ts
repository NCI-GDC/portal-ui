module ngApp.widgets.controllers {
  import IWidget = ngApp.widgets.models.IWidget;
  import IWidgets = ngApp.widgets.models.IWidgets;

  export interface IWidgetsController {
    widgets: IWidgets;
  }

  class WidgetsController implements IWidgetsController {
    /* @ngInject */
    constructor(public widgets: IWidgets) {}
  }

  export interface IWidgetController {
    widget: IWidget;
  }

  class WidgetController implements IWidgetController {
    /* @ngInject */
    constructor(public widget: IWidget) {}
  }

  angular
      .module("widgets.controller", [
        "widgets.services"
      ])
      .controller("WidgetsController", WidgetsController)
      .controller("WidgetController", WidgetController);
}
