module ngApp.widgets.services {
  import IWidget = ngApp.widgets.models.IWidget;
  import Widget = ngApp.widgets.models.Widget;
  import IWidgets = ngApp.widgets.models.IWidgets;
  import Widgets = ngApp.widgets.models.Widgets;

  export interface IWidgetsService {
    getWidget(id: string): ng.IPromise<Widget>;
    getWidgets(params?: Object): ng.IPromise<Widgets>;
  }

  class WidgetsService implements IWidgetsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("widgets");
    }

    getWidget(id: string, params: Object = {}): ng.IPromise<Widget> {
      return this.ds.get(id, params).then(function (response) {
        return new Widget(response);
      });
    }

    getWidgets(params: Object = {}): ng.IPromise<Widgets> {
      return this.ds.get("", params).then(function (response) {
        return new Widgets(response);
      });
    }
  }

  angular
      .module("widgets.services", ["widgets.models", "restangular"])
      .service("WidgetsService", WidgetsService);
}
