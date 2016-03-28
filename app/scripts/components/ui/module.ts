module ngApp.components.ui {

  angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html",
        "<div class=\"panel panel-default\">\n" +
        "  <div class=\"panel-heading\">\n" +
        "    <h4 class=\"panel-title\">\n" +
        "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\">" +
        "<span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
        "    </h4>\n" +
        "  </div>\n" +
        "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
        "	  <div class=\"list-group\" ng-transclude></div>\n" +
        "  </div>\n" +
        "</div>");
  }]);

  angular.module("components.ui", [
    "ui.scroll",
    "ui.file",
    "ui.search",
    "ui.string",
    "ui.control",
    "ui.biospecimen",
    "ui.count-card"
  ]);

}

